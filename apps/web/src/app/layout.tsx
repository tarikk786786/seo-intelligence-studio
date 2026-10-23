import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SEO Intelligence Studio - Enterprise SEO, GEO & AI Visibility Platform",
  description: "Enterprise content optimization, advanced SERP analysis, keyword research, and AI search visibility tracking.",
  authors: [{ name: "Tarik Islam", url: "https://tarikislam.in" }],
  creator: "tarikislam.in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto max-h-screen p-8 flex flex-col justify-between">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-12 pt-4 border-t border-cardBorder flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 shrink-0">
            <span>SEO Intelligence Studio — Enterprise GEO & Search Platform</span>
            <a 
              href="https://tarikislam.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brandHighlight hover:text-white transition-colors font-semibold flex items-center gap-1.5"
            >
              <span>Made by tarikislam.in</span>
              <span className="text-sky-400">✦</span>
            </a>
          </footer>
        </main>
      </body>
    </html>
  );
}
