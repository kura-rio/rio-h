import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getExperience } from "@/experiences/registry";
import { getPublishedEssay } from "@/lib/essays/read";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getPublishedEssay(slug);

  if (!essay) {
    return { title: "Not found — RIO LAB" };
  }

  return {
    title: `${essay.title} — RIO LAB`,
    description: essay.excerpt ?? essay.title,
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getPublishedEssay(slug);

  if (!essay) {
    notFound();
  }

  const experience = getExperience(essay.experienceId);
  const Experience = experience.Component;

  return (
    <Experience essay={essay}>
      <ReactMarkdown>{essay.content}</ReactMarkdown>
    </Experience>
  );
}
