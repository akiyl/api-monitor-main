import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/project";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 🔐 Replace with real auth (Clerk / NextAuth)
    const userId = "user_123";

    const project = await getProjectById(id, { userId, includeApiKey: true });

    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(project);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const payload =
      process.env.NODE_ENV !== "production"
        ? { error: "Failed to fetch project", details: message }
        : { error: "Failed to fetch project" };

    return NextResponse.json(payload, { status: 500 });
  }
}
