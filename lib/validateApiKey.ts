import { prisma } from "@/lib/prisma";

export async function validateApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    throw new Error("API key missing");
  }
  console.log("Incoming API Key:", apiKey);

  const project = await prisma.project.findUnique({
    where: { apiKey },
  });

  if (!project) {
    throw new Error("Invalid API key");
  }
  console.log("Matched Project:", project);

  return project;
}
// tf_9baa44065c4e47ef12625d8e7eeef98affaf6f63b002e82c
