import type { Project } from "../prisma/generated/client";
import { prisma } from "./prisma";

export type ProjectDTO = {
  id: string;
  name: string;
  createdAt: string;
  // `apiKey` is only present when explicitly requested (e.g. on creation).
  apiKey?: string;
  // `maskedApiKey` is safe to show in lists (first chars + ...).
  maskedApiKey?: string;
};

export function extractProjectData(
  project: Project | null | undefined,
  opts?: { includeApiKey?: boolean },
): ProjectDTO | null {
  if (!project) return null;

  const dto: ProjectDTO = {
    id: project.id,
    name: project.name,
    createdAt:
      project.createdAt instanceof Date
        ? project.createdAt.toISOString()
        : String(project.createdAt),
  };

  if (project.apiKey) {
    dto.maskedApiKey = project.apiKey.slice(0, 20) + "...";
    if (opts?.includeApiKey) dto.apiKey = project.apiKey;
  }

  return dto;
}

export default extractProjectData;

export async function getProjectById(
  id: string,
  opts?: { includeApiKey?: boolean; userId?: string },
): Promise<ProjectDTO | null> {
  if (!id) return null;

  const where: any = { id };
  if (opts?.userId) where.userId = opts.userId;

  const project = await prisma.project.findFirst({ where });

  return extractProjectData(project ?? null, {
    includeApiKey: !!opts?.includeApiKey,
  });
}
