import { MetadataRoute } from "next";
import { SECTOR_SLUGS } from "@/lib/sectors";
import { CITY_SLUGS } from "@/lib/cities";

const BASE = "https://www.timevo.io";

const SERVICE_SLUGS = ["automatisation", "agents-ia", "formation", "sites-web", "seo", "reseaux-sociaux"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Home pages
    {
      url: `${BASE}/fr`,
      lastModified: now,
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
      lastModified: now,
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
      lastModified: now,
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
      lastModified: now,
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

    // Service pages (5 slugs × 2 locales)
    ...SERVICE_SLUGS.flatMap((slug) => [
      {
        url: `${BASE}/fr/solutions/${slug}`,
        lastModified: now,
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
        lastModified: now,
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

    // Sector pages (FR only)
    ...SECTOR_SLUGS.map(secteur => ({
      url: `${BASE}/fr/automatisation-pour/${secteur}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE}/fr/automatisation-pour/${secteur}`,
          "x-default": `${BASE}/fr/automatisation-pour/${secteur}`,
        },
      },
    })),

    // Geo / city pages (FR only)
    ...CITY_SLUGS.map(city => ({
      url: `${BASE}/fr/agence-automatisation-${city}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${BASE}/fr/agence-automatisation-${city}`,
          "x-default": `${BASE}/fr/agence-automatisation-${city}`,
        },
      },
    })),
  ];
}
