import type { ReactNode } from "react";
import Link from "next/link";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
    </>
  );
}
