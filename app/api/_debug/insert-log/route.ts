import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, endpoint, method, status, responseTime } = body;

    if (
      !projectId ||
      !endpoint ||
      typeof status === "undefined" ||
      typeof responseTime === "undefined"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const log = await prisma.log.create({
      data: {
        projectId,
        endpoint,
        method: method || "GET",
        status: Number(status),
        responseTime: Number(responseTime),
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("/api/_debug/insert-log error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
