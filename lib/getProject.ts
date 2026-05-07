import { getProjectById } from "./project";

export async function getProject(
  id: string,
  opts?: { includeApiKey?: boolean; userId?: string },
) {
  return getProjectById(id, opts);
}

export default getProject;
