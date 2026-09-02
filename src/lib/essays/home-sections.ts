import type { Essay } from "@/domain/essay";
import { getExperience } from "@/experiences/registry";

export type ExperienceHighlight = {
  experienceId: string;
  name: string;
  essay: Essay;
};

export type HomePageSections = {
  featured: Essay | null;
  pickUp: Essay | null;
  newEssays: Essay[];
  labNotes: Essay[];
  experiences: ExperienceHighlight[];
};

export function sortEssaysByPublishedAt(essays: Essay[]): Essay[] {
  return [...essays].sort((a, b) => {
    const dateA = a.publishedAt ?? "";
    const dateB = b.publishedAt ?? "";

    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }

    return a.slug.localeCompare(b.slug);
  });
}

export function buildHomePageSections(essays: Essay[]): HomePageSections {
  const sorted = sortEssaysByPublishedAt(essays);
  const featured = sorted[0] ?? null;
  const pickUp = sorted.length >= 2 ? sorted[1] : null;

  const usedSlugs = new Set<string>();
  if (featured) {
    usedSlugs.add(featured.slug);
  }
  if (pickUp) {
    usedSlugs.add(pickUp.slug);
  }

  const remaining = sorted.filter((essay) => !usedSlugs.has(essay.slug));

  let newEssays: Essay[] = [];
  let labNotes: Essay[] = [];

  if (remaining.length === 1) {
    newEssays = remaining;
  } else if (remaining.length === 2) {
    newEssays = [remaining[0]];
    labNotes = [remaining[1]];
  } else if (remaining.length >= 3) {
    const split = Math.ceil(remaining.length / 2);
    newEssays = remaining.slice(0, split);
    labNotes = remaining.slice(split);
  }

  const experienceMap = new Map<string, Essay>();

  for (const essay of sorted) {
    if (!experienceMap.has(essay.experienceId)) {
      experienceMap.set(essay.experienceId, essay);
    }
  }

  const experiences: ExperienceHighlight[] = [];

  for (const [experienceId, essay] of experienceMap) {
    const definition = getExperience(experienceId);
    experiences.push({
      experienceId,
      name: definition.name,
      essay,
    });
  }

  experiences.sort((a, b) => a.experienceId.localeCompare(b.experienceId));

  return {
    featured,
    pickUp,
    newEssays,
    labNotes,
    experiences,
  };
}

export function formatEssayDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/-/g, ".");
}
