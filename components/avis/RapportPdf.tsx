/**
 * Rapport d'analyse d'avis en PDF, généré dans le navigateur (import dynamique).
 * Même habillage que le livret : titres Fraunces, texte Helvetica, textes passés par pourPdf.
 */
import { Document, Page, View, Text, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import { pourPdf } from "@/lib/livret/livret";
import type { Rapport } from "@/lib/avis/types";

Font.register({ family: "Fraunces", src: "/fonts/fraunces/fraunces-latin-600-normal.woff", fontWeight: 600 });
Font.registerHyphenationCallback(mot => [mot]);

const INK = "#1F2A2E", DIM = "#66707A", LINE = "#E3E7E5", ACCENT = "#1f5bc7", TEINTE = "#eef3fc";
const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 70, paddingHorizontal: 52, fontFamily: "Helvetica", fontSize: 10.5, color: INK, lineHeight: 1.5 },
  sur: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT, marginBottom: 6 },
  titre: { fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, lineHeight: 1.1, marginBottom: 4 },
  dim: { color: DIM, fontSize: 10 },
  h2: { fontFamily: "Fraunces", fontWeight: 600, fontSize: 17, marginTop: 22, marginBottom: 10, paddingBottom: 6, borderBottomWidth: 0.6, borderBottomColor: LINE },
  chiffres: { flexDirection: "row", marginTop: 18 },
  chiffre: { flex: 1, backgroundColor: TEINTE, borderRadius: 6, padding: 10, marginRight: 8 },
  chiffreL: { fontSize: 8, color: DIM, textTransform: "uppercase", letterSpacing: 0.8 },
  chiffreV: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 3 },
  ligne: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  barre: { height: 7, backgroundColor: LINE, borderRadius: 4, flex: 1, marginHorizontal: 10 },
  theme: { marginBottom: 8 },
  themeT: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  citation: { fontFamily: "Helvetica-Oblique", color: DIM, fontSize: 9.5 },
  avis: { backgroundColor: TEINTE, borderRadius: 6, padding: 10, marginBottom: 8 },
  pied: { position: "absolute", bottom: 30, left: 52, right: 52, paddingTop: 8, borderTopWidth: 0.6, borderTopColor: LINE, fontSize: 8, color: DIM },
});

const v = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const t = (x: string) => pourPdf(x);

function Document_({ r }: { r: Rapport }) {
  const rep = new Map(r.analyse?.reponses.map(x => [x.avisId, x.texte]) ?? []);
  const lignes = [{ f: r.fiche, moi: true }, ...r.concurrents.map(f => ({ f, moi: false }))];
  return (
    <Document creator="Timevo" producer="Timevo" title={t(`Analyse des avis Google · ${r.fiche.nom}`)}>
      <Page size="A4" style={s.page}>
        <Text style={s.sur}>Analyse de vos avis Google</Text>
        <Text style={s.titre}>{t(r.fiche.nom)}</Text>
        <Text style={s.dim}>{t(r.fiche.adresse)} · {new Date(r.genereLe).toLocaleDateString("fr-FR")}</Text>
        <View style={s.chiffres}>
          {[
            ["Note", r.fiche.note === null ? "-" : `${v(r.fiche.note)} / 5`],
            ["Avis analysés", String(r.nbAvisAnalyses)],
            ["Taux de réponse", r.tauxReponse === null ? "-" : `${r.tauxReponse} %`],
            ["Délai de réponse", r.delaiMoyenJours === null ? "-" : `${v(r.delaiMoyenJours)} j`],
          ].map(([l, x]) => (
            <View key={l} style={s.chiffre}><Text style={s.chiffreL}>{t(l)}</Text><Text style={s.chiffreV}>{t(x)}</Text></View>
          ))}
        </View>
        {r.tronque ? <Text style={[s.dim, { marginTop: 6 }]}>Analyse des {r.nbAvisAnalyses} avis les plus récents.</Text> : null}

        {r.concurrents.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>Face à vos concurrents</Text>
            {lignes.map(({ f, moi }) => (
              <View key={f.placeId} style={s.ligne}>
                <Text style={{ width: 150, fontFamily: moi ? "Helvetica-Bold" : "Helvetica", fontSize: 9.5 }}>{t(moi ? `${f.nom} (vous)` : f.nom)}</Text>
                <View style={s.barre}><View style={{ width: `${((f.note ?? 0) / 5) * 100}%`, height: 7, borderRadius: 4, backgroundColor: moi ? ACCENT : DIM }} /></View>
                <Text style={{ width: 90, fontSize: 9.5, textAlign: "right" }}>{f.note === null ? "-" : `${v(f.note)} / 5`} · {f.nbAvis}</Text>
              </View>
            ))}
          </View>
        )}

        {r.analyse && (
          <View>
            <Text style={s.h2} minPresenceAhead={60}>Ce que vos clients apprécient</Text>
            {r.analyse.pointsForts.map(th => (
              <View key={th.titre} style={s.theme} wrap={false}>
                <Text style={s.themeT}>{t(th.titre)}</Text>
                {th.citations.map(c => <Text key={c} style={s.citation}>« {t(c)} »</Text>)}
              </View>
            ))}
            <Text style={s.h2} minPresenceAhead={60}>Ce qu&apos;ils vous reprochent</Text>
            {r.analyse.reproches.map(th => (
              <View key={th.titre} style={s.theme} wrap={false}>
                <Text style={s.themeT}>{t(th.titre)}</Text>
                {th.citations.map(c => <Text key={c} style={s.citation}>« {t(c)} »</Text>)}
              </View>
            ))}
          </View>
        )}

        {r.sansReponse.length > 0 && (
          <View>
            <Text style={s.h2} minPresenceAhead={80}>Vos avis sans réponse, avec une réponse prête</Text>
            {r.sansReponse.map(a => (
              <View key={a.id} style={s.avis} wrap={false}>
                <Text style={s.dim}>{a.note} / 5{a.date ? ` · ${new Date(a.date).toLocaleDateString("fr-FR")}` : ""}</Text>
                <Text style={s.citation}>{a.texte ? `« ${t(a.texte)} »` : "(note sans commentaire)"}</Text>
                {rep.get(a.id) ? <Text style={{ marginTop: 4 }}>{t(rep.get(a.id)!)}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {r.analyse && r.analyse.recommandations.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>Trois choses à faire</Text>
            {r.analyse.recommandations.map((x, i) => <Text key={x} style={{ marginBottom: 5 }}>{i + 1}. {t(x)}</Text>)}
          </View>
        )}

        <View wrap={false} style={{ marginTop: 18, padding: 12, backgroundColor: TEINTE, borderRadius: 6 }}>
          <Text>Chez nos clients, un agent IA rédige chaque jour la réponse à chaque nouvel avis ; vous la validez en un clic.</Text>
          <Text style={{ marginTop: 4, fontFamily: "Helvetica-Bold" }}>Diagnostic gratuit de 30 minutes : timevo.io</Text>
        </View>
        <Text style={s.pied} fixed>Analyse réalisée par Timevo · timevo.io</Text>
      </Page>
    </Document>
  );
}

export function nomFichierRapport(r: Rapport): string {
  const base = r.fiche.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return `analyse-avis-google${base ? `-${base}` : ""}.pdf`;
}

export async function genererPdfRapport(r: Rapport): Promise<Blob> {
  return pdf(<Document_ r={r} />).toBlob();
}
