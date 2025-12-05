import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuppLabs",
  description: "The ultimate social platform for supplement enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5742424528253023"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <StoreProvider>
            <div className="container mx-auto max-w-7xl flex min-h-screen">
              <Sidebar />
              <main className="flex-1 border-r border-gray-200 min-h-screen w-full max-w-full overflow-x-hidden">
                {children}
              </main>
              <RightPanel />
            </div>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
