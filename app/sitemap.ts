import { MetadataRoute } from "next";

const BASE = "https://www.timevo.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/fr`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          fr: `${BASE}/fr`,
          en: `${BASE}/en`,
        },
      },
    },
    {
      url: `${BASE}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
