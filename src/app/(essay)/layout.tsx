import type { ReactNode } from "react";
import { SiteLayout } from "../(site)/site-layout";

export default function EssayLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
