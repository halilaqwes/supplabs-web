import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/gizli-yonetici-paneli-x9z', '/api/*'],
        },
        sitemap: 'https://www.supplabs.com.tr/sitemap.xml',
    };
}
