import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "RIO LAB",
  description: "Experimental web essay & creative coding lab",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="mx-auto w-full max-w-2xl px-6 pt-10">
          <nav aria-label="Primary">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/essays" className="hover:text-foreground">
                  Essays
                </Link>
              </li>
              <li>
                <Link href="/experiments" className="hover:text-foreground">
                  Experiments
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16">
          {children}
        </main>
      </body>
    </html>
  );
}
