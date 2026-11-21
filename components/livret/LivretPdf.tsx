/**
 * Document PDF du livret, généré dans le navigateur.
 * Importé dynamiquement au clic sur « Télécharger » : @react-pdf/renderer
 * n'alourdit pas le chargement de la page.
 *
 * Titres en Fraunces (public/fonts/fraunces, licence OFL), texte en Helvetica,
 * intégrée au moteur. Les textes passent par pourPdf : Helvetica n'a que le
 * jeu de caractères WinAnsi. Les cases à cocher et les puces sont dessinées.
 */
import { Document, Page, View, Text, Image, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import { pourPdf, teinte, type BlocRendu, type LivretRendu } from "@/lib/livret/livret";

Font.register({ family: "Fraunces", src: "/fonts/fraunces/fraunces-latin-600-normal.woff", fontWeight: 600 });
// Pas de césure automatique : l'algorithme par défaut est anglais et coupe mal le français.
Font.registerHyphenationCallback(mot => [mot]);

const INK = "#1F2A2E", DIM = "#66707A", LINE = "#E3E7E5";
const MARGE = 52;
const SERIF = { fontFamily: "Fraunces", fontWeight: 600 } as const;

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 76, paddingHorizontal: MARGE, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.5 },
  couverture: { paddingBottom: 76, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.5 },

  // Couverture
  bandeau: { width: 595.28, height: 300, objectFit: "cover" },
  bandeauCouleur: { width: 595.28, height: 190 },
  corps: { paddingHorizontal: MARGE },
  badge: { width: 76, height: 76, marginTop: -38, padding: 8, backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 0.6, borderColor: LINE },
  badgeLogo: { width: 58, height: 58, objectFit: "contain" },
  surtitre: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.6, textTransform: "uppercase", marginTop: 26, marginBottom: 8 },
  titre: { ...SERIF, fontSize: 38, lineHeight: 1.1, marginBottom: 6 },
  sousTitre: { fontSize: 13, lineHeight: 1.35, color: DIM, marginBottom: 26 },
  fiche: { flexDirection: "row", flexWrap: "wrap", marginBottom: 22 },
  ficheCase: { width: "50%", paddingTop: 9, paddingBottom: 10, paddingRight: 14, borderTopWidth: 0.6, borderTopColor: LINE },
  ficheLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.1, textTransform: "uppercase", color: DIM, marginBottom: 2 },
  ficheValeur: { fontSize: 10.5, lineHeight: 1.35 },
  intro: { fontFamily: "Helvetica-Oblique", fontSize: 10.5, lineHeight: 1.6, paddingLeft: 12, borderLeftWidth: 2 },

  // Sections
  entete: { marginTop: 30, marginBottom: 14 },
  enteteTete: { marginTop: 4, marginBottom: 14 },
  numero: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.6, marginBottom: 4 },
  h1: { ...SERIF, fontSize: 24, lineHeight: 1.15, paddingBottom: 8, borderBottomWidth: 0.6, borderBottomColor: LINE },
  h2: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.1, textTransform: "uppercase", marginTop: 14, marginBottom: 6 },
  p: { marginBottom: 6 },

  table: { marginBottom: 8 },
  row: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 0.6, borderBottomColor: LINE },
  cellLabel: { width: 140, paddingRight: 10, fontSize: 9, color: DIM },
  cellValue: { flex: 1, fontSize: 10 },

  carte: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 10 },
  carteRow: { flexDirection: "row", paddingVertical: 6 },
  carteLabel: { width: 124, paddingRight: 10, fontSize: 9, color: DIM, paddingTop: 2 },
  carteValeur: { flex: 1, fontSize: 10 },
  carteValeurForte: { flex: 1, fontSize: 13, fontFamily: "Helvetica-Bold" },

  encadre: { borderRadius: 6, borderLeftWidth: 3, paddingVertical: 10, paddingHorizontal: 14, marginTop: 10, marginBottom: 8 },
  encadreTitre: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 4 },

  item: { flexDirection: "row", marginBottom: 4 },
  puce: { width: 4, height: 4, borderRadius: 2, marginTop: 5.5, marginRight: 9 },
  caseBox: { width: 9, height: 9, borderWidth: 1, borderRadius: 2, marginTop: 2.5, marginRight: 8 },
  itemTexte: { flex: 1 },

  pied: { position: "absolute", bottom: 32, left: MARGE, right: MARGE, paddingTop: 8, borderTopWidth: 0.6, borderTopColor: LINE, fontSize: 8, color: DIM },
});

