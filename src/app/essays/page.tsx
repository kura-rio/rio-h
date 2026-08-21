import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essays — RIO LAB",
  description: "Written experiments in form and thought",
};

export default function EssaysPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Essays
      </h1>
      <p className="text-foreground/70">Coming soon.</p>
    </div>
  );
}
