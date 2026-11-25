/**
 * Rapport d'analyse d'avis en PDF, généré dans le navigateur (import dynamique).
 * Aux couleurs de Timevo, comme la plaquette : couverture et page des offres sur le fond
 * violet très sombre du site, pages de lecture claires dérivées de la même teinte
 * (accent assombri à #1f5bc7 pour tenir l'AA). Inter partout. Textes passés par pourPdf.
 */
import { Document, Page, View, Text, Image, Font, StyleSheet, Svg, Defs, LinearGradient, Stop, Rect, pdf } from "@react-pdf/renderer";
import { pourPdf } from "@/lib/livret/livret";
import type { Rapport } from "@/lib/avis/types";
import { offres } from "@/lib/avis/offres";
import { CONSEIL_SANS_AVIS, ETOILES, phraseObjectif } from "./Rapport";

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/inter/inter-latin-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/inter/inter-latin-600-normal.woff", fontWeight: 600 },
    { src: "/fonts/inter/inter-latin-700-normal.woff", fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback(mot => [mot]);

// Sombre : les jetons du site (app/globals.css).
const BG = "#100c18", CARD = "#191424", BORDER = "#2c2440", TEXT = "#efecf5", DIM = "#9990ac", ACCENT = "#5fa8ff", VIOLET = "#a98aff";
// Clair : neutres dérivés de la même teinte violette.
const PAPIER = "#f7f5fb", ENCRE = "#1b1625", GRIS = "#5f5873", FILET = "#e4dfee", BLEU = "#1f5bc7", TEINTE = "#ece8f6", ROUGE = "#c2405e";
const LARGEUR = 595 - 2 * 48;

const s = StyleSheet.create({
  sombre: { backgroundColor: BG, color: TEXT, paddingTop: 44, paddingBottom: 64, paddingHorizontal: 48, fontFamily: "Inter", fontSize: 10, lineHeight: 1.5 },
  clair: { backgroundColor: PAPIER, color: ENCRE, paddingTop: 44, paddingBottom: 64, paddingHorizontal: 48, fontFamily: "Inter", fontSize: 10, lineHeight: 1.5 },
  sur: { fontSize: 8, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase" },
  titre: { fontSize: 30, fontWeight: 700, letterSpacing: -0.9, lineHeight: 1.1 },
  h2: { fontSize: 16, fontWeight: 700, letterSpacing: -0.4, marginTop: 20, marginBottom: 10 },
  tuile: { flex: 1, borderRadius: 8, padding: 10, marginRight: 8 },
  tuileL: { fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.8 },
  tuileV: { fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: -0.4 },
  ligne: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  pied: { position: "absolute", bottom: 26, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5 },
});

const v = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const t = (x: string) => pourPdf(x);
const origine = () => (typeof window === "undefined" ? "" : window.location.origin);

function Degrade({ id, largeur = LARGEUR, hauteur = 3 }: { id: string; largeur?: number; hauteur?: number }) {
  return (
    <Svg width={largeur} height={hauteur}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#4ec3ff" />
          <Stop offset="1" stopColor="#7c4dff" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={largeur} height={hauteur} rx={hauteur / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

function Pied({ sombre, nom }: { sombre: boolean; nom: string }) {
  return (
    <View style={[s.pied, { color: sombre ? DIM : GRIS }]} fixed>
      <Text>{t(`Analyse des avis Google · ${nom}`)}</Text>
      <Text>timevo.io</Text>
    </View>
  );
}

function Document_({ r }: { r: Rapport }) {
  const rep = new Map(r.analyse?.reponses.map(x => [x.avisId, x.texte]) ?? []);
  const lignes = [{ f: r.fiche, moi: true }, ...r.concurrents.map(f => ({ f, moi: false }))];
  const i = r.indicateurs;
  const objectif = phraseObjectif(r);
  const max = Math.max(1, ...i.repartition);
  const date = new Date(r.genereLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document creator="Timevo" producer="Timevo" title={t(`Analyse des avis Google · ${r.fiche.nom}`)}>
      {/* Couverture sombre : l'essentiel en un coup d'œil. */}
      <Page size="A4" style={s.sombre}>
        <Image src={`${origine()}/ressources/avis/timevo-logo-clair.png`} style={{ width: 96, height: 21, marginBottom: 40 }} />
        <Text style={[s.sur, { color: ACCENT, marginBottom: 10 }]}>Analyse de vos avis Google</Text>
        <Text style={s.titre}>{t(r.fiche.nom)}</Text>
        <Text style={{ color: DIM, marginTop: 6, marginBottom: 18 }}>{t(r.fiche.adresse)}{r.fiche.adresse ? " · " : ""}{t(date)}</Text>
        <Degrade id="g1" />

        <View style={{ flexDirection: "row", marginTop: 22 }}>
          {[
            ["Note Google", r.fiche.note === null ? "-" : `${v(r.fiche.note)} / 5`],
            ["Avis analysés", String(r.nbAvisAnalyses)],
            ["Taux de réponse", r.tauxReponse === null ? "-" : `${r.tauxReponse} %`],
            ["Délai de réponse", r.delaiMoyenJours === null ? "-" : `${v(r.delaiMoyenJours)} j`],
          ].map(([l, x], n) => (
            <View key={l} style={[s.tuile, { backgroundColor: CARD, borderWidth: 0.6, borderColor: BORDER, marginRight: n === 3 ? 0 : 8 }]}>
              <Text style={[s.tuileL, { color: DIM }]}>{t(l)}</Text>
              <Text style={[s.tuileV, { color: ACCENT }]}>{t(x)}</Text>
            </View>
          ))}
        </View>
        {r.tronque ? <Text style={{ color: DIM, marginTop: 6, fontSize: 8.5 }}>Analyse des {r.nbAvisAnalyses} avis les plus récents.</Text> : null}

        {r.concurrents.length > 0 && (
          <View wrap={false}>
            <Text style={[s.h2, { marginTop: 28 }]}>Face à vos concurrents</Text>
            {lignes.map(({ f, moi }) => (
              <View key={f.placeId} style={s.ligne}>
                <Text style={{ width: 160, fontSize: 9.5, fontWeight: moi ? 600 : 400, color: moi ? TEXT : DIM }}>{t(moi ? `${f.nom} (vous)` : f.nom)}</Text>
                <View style={{ height: 7, backgroundColor: BORDER, borderRadius: 4, flex: 1, marginHorizontal: 10 }}>
                  <View style={{ width: `${((f.note ?? 0) / 5) * 100}%`, height: 7, borderRadius: 4, backgroundColor: moi ? ACCENT : DIM }} />
                </View>
                <Text style={{ width: 90, fontSize: 9.5, textAlign: "right", color: moi ? TEXT : DIM }}>{f.note === null ? "-" : `${v(f.note)} / 5`} · {f.nbAvis} avis</Text>
              </View>
            ))}
          </View>
        )}

        {r.nbAvisAnalyses > 0 && (
          <View wrap={false} style={{ flexDirection: "row", marginTop: 26 }}>
            {[
              ["Sur 12 mois", `${i.douzeMois} avis`, `${v(i.parMois)} par mois`],
              ["3 étoiles ou moins", `${i.negatifs.douzeMois} avis`, `dont ${i.negatifs.sansReponse} sans réponse`],
              ["Sans réponse", `${i.sansReponseTotal} avis`, i.sansReponseTotal > 0 ? "réponses prêtes en page 2" : "toutes ont une réponse"],
            ].map(([l, x, sous], n) => (
              <View key={l} style={[s.tuile, { borderWidth: 0.6, borderColor: BORDER, marginRight: n === 2 ? 0 : 8 }]}>
                <Text style={[s.tuileL, { color: DIM }]}>{t(l)}</Text>
                <Text style={[s.tuileV, { color: TEXT, fontSize: 15 }]}>{t(x)}</Text>
                <Text style={{ color: DIM, fontSize: 8.5 }}>{t(sous)}</Text>
              </View>
            ))}
          </View>
        )}

        {objectif && (
          <View wrap={false} style={{ marginTop: 18, padding: 12, borderRadius: 8, backgroundColor: CARD, borderLeftWidth: 3, borderLeftColor: VIOLET }}>
            <Text style={[s.sur, { color: VIOLET, marginBottom: 4 }]}>Objectif</Text>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>{t(objectif.charAt(0).toUpperCase() + objectif.slice(1))}</Text>
          </View>
        )}
        <Pied sombre nom={r.fiche.nom} />
      </Page>

      {/* Pages claires : le détail. */}
      <Page size="A4" style={s.clair}>
        {r.nbAvisAnalyses === 0 ? (
          <View wrap={false}>
            <Text style={[s.h2, { marginTop: 0 }]}>Pas encore d&apos;avis à analyser</Text>
            <Text>{t(CONSEIL_SANS_AVIS)}</Text>
          </View>
        ) : (
          <View>
            <View wrap={false}>
              <Text style={[s.sur, { color: BLEU, marginBottom: 4 }]}>Le détail</Text>
              <Text style={[s.h2, { marginTop: 0 }]}>Vos avis en chiffres</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, marginRight: 24 }}>
                  {i.repartition.map((n, k) => (
                    <View key={ETOILES[k]} style={s.ligne}>
                      <Text style={{ width: 52, fontSize: 9, color: GRIS }}>{ETOILES[k]}</Text>
                      <View style={{ height: 7, backgroundColor: FILET, borderRadius: 4, flex: 1, marginHorizontal: 8 }}>
                        <View style={{ width: `${(n / max) * 100}%`, height: 7, borderRadius: 4, backgroundColor: k < 2 ? BLEU : k === 2 ? "#6a3fe0" : ROUGE }} />
                      </View>
                      <Text style={{ width: 24, fontSize: 9, textAlign: "right" }}>{n}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  {r.trimestres.map(q => (
                    <View key={q.libelle} style={[s.ligne, { justifyContent: "space-between", borderBottomWidth: 0.5, borderBottomColor: FILET, paddingBottom: 3 }]}>
                      <Text style={{ fontSize: 9, color: GRIS }}>{q.libelle}</Text>
                      <Text style={{ fontSize: 9 }}>{q.note === null ? "-" : `${v(q.note)} / 5`} · {q.nb} avis</Text>
                    </View>
                  ))}
                  <Text style={{ fontSize: 9, color: GRIS, marginTop: 4 }}>
                    {!i.partSansTexte ? "" : t(`${i.partSansTexte} % de notes sans commentaire.`)}
                  </Text>
                </View>
              </View>
            </View>

            {r.analyse ? (
              <View style={{ flexDirection: "row", marginTop: 6 }}>
                {[{ titre: "Ce que vos clients apprécient", themes: r.analyse.pointsForts, c: BLEU }, { titre: "Ce qu'ils vous reprochent", themes: r.analyse.reproches, c: ROUGE }].map((b, n) => (
                  <View key={b.titre} style={{ flex: 1, marginRight: n === 0 ? 16 : 0 }}>
                    <Text style={[s.h2, { fontSize: 13 }]}>{t(b.titre)}</Text>
                    {b.themes.length === 0 ? <Text style={{ color: GRIS }}>Rien de récurrent.</Text> : b.themes.map((th, k) => (
                      <View key={`${k}-${th.titre}`} wrap={false} style={{ marginBottom: 8, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: b.c }}>
                        <Text style={{ fontWeight: 600 }}>{t(th.titre)}</Text>
                        {th.citations.map((c, j) => <Text key={`${j}-${c}`} style={{ color: GRIS, fontSize: 9 }}>« {t(c)} »</Text>)}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ marginTop: 14 }}>L&apos;analyse détaillée n&apos;a pas pu être produite cette fois. Les chiffres restent exacts.</Text>
            )}

            {r.sansReponse.length > 0 && (
              <View>
                <Text style={s.h2} minPresenceAhead={90}>Vos avis sans réponse, avec une réponse prête</Text>
                {r.sansReponse.map(a => (
                  <View key={a.id} wrap={false} style={{ backgroundColor: "#ffffff", borderRadius: 6, padding: 10, marginBottom: 7, borderLeftWidth: 3, borderLeftColor: a.note <= 3 ? ROUGE : BLEU }}>
                    <Text style={{ fontSize: 8.5, color: GRIS }}>{a.note} / 5{a.date ? ` · ${new Date(a.date).toLocaleDateString("fr-FR")}` : ""}</Text>
                    <Text style={{ color: GRIS, fontSize: 9 }}>{a.texte ? `« ${t(a.texte.length > 300 ? `${a.texte.slice(0, 300)}…` : a.texte)} »` : "(note sans commentaire)"}</Text>
                    {rep.get(a.id) ? (
                      <View style={{ marginTop: 5, padding: 7, borderRadius: 4, backgroundColor: TEINTE }}>
                        <Text style={[s.sur, { color: BLEU, fontSize: 7, marginBottom: 2 }]}>Réponse proposée</Text>
                        <Text>{t(rep.get(a.id)!)}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        <Pied sombre={false} nom={r.fiche.nom} />
      </Page>

      {/* Page sombre : la passerelle vers ce que propose Timevo. */}
      <Page size="A4" style={s.sombre}>
        <Image src={`${origine()}/ressources/avis/timevo-logo-clair.png`} style={{ width: 96, height: 21, marginBottom: 36 }} />
        <Text style={[s.sur, { color: ACCENT, marginBottom: 10 }]}>Et maintenant</Text>
        <Text style={[s.titre, { fontSize: 26 }]}>Ce qu&apos;on peut automatiser pour vous.</Text>
        <Text style={{ color: DIM, marginTop: 8, marginBottom: 18, fontSize: 11 }}>Trois systèmes, construits sur vos outils, que l&apos;on fait vivre avec vous après la mise en place.</Text>
        <Degrade id="g2" />
        {offres(r).map((o, n) => (
          <View key={o.cle} wrap={false} style={{ marginTop: 16, padding: 14, borderRadius: 8, backgroundColor: CARD, borderWidth: 0.6, borderColor: BORDER }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 6 }}>
              <Text style={{ color: VIOLET, fontSize: 10, fontWeight: 600, width: 24 }}>0{n + 1}</Text>
              <Text style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>{t(o.titre)}</Text>
            </View>
            <View style={{ paddingLeft: 24 }}>
              <Text style={{ color: ACCENT, fontWeight: 600, marginBottom: 4 }}>{t(o.constat)}</Text>
              <Text style={{ color: DIM }}>{t(o.solution)}</Text>
            </View>
          </View>
        ))}
        <View wrap={false} style={{ marginTop: 22, padding: 16, borderRadius: 8, backgroundColor: TEXT }}>
          <Text style={{ color: BG, fontSize: 14, fontWeight: 700 }}>Diagnostic gratuit de 30 minutes</Text>
          <Text style={{ color: "#3c3355", marginTop: 4 }}>On regarde ensemble par quoi commencer. calendly.com/hello-timevo/diagnostic-offert · hello@timevo.io</Text>
        </View>
        <Pied sombre nom={r.fiche.nom} />
      </Page>
    </Document>
  );
}

export function nomFichierRapport(r: Rapport): string {
  const base = r.fiche.nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return `analyse-avis-google${base ? `-${base}` : ""}.pdf`;
}

export async function genererPdfRapport(r: Rapport): Promise<Blob> {
  return pdf(<Document_ r={r} />).toBlob();
}
