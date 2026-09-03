import { SiteLayout } from "./site-layout";

export default function SiteRouteLayout({
  children,
}: LayoutProps<"/">) {
  return <SiteLayout>{children}</SiteLayout>;
}
