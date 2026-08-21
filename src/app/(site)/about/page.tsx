import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — RIO LAB",
  description: "About RIO LAB",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        About
      </h1>
      <p className="leading-relaxed text-foreground/70">
        RIO LAB is a personal space for experimental web essays and creative
        coding. More soon.
      </p>
    </div>
  );
}
