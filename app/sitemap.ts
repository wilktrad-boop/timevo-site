import { MetadataRoute } from "next";
import { SECTOR_SLUGS } from "@/lib/sectors";
import { CITY_SLUGS } from "@/lib/cities";
import { DEMO_SLUGS } from "@/lib/demoDashboards";

const BASE = "https://www.timevo.io";

const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo", "reseaux-sociaux"] as const;

/**
 * Dates de dernière modification du CONTENU, par groupe de pages.
 *
 * Elles étaient calculées avec `new Date()`, donc réévaluées à chaque build :
 * les 34 URLs portaient la même date et elle changeait à chaque déploiement,
 * y compris pour un changement de CSS. Google finit par ignorer un lastmod
 * aussi bruyant, et le signal ne sert plus à rien.
 *
 * À mettre à jour à la main quand on touche au contenu d'un groupe — pas
 * quand on touche au code.
 */
const UPDATED = {
  home: "2026-07-23",         // ajout de la section démos
  services: "2026-05-13",     // création des 6 pages service + index
  realisations: "2026-07-14", // création de la page
  sectors: "2026-05-29",      // création des 3 pages secteur
  cities: "2026-05-29",       // création des 2 pages ville
  demos: "2026-07-23",        // création des 3 démos
} as const;

export default function sitemap(): MetadataRoute.Sitemap {

  return [
    // Home pages
    {
      url: `${BASE}/fr`,
      lastModified: UPDATED.home,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          fr: `${BASE}/fr`,
          en: `${BASE}/en`,
          "x-default": `${BASE}/fr`,
        },
      },
    },
    {
      url: `${BASE}/en`,
      lastModified: UPDATED.home,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE}/fr`,
          en: `${BASE}/en`,
          "x-default": `${BASE}/fr`,
        },
      },
    },

    // Solutions index
    {
      url: `${BASE}/fr/solutions`,
      lastModified: UPDATED.services,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE}/fr/solutions`,
          en: `${BASE}/en/solutions`,
          "x-default": `${BASE}/fr/solutions`,
        },
      },
    },
    {
      url: `${BASE}/en/solutions`,
      lastModified: UPDATED.services,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE}/fr/solutions`,
          en: `${BASE}/en/solutions`,
          "x-default": `${BASE}/fr/solutions`,
        },
      },
    },

    // Réalisations
    {
      url: `${BASE}/fr/realisations`,
      lastModified: UPDATED.realisations,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE}/fr/realisations`,
          en: `${BASE}/en/realisations`,
          "x-default": `${BASE}/fr/realisations`,
        },
      },
    },
    {
      url: `${BASE}/en/realisations`,
      lastModified: UPDATED.realisations,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${BASE}/fr/realisations`,
          en: `${BASE}/en/realisations`,
          "x-default": `${BASE}/fr/realisations`,
        },
      },
    },

    // Service pages (5 slugs × 2 locales)
    ...SERVICE_SLUGS.flatMap((slug) => [
      {
        url: `${BASE}/fr/solutions/${slug}`,
        lastModified: UPDATED.services,
        changeFrequency: "monthly" as const,
        priority: 0.85,
        alternates: {
          languages: {
            fr: `${BASE}/fr/solutions/${slug}`,
            en: `${BASE}/en/solutions/${slug}`,
            "x-default": `${BASE}/fr/solutions/${slug}`,
          },
        },
      },
      {
        url: `${BASE}/en/solutions/${slug}`,
        lastModified: UPDATED.services,
        changeFrequency: "monthly" as const,
        priority: 0.75,
        alternates: {
          languages: {
            fr: `${BASE}/fr/solutions/${slug}`,
            en: `${BASE}/en/solutions/${slug}`,
            "x-default": `${BASE}/fr/solutions/${slug}`,
          },
        },
      },
    ]),

    // Sector pages (FR + EN)
    ...SECTOR_SLUGS.flatMap(secteur => [
      {
        url: `${BASE}/fr/automatisation-pour/${secteur}`,
        lastModified: UPDATED.sectors,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            fr: `${BASE}/fr/automatisation-pour/${secteur}`,
            en: `${BASE}/en/automatisation-pour/${secteur}`,
            "x-default": `${BASE}/fr/automatisation-pour/${secteur}`,
          },
        },
      },
      {
        url: `${BASE}/en/automatisation-pour/${secteur}`,
        lastModified: UPDATED.sectors,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${BASE}/fr/automatisation-pour/${secteur}`,
            en: `${BASE}/en/automatisation-pour/${secteur}`,
            "x-default": `${BASE}/fr/automatisation-pour/${secteur}`,
          },
        },
      },
    ]),

    // Demo dashboards (FR + EN). Priorité sous celle de la page secteur :
    // c'est la page secteur qui doit ranker, la démo la soutient.
    ...DEMO_SLUGS.flatMap(secteur => [
      {
        url: `${BASE}/fr/demo/${secteur}`,
        lastModified: UPDATED.demos,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: {
            fr: `${BASE}/fr/demo/${secteur}`,
            en: `${BASE}/en/demo/${secteur}`,
            "x-default": `${BASE}/fr/demo/${secteur}`,
          },
        },
      },
      {
        url: `${BASE}/en/demo/${secteur}`,
        lastModified: UPDATED.demos,
        changeFrequency: "monthly" as const,
        priority: 0.5,
        alternates: {
          languages: {
            fr: `${BASE}/fr/demo/${secteur}`,
            en: `${BASE}/en/demo/${secteur}`,
            "x-default": `${BASE}/fr/demo/${secteur}`,
          },
        },
      },
    ]),

    // Geo / city pages (FR + EN)
    ...CITY_SLUGS.flatMap(city => [
      {
        url: `${BASE}/fr/agence-automatisation-${city}`,
        lastModified: UPDATED.cities,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            fr: `${BASE}/fr/agence-automatisation-${city}`,
            en: `${BASE}/en/agence-automatisation-${city}`,
            "x-default": `${BASE}/fr/agence-automatisation-${city}`,
          },
        },
      },
      {
        url: `${BASE}/en/agence-automatisation-${city}`,
        lastModified: UPDATED.cities,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${BASE}/fr/agence-automatisation-${city}`,
            en: `${BASE}/en/agence-automatisation-${city}`,
            "x-default": `${BASE}/fr/agence-automatisation-${city}`,
          },
        },
      },
    ]),
  ];
}
