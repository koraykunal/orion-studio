import type { MetadataRoute } from "next";

const BASE_URL = "https://orionstud.io";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/design-system"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
