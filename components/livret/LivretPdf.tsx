/**
 * Document PDF du livret, généré dans le navigateur.
 * Importé dynamiquement au clic sur « Télécharger » : @react-pdf/renderer
 * n'alourdit pas le chargement de la page.
 *
 * Police Helvetica intégrée au moteur (accents français couverts). Les cases
 * à cocher sont dessinées (le caractère ☐ n'existe pas dans Helvetica).
 */
import { Document, Page, View, Text, Image, StyleSheet, pdf } from "@react-pdf/renderer";
import type { BlocRendu, LivretRendu } from "@/lib/livret/livret";

const INK = "#1F2A2E", DIM = "#5B6670", LINE = "#D5DCD9", SOFT = "#F1F4F3";

const s = StyleSheet.create({
  page: { paddingTop: 56, paddingBottom: 64, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.45 },
  surtitre: { fontSize: 9.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },
  titre: { fontSize: 32, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  sousTitre: { fontSize: 14, color: DIM, marginBottom: 28 },
  logo: { maxWidth: 160, maxHeight: 64, objectFit: "contain", marginBottom: 36 },
  h1: { fontSize: 17, fontFamily: "Helvetica-Bold", paddingBottom: 5, borderBottomWidth: 1.2, marginTop: 18, marginBottom: 10 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 5 },
  p: { marginBottom: 6 },
  table: { borderWidth: 0.6, borderColor: LINE, marginBottom: 8 },
  row: { flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: LINE },
  rowLast: { flexDirection: "row" },
  cellLabel: { width: 130, backgroundColor: SOFT, padding: 6, fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  cellValue: { flex: 1, padding: 6, fontSize: 9.5 },
  item: { flexDirection: "row", marginBottom: 3 },
  puce: { width: 14 },
  caseBox: { width: 8, height: 8, borderWidth: 0.8, borderColor: INK, marginTop: 2.5, marginRight: 6 },
  itemTexte: { flex: 1 },
  pied: { position: "absolute", bottom: 28, left: 56, right: 56, textAlign: "center", fontSize: 8, color: DIM },
});

function Bloc({ b, couleur }: { b: BlocRendu; couleur: string }) {
  return (
    <View>
      {b.titre ? <Text style={[s.h2, { color: couleur }]}>{b.titre}</Text> : null}
      {b.type === "tableau" && (
        <View style={s.table} wrap={false}>
          {b.lignes.map((l, i) => (
            <View key={`${i}-${l.label}`} style={i === b.lignes.length - 1 ? s.rowLast : s.row}>
              <Text style={s.cellLabel}>{l.label}</Text>
              <Text style={s.cellValue}>{l.valeur}</Text>
            </View>
          ))}
        </View>
      )}
      {b.type === "texte" && <Text style={s.p}>{b.texte}</Text>}
      {b.type === "liste" && b.items.map((item, i) => (
        <View key={`${i}-${item}`} style={s.item} wrap={false}>
          {b.style === "cases" ? <View style={s.caseBox} /> : <Text style={s.puce}>•</Text>}
          <Text style={s.itemTexte}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function LivretDocument({ livret }: { livret: LivretRendu }) {
  const { couverture: c, couleur } = livret;
  const pied = livret.pied ? (
    <Text style={s.pied} fixed render={({ pageNumber }) => `${livret.pied}  ·  ${pageNumber}`} />
  ) : (
    <Text style={s.pied} fixed render={({ pageNumber }) => `${pageNumber}`} />
  );
  return (
    <Document creator="Timevo" producer="Timevo" title={c.sousTitre}>
      <Page size="A4" style={s.page}>
        <View style={{ marginTop: 90 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de @react-pdf/renderer, sans attribut alt */}
          {livret.logo ? <Image src={livret.logo} style={s.logo} /> : null}
          {c.surtitre ? <Text style={[s.surtitre, { color: couleur }]}>{c.surtitre}</Text> : null}
          <Text style={s.titre}>{c.titre}</Text>
          <Text style={s.sousTitre}>{c.sousTitre}</Text>
          {c.tableau.length > 0 && <Bloc b={{ type: "tableau", lignes: c.tableau }} couleur={couleur} />}
          {c.intro ? <Text style={[s.p, { marginTop: 18 }]}>{c.intro}</Text> : null}
        </View>
        {pied}
      </Page>
      <Page size="A4" style={s.page}>
        {livret.sections.map((sec, i) => (
          <View key={`${i}-${sec.titre}`} break={i > 0 && sec.sautAvant}>
            <Text style={[s.h1, { borderBottomColor: couleur }]} minPresenceAhead={60}>{sec.titre}</Text>
            {sec.blocs.map((b, j) => <Bloc key={j} b={b} couleur={couleur} />)}
          </View>
        ))}
        {pied}
      </Page>
    </Document>
  );
}

export async function genererPdf(livret: LivretRendu): Promise<Blob> {
  return pdf(<LivretDocument livret={livret} />).toBlob();
}
