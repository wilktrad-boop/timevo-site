/**
 * Point de contact unique du site. La même URL était recopiée dans dix
 * composants ; l'agenda intégré du bloc « Commencer » en ajoutait une
 * onzième, dérivée de la première. Elle vit ici.
 */
export const CONTACT_HREF = "https://calendly.com/hello-timevo/30min";

/**
 * URL d'intégration de l'agenda, aux couleurs du site.
 *
 * `embed_domain` n'est pas décoratif : sans lui, Calendly sert une page vide
 * dans l'iframe. Il doit porter le domaine réel de la page hôte, donc il est
 * calculé côté client au moment de l'affichage plutôt que figé ici.
 *
 * Calendly attend des hex sans dièse ; ils sont donc écrits en dur, mais
 * restent alignés sur --bg, --text et --accent de globals.css.
 */
export function contactEmbedSrc(hostname: string): string {
  const params = new URLSearchParams({
    embed_domain: hostname,
    embed_type: "Inline",
    hide_gdpr_banner: "1",
    background_color: "0a0a0a",
    text_color: "ededed",
    primary_color: "5fa8ff",
  });
  return `${CONTACT_HREF}?${params.toString()}`;
}
