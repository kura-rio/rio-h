import type { Essay } from "@/domain/essay";

export interface EssayRepository {
  getAll(): Promise<Essay[]>;
  getBySlug(slug: string): Promise<Essay | null>;
  save(essay: Essay): Promise<void>;
  delete(slug: string): Promise<void>;
}
