import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const envUrl = process.env.DATABASE_URL || null;
    const masked = envUrl ? envUrl.replace(/(.{6}).*(.{6})/, "$1...$2") : null;

    let count: number | null = null;
    try {
      // try a simple query using the generated client
      count = await prisma.project.count();
    } catch (e) {
      // capture but keep going
      console.error("prisma count error:", e);
    }

    // also report logs count and latest log for diagnostics
    let logCount: number | null = null;
    let latestLog: any = null;
    try {
      logCount = await prisma.log.count();
      const logs = await prisma.log.findMany({
        orderBy: { createdAt: "desc" },
        take: 1,
      });
      latestLog = logs[0] ?? null;
    } catch (e) {
      console.error("prisma logs error:", e);
    }

    return NextResponse.json({
      databaseUrl: masked,
      hasDatabaseUrl: !!envUrl,
      projectCount: count,
      logCount,
      latestLog,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "diag failed", details: message },
      { status: 500 },
    );
  }
}

// Diagnostic POST: create a test log for the first project (dev only)
export async function POST() {
  try {
    const project = await prisma.project.findFirst();
    if (!project) {
      return NextResponse.json(
        { error: "No project found to attach log" },
        { status: 400 },
      );
    }

    const log = await prisma.log.create({
      data: {
        projectId: project.id,
        endpoint: "/diag/test",
        method: "POST",
        status: 200,
        responseTime: 42,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (err) {
    console.error("_diag POST error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      process.env.NODE_ENV !== "production"
        ? { error: "Failed to create test log", details: message }
        : { error: "Failed to create test log" },
      { status: 500 },
    );
  }
}
