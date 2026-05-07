import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: { id: true, name: true, apiKey: true },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("/api/_debug/projects error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
