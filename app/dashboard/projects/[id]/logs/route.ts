import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/validateApiKey";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    const where: any = {};
    if (projectId) where.projectId = projectId;

    const logs = await prisma.log.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const payload =
      process.env.NODE_ENV !== "production"
        ? { error: "Failed to fetch logs", details: message }
        : { error: "Failed to fetch logs" };

    return NextResponse.json(payload, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 🔐 Validate API key
    console.log("API KEY VALIDATION START");

    const project = await validateApiKey(req);
    const body = await req.json();
    console.log("PROJECT FOUND:", project);
    // Accept either a single log object or an array of logs
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json(
          { error: "No logs provided" },
          { status: 400 },
        );
      }

      const records = body.map((item: any) => ({
        projectId: project.id,
        endpoint: item.endpoint,
        method: item.method || "GET",
        status: Number(item.status),
        responseTime: Number(item.responseTime),
      }));

      // Validate all records
      for (const r of records) {
        if (!r.endpoint || isNaN(r.status) || isNaN(r.responseTime)) {
          return NextResponse.json(
            { error: "Invalid or missing fields in one or more logs" },
            { status: 400 },
          );
        }
      }

      console.log(`Saving ${records.length} logs for project ${project.id}`);

      const result = await prisma.log.createMany({ data: records });

      return NextResponse.json({
        success: true,
        inserted: result.count ?? records.length,
      });
    } else {
      // Single log
      const endpoint = body.endpoint;
      const method = body.method || "GET";
      const status = Number(body.status);
      const responseTime = Number(body.responseTime);

      if (!endpoint || isNaN(status) || isNaN(responseTime)) {
        return NextResponse.json(
          { error: "Invalid or missing fields" },
          { status: 400 },
        );
      }

      console.log("Saving log:", {
        projectId: project.id,
        endpoint,
        method,
        status,
        responseTime,
      });

      const log = await prisma.log.create({
        data: {
          projectId: project.id,
          endpoint,
          method,
          status,
          responseTime,
        },
      });

      return NextResponse.json({ success: true, log });
    }
  } catch (error) {
    console.error("LOG ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create log",
      },
      { status: 500 },
    );
  }
}
