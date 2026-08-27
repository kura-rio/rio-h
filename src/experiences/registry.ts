import type { ComponentType } from "react";
import {
  DefaultExperience,
  type EssayExperienceProps,
} from "@/experiences/default";

export type ExperienceDefinition = {
  id: string;
  name: string;
  Component: ComponentType<EssayExperienceProps>;
};

const experiences: Record<string, ExperienceDefinition> = {
  default: {
    id: "default",
    name: "デフォルト",
    Component: DefaultExperience,
  },
};

export function listExperiences(): ExperienceDefinition[] {
  return Object.values(experiences);
}

export function getExperience(experienceId: string): ExperienceDefinition {
  return experiences[experienceId] ?? experiences.default;
}
