import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { PushNotificationProvider } from "@/components/providers/PushNotificationProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL('https://www.supplabs.com.tr'),
  title: {
    default: "SuppLabs - Türkiye'nin Supplement Sosyal Ağı ve İnceleme Platformu",
    template: "%s | SuppLabs Türkiye"
  },
  icons: {
    icon: '/favicon-custom.png',
    shortcut: '/favicon-custom.png',
    apple: '/favicon-custom.png',
  },
  description: "Sporcu besinleri, protein tozu, kreatin ve pre-workout ürünleri hakkında gerçek kullanıcı yorumlarını okuyun, tecrübelerinizi paylaşın. Türkiye'nin en büyük fitness topluluğu.",
  keywords: ["supplement", "protein tozu", "kreatin", "fitness", "vücut geliştirme", "sporcu besinleri", "supplement yorumları", "pre-workout", "supplabs"],
  authors: [{ name: "SuppLabs Team" }],
  creator: "SuppLabs",
  publisher: "SuppLabs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "Xssr0bT9DnkeBROYNPGHxCCgOpal7Q64yaEMkIwwg2Q",
    other: {
      'admaven-placement': 'BqjwGpdsE',
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SuppLabs - Supplement Sosyal Ağı",
    description: "Türkiye'nin en gelişmiş supplement inceleme ve sosyal paylaşım platformu.",
    url: 'https://www.supplabs.com.tr',
    siteName: 'SuppLabs',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://www.supplabs.com.tr/logo-icon.png',
        width: 512,
        height: 512,
        alt: 'SuppLabs Logo',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SuppLabs',
  url: 'https://www.supplabs.com.tr',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.supplabs.com.tr/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SuppLabs',
  url: 'https://www.supplabs.com.tr',
  logo: 'https://www.supplabs.com.tr/logo-icon.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+90-555-555-5555',
    contactType: 'customer service',
    areaServed: 'TR',
    availableLanguage: 'Turkish'
  },
  sameAs: [
    'https://www.instagram.com/supplabs',
    'https://twitter.com/supplabs'
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5742424528253023"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <StoreProvider>
            <NotificationProvider>
              <PushNotificationProvider>
                <div className="container mx-auto max-w-7xl flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 border-r border-gray-200 min-h-screen w-full max-w-full overflow-x-hidden">
                    {children}
                  </main>
                  <RightPanel />
                </div>
                <CookieConsent />
              </PushNotificationProvider>
            </NotificationProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