/** Une valeur courte (réseau, mot de passe) s'affiche en grand dans une carte. */
const VALEUR_FORTE_MAX = 40;

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  if (b.type === "texte" && b.encadre) {
    return (
      <View style={[s.encadre, { backgroundColor: teinte(couleur, 0.07), borderLeftColor: couleur }]} wrap={false}>
        {b.titre ? <Text style={[s.encadreTitre, { color: couleur }]}>{b.titre}</Text> : null}
        <Text>{b.texte}</Text>
      </View>
    );
  }
  if (b.type === "tableau" && b.style === "carte") {
    return (
      <View wrap={false}>
        {b.titre ? <Text style={[s.h2, { color: couleur }]}>{b.titre}</Text> : null}
        <View style={[s.carte, { backgroundColor: teinte(couleur, 0.07) }]}>
          {b.lignes.map((l, i) => (
            <View key={`${i}-${l.label}`} style={s.carteRow}>
              <Text style={s.carteLabel}>{l.label}</Text>
              <Text style={l.valeur.length <= VALEUR_FORTE_MAX ? s.carteValeurForte : s.carteValeur}>{l.valeur}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
  const titre = b.titre ? <Text style={[s.h2, { color: couleur }]}>{b.titre}</Text> : null;
  const item = (texte: string, i: number) => (
    <View key={`${i}-${texte}`} style={s.item} wrap={false}>
      {b.type === "liste" && b.style === "cases"
        ? <View style={[s.caseBox, { borderColor: couleur }]} />
        : <View style={[s.puce, { backgroundColor: couleur }]} />}
      <Text style={s.itemTexte}>{texte}</Text>
    </View>
  );
  // L'intertitre ne reste jamais seul en bas de page : il est lié au tableau,
  // aux premières lignes du texte ou au premier élément de la liste.
  if (b.type === "tableau") {
    return (
      <View style={s.table} wrap={false}>
        {titre}
        {b.lignes.map((l, i) => (
          <View key={`${i}-${l.label}`} style={s.row}>
            <Text style={s.cellLabel}>{l.label}</Text>
            <Text style={s.cellValue}>{l.valeur}</Text>
          </View>
        ))}
      </View>
    );
  }
  if (b.type === "texte") {
    return (
      <View>
        {titre}
        <Text style={s.p} orphans={3}>{b.texte}</Text>
      </View>
    );
  }
  const [premier, ...suite] = b.items;
  return (
    <View>
      <View wrap={false}>
        {titre}
        {item(premier, 0)}
      </View>
      {suite.map((t, i) => item(t, i + 1))}
    </View>
  );
}

function LivretDocument({ livret }: { livret: LivretRendu }) {
  const { couverture: c, couleur } = livret;
  // Texte fixe, sans numéro de page : avec @react-pdf/renderer 4.9 et React 19,
  // un <Text render={…}> ne s'affiche pas, et le pied de page entier disparaissait.
  const pied = livret.pied ? <Text style={s.pied} fixed>{livret.pied}</Text> : null;
  return (
    <Document creator="Timevo" producer="Timevo" title={c.sousTitre}>
      <Page size="A4" style={s.couverture}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, sans attribut alt */}
        {livret.photo ? <Image src={livret.photo} style={s.bandeau} /> : <View style={[s.bandeauCouleur, { backgroundColor: couleur }]} />}
        <View style={s.corps}>
          {livret.logo ? (
            <View style={s.badge}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, sans attribut alt */}
              <Image src={livret.logo} style={s.badgeLogo} />
            </View>
          ) : null}
          {c.surtitre ? <Text style={[s.surtitre, { color: couleur }, livret.logo ? {} : { marginTop: 34 }]}>{c.surtitre}</Text> : <View style={{ height: 34 }} />}
          <Text style={s.titre}>{c.titre}</Text>
          <Text style={s.sousTitre}>{c.sousTitre}</Text>
          {c.tableau.length > 0 && (
            <View style={s.fiche}>
              {c.tableau.map((l, i) => (
                <View key={`${i}-${l.label}`} style={s.ficheCase} wrap={false}>
                  <Text style={s.ficheLabel}>{l.label}</Text>
                  <Text style={s.ficheValeur}>{l.valeur}</Text>
                </View>
              ))}
            </View>
          )}
          {c.intro ? <Text style={[s.intro, { borderLeftColor: couleur }]}>{c.intro}</Text> : null}
        </View>
        {pied}
      </Page>
      <Page size="A4" style={s.page}>
        {livret.sections.map((sec, i) => (
          <View key={`${i}-${sec.titre}`} break={i > 0 && sec.sautAvant}>
            {/* Le titre de section reste avec son premier bloc : jamais seul en bas de page. */}
            <View wrap={false}>
              <View style={i === 0 || sec.sautAvant ? s.enteteTete : s.entete}>
                <Text style={[s.numero, { color: couleur }]}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={s.h1}>{sec.titre}</Text>
              </View>
              <Bloc b={sec.blocs[0]} couleur={couleur} />
            </View>
            {sec.blocs.slice(1).map((b, j) => <Bloc key={j} b={b} couleur={couleur} />)}
          </View>
        ))}
        {pied}
      </Page>
    </Document>
  );
}

/** Copie du livret dont tous les textes sont compatibles avec la police du PDF. */
function nettoyer(l: LivretRendu): LivretRendu {
  const lignes = (ls: { label: string; valeur: string }[]) => ls.map(x => ({ label: pourPdf(x.label), valeur: pourPdf(x.valeur) }));
  const titre = (t: string | undefined) => (t ? { titre: pourPdf(t) } : {});
  const bloc = (b: BlocRendu): BlocRendu => {
    if (b.type === "tableau") return { ...b, ...titre(b.titre), lignes: lignes(b.lignes) };
    if (b.type === "texte") return { ...b, ...titre(b.titre), texte: pourPdf(b.texte) };
    return { ...b, ...titre(b.titre), items: b.items.map(pourPdf) };
  };
  return {
    ...l,
    couverture: {
      surtitre: l.couverture.surtitre === null ? null : pourPdf(l.couverture.surtitre),
      titre: pourPdf(l.couverture.titre),
      sousTitre: pourPdf(l.couverture.sousTitre),
      tableau: lignes(l.couverture.tableau),
      intro: l.couverture.intro === null ? null : pourPdf(l.couverture.intro),
    },
    sections: l.sections.map(sec => ({ ...sec, titre: pourPdf(sec.titre), blocs: sec.blocs.map(bloc) })),
    pied: l.pied === null ? null : pourPdf(l.pied),
  };
}

export async function genererPdf(livret: LivretRendu): Promise<Blob> {
  return pdf(<LivretDocument livret={nettoyer(livret)} />).toBlob();
}
