import type { ReactNode } from "react";
import type { Essay } from "@/domain/essay";

export type EssayExperienceProps = {
  essay: Essay;
  children: ReactNode;
};

export function DefaultExperience({
  essay,
  children,
}: EssayExperienceProps) {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {essay.title}
        </h1>
        {essay.excerpt ? (
          <p className="text-lg text-foreground/70">{essay.excerpt}</p>
        ) : null}
      </header>
      <div className="essay-body flex flex-col gap-4 text-base leading-relaxed text-foreground/90 [&_a]:underline [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
