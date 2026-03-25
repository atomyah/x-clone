import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from '@clerk/localizations';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Y",
  description: "Y",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            <footer className="shrink-0 border-t mt-8 py-4 text-center text-[10px] leading-snug text-muted-foreground sm:text-xs">
              ⚠️本サービスは技術検証を目的としたデモアプリです<br />
              ⚠️実験的な機能を含むため予告なく仕様変更・閉鎖するかもしれません
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
