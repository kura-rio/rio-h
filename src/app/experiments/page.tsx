import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiments — RIO LAB",
  description: "Creative coding and web technique studies",
};

export default function ExperimentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Experiments
      </h1>
      <p className="text-foreground/70">Coming soon.</p>
    </div>
  );
}
