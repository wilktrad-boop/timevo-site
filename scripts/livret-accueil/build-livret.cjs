/**
 * Génère le livret d'accueil location courte durée proposé en ressource
 * sur /fr/ressources/livret-accueil-airbnb.
 *
 *   node scripts/livret-accueil/build-livret.cjs <dossier de sortie>
 *
 * Produit deux fichiers :
 *   - livret-accueil-modele.docx   : le modèle à compléter, champs [entre crochets] surlignés
 *   - livret-accueil-exemple.docx  : le même livret rempli pour une conciergerie fictive
 *     (celle de la démo, « Conciergerie Rive Gauche »), converti ensuite en PDF par Word.
 *
 * `docx` n'est pas une dépendance du projet : il est lu depuis l'installation globale.
 * Le contenu vit dans ./contenu.cjs, un seul texte pour les deux versions.
 */
const path = require("path");
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, AlignmentType, LevelFormat, Footer, PageNumber,
  HeadingLevel, PageBreak, TableLayoutType,
} = require("docx");
const { SECTIONS, COVER } = require("./contenu.cjs");

const OUT = process.argv[2] || ".";
const FONT = "Arial";
const INK = "1F2A2E";
const DIM = "5B6670";
const ACCENT = "2F5D50"; // vert sobre : la conciergerie le remplace par sa couleur
const LINE = "D5DCD9";
const SOFT = "F1F4F3";

// A4, marges 2 cm
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - 2 * MARGIN;

/**
 * Découpe un texte portant des champs `[...]` en runs.
 * Version modèle : le champ reste entre crochets, surligné.
 * Version exemple : le champ est remplacé par sa valeur d'exemple (`[Libellé|valeur]`).
 */
function runs(text, filled, base = {}) {
  const out = [];
  // Une valeur d'exemple vide (`[consigne|]`) : consigne visible dans le modèle seulement.
  const re = /\[([^\]|]+)\|([^\]]*)\]/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    if (!filled) out.push(new TextRun({ text: `[${m[1]}]`, highlight: "yellow", ...base }));
    else if (m[2]) out.push(new TextRun({ text: m[2], ...base }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last).trimEnd() ? text.slice(last) : "", ...base }));
  return out;
}

const p = (text, filled, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 300 },
  ...opts.para,
  children: runs(text, filled, { font: FONT, size: 22, color: INK, ...opts.run }),
});

const bullet = (text, filled) => new Paragraph({
  numbering: { reference: "puces", level: 0 },
  spacing: { after: 80, line: 290 },
  children: runs(text, filled, { font: FONT, size: 22, color: INK }),
});

const check = (text, filled) => new Paragraph({
  numbering: { reference: "cases", level: 0 },
  spacing: { after: 80, line: 290 },
  children: runs(text, filled, { font: FONT, size: 22, color: INK }),
});

// Saut « avant » le titre plutôt qu'un paragraphe PageBreak après la section :
// ce dernier crée une page blanche quand la section remplit déjà sa page.
function h1(text, pageBreakBefore = false) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [new TextRun({ text })],
  });
}

function infoTable(rows, filled) {
  const LABEL_W = 3000, VALUE_W = CONTENT_W - LABEL_W;
  const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [LABEL_W, VALUE_W],
    layout: TableLayoutType.FIXED,
    rows: rows.map(([label, value]) => new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: LABEL_W, type: WidthType.DXA },
          borders,
          shading: { type: ShadingType.CLEAR, color: "auto", fill: SOFT },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({ children: [new TextRun({ text: label, font: FONT, size: 20, bold: true, color: INK })] })],
        }),
        new TableCell({
          width: { size: VALUE_W, type: WidthType.DXA },
          borders,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({ children: runs(value, filled, { font: FONT, size: 20, color: INK }) })],
        }),
      ],
    })),
  });
}

const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] });

function block(b, filled) {
  switch (b.type) {
    case "p": return [p(b.text, filled)];
    case "note": return [p(b.text, filled, { run: { color: DIM, italics: true, size: 20 } })];
    case "h2": return [new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: b.text })] })];
    case "bullets": return b.items.map(t => bullet(t, filled));
    case "checks": return b.items.map(t => check(t, filled));
    case "table": return [infoTable(b.rows, filled), spacer()];
    default: throw new Error("bloc inconnu " + b.type);
  }
}

function cover(filled) {
  return [
    new Paragraph({ spacing: { before: 2400, after: 200 }, children: runs(COVER.eyebrow, filled, { font: FONT, size: 20, color: ACCENT, bold: true, characterSpacing: 40 }) }),
    new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: COVER.title, font: FONT, size: 64, bold: true, color: INK })] }),
    new Paragraph({ spacing: { after: 600 }, children: runs(COVER.subtitle, filled, { font: FONT, size: 28, color: DIM }) }),
    infoTable(COVER.rows, filled),
    spacer(),
    p(COVER.intro, filled, { para: { spacing: { before: 400, after: 120, line: 320 } } }),
    p(filled ? COVER.exampleNote : COVER.howto, filled, { run: { color: DIM, size: 18, italics: true }, para: { spacing: { before: 600 } } }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function build(filled) {
  const children = [...cover(filled)];
  SECTIONS.forEach((s, i) => {
    children.push(h1(s.title, i > 0 && Boolean(SECTIONS[i - 1].pageBreakAfter)));
    s.blocks.forEach(b => children.push(...block(b, filled)));
  });

  return new Document({
    creator: "Timevo",
    title: "Livret d'accueil — location courte durée",
    styles: {
      default: { document: { run: { font: FONT, size: 22, color: INK } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 34, bold: true, color: INK },
          paragraph: { spacing: { before: 360, after: 200 }, keepNext: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 24, bold: true, color: ACCENT },
          paragraph: { spacing: { before: 240, after: 100 }, keepNext: true, outlineLevel: 1 } },
      ],
    },
    numbering: {
      config: [
        { reference: "puces", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
        { reference: "cases", levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 300 } }, run: { font: "Segoe UI Symbol" } } }] },
      ],
    },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...runs(COVER.footer, filled, { font: FONT, size: 16, color: DIM }),
            new TextRun({ text: "  ·  ", font: FONT, size: 16, color: DIM }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: DIM }),
          ],
        })] }),
      },
      children,
    }],
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, filled] of [["livret-accueil-modele.docx", false], ["livret-accueil-exemple.docx", true]]) {
    const buf = await Packer.toBuffer(build(filled));
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(name, Math.round(buf.length / 1024) + " Ko");
  }
})();
