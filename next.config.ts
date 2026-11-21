import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Le PDF du livret (photo et logo compris) passe par une Server Action
    // pour être envoyé par email : 1 Mo par défaut ne suffit pas.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default withNextIntl(nextConfig);
