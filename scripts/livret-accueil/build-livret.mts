/**
 * Génère le modèle Word et l'exemple du livret d'accueil, à partir de
 * lib/livret/contenu.ts (source partagée avec le générateur en ligne).
 *
 *   NODE_PATH="$(npm root -g)" node scripts/livret-accueil/build-livret.mts <dossier de sortie>
 *
 * Puis convertir l'exemple en PDF avec Word (cf. commentaire en fin de fichier).
 * `docx` n'est pas une dépendance du projet : installation globale.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { CHAMPS, COUVERTURE, ETAPES, type Champ, type LigneTableau } from "../../lib/livret/contenu.ts";

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, AlignmentType, LevelFormat, Footer, PageNumber,
  HeadingLevel, PageBreak, TableLayoutType,
} = require("docx");

const OUT = process.argv[2] || ".";
const FONT = "Arial", INK = "1F2A2E", DIM = "5B6670", ACCENT = "2F5D50", LINE = "D5DCD9", SOFT = "F1F4F3";
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - 2 * MARGIN;
const PAR_ID = new Map<string, Champ>(CHAMPS.map(c => [c.id, c]));

type Mode = "modele" | "exemple";

function valeurChamp(c: Champ, mode: Mode): string | null {
  if (c.defaut) return c.defaut;
  return mode === "exemple" ? c.exemple : null;
}

/** Runs d'un gabarit `{id}` : surligné `[Libellé]` (modèle) ou valeur d'exemple. */
function runsGabarit(gabarit: string, mode: Mode, base: Record<string, unknown>) {
  const out: unknown[] = [];
  let last = 0;
  for (const m of gabarit.matchAll(/\{(\w+)\}/g)) {
    if (m.index! > last) out.push(new TextRun({ text: gabarit.slice(last, m.index), ...base }));
    const c = PAR_ID.get(m[1])!;
    const v = valeurChamp(c, mode);
    out.push(v ? new TextRun({ text: v, ...base }) : new TextRun({ text: `[${c.label}]`, highlight: "yellow", ...base }));
    last = m.index! + m[0].length;
  }
  if (last < gabarit.length) out.push(new TextRun({ text: gabarit.slice(last), ...base }));
  return out;
}

const corps = { font: FONT, size: 22, color: INK };

function para(runs: unknown[], spacing = { after: 120, line: 300 }) {
  return new Paragraph({ spacing, children: runs });
}

function h1(text: string, pageBreakBefore: boolean) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, pageBreakBefore,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [new TextRun({ text })],
  });
}

const h2 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] });

function tableau(lignesT: LigneTableau[], mode: Mode) {
  const LABEL_W = 3000, VALUE_W = CONTENT_W - LABEL_W;
  const b = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const borders = { top: b, bottom: b, left: b, right: b };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [LABEL_W, VALUE_W], layout: TableLayoutType.FIXED,
    rows: lignesT.map(l => new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: LABEL_W, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, color: "auto", fill: SOFT },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: l.label, font: FONT, size: 20, bold: true, color: INK })] })] }),
      new TableCell({ width: { size: VALUE_W, type: WidthType.DXA }, borders, margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: runsGabarit(l.gabarit, mode, { font: FONT, size: 20, color: INK }) })] }),
    ] })),
  });
}

function blocChamp(champId: string, mode: Mode, style?: "puces" | "cases") {
  const c = PAR_ID.get(champId)!;
  const v = valeurChamp(c, mode);
  if (!v) {
    const run = new TextRun({ text: `[${c.label}]`, highlight: "yellow", ...corps });
    return [style ? new Paragraph({ numbering: { reference: style, level: 0 }, children: [run] }) : para([run])];
  }
  if (!style) return [para([new TextRun({ text: v, ...corps })])];
  return v.split("\n").filter(Boolean).map(item =>
    new Paragraph({ numbering: { reference: style, level: 0 }, spacing: { after: 80, line: 290 }, children: [new TextRun({ text: item, ...corps })] }));
}

function build(mode: Mode) {
  const children: unknown[] = [
    new Paragraph({ spacing: { before: 2400, after: 200 }, children: runsGabarit(COUVERTURE.surtitre, mode, { font: FONT, size: 20, color: ACCENT, bold: true, allCaps: true, characterSpacing: 40 }) }),
    new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: COUVERTURE.titre, font: FONT, size: 64, bold: true, color: INK })] }),
    new Paragraph({ spacing: { after: 600 }, children: runsGabarit(COUVERTURE.sousTitre, mode, { font: FONT, size: 28, color: DIM }) }),
    tableau(COUVERTURE.lignes, mode),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    ...blocChamp(COUVERTURE.intro, mode),
    para([new TextRun({ font: FONT, size: 18, color: DIM, italics: true, text: mode === "modele"
      ? "Modèle proposé par Timevo (timevo.io). Remplacez chaque champ surligné, supprimez les rubriques qui ne concernent pas votre logement et ajoutez votre logo en haut de cette page. Supprimez ensuite ce paragraphe. Version en ligne, avec export PDF : timevo.io/fr/ressources/livret-accueil-airbnb/creer"
      : "Exemple rempli pour une conciergerie fictive. Créez le vôtre en ligne sur timevo.io." })], { before: 600, after: 120, line: 300 }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
  for (const etape of ETAPES) for (const s of etape.sections) {
    children.push(h1(s.titre, Boolean(s.sautAvant)));
    for (const b of s.blocs) {
      if (b.titre) children.push(h2(b.titre));
      if (b.type === "tableau") children.push(tableau(b.lignes, mode), new Paragraph({ spacing: { after: 120 }, children: [] }));
      else children.push(...blocChamp(b.champ, mode, b.type === "liste" ? b.style : undefined));
    }
  }
  return new Document({
    creator: "Timevo", title: "Livret d'accueil — location courte durée",
    styles: {
      default: { document: { run: { font: FONT, size: 22, color: INK } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 34, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 200 }, keepNext: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 24, bold: true, color: ACCENT }, paragraph: { spacing: { before: 240, after: 100 }, keepNext: true, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [
      { reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
      { reference: "cases", levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } }, run: { font: "Segoe UI Symbol" } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        ...runsGabarit(COUVERTURE.pied, mode, { font: FONT, size: 16, color: DIM }),
        new TextRun({ text: "  ·  ", font: FONT, size: 16, color: DIM }),
        new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: DIM }),
      ] })] }) },
      children,
    }],
  });
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, mode] of [["livret-accueil-modele.docx", "modele"], ["livret-accueil-exemple.docx", "exemple"]] as const) {
  const buf: Buffer = await Packer.toBuffer(build(mode));
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(name, Math.round(buf.length / 1024) + " Ko");
}

// Conversion de l'exemple en PDF (PowerShell, Word installé) :
// $w = New-Object -ComObject Word.Application; $d = $w.Documents.Open("<dossier>\livret-accueil-exemple.docx", $false, $true)
// $d.ExportAsFixedFormat("<dossier>\livret-accueil-exemple.pdf", 17); $d.Close($false); $w.Quit()
