import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/validateApiKey";
import { getIO } from "../../../server/socket";
export async function POST(req: Request) {
  try {
    // 🔐 Validate API key
    const project = await validateApiKey(req);

    // Read raw text first and parse safely so we can log malformed payloads
    const raw = await req.text();
    let body: any = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Invalid JSON payload for /api/log:", raw);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const { endpoint, method, status, responseTime } = body;

    console.log("/api/log POST | project:", project?.id, "body:", body);

    // Basic validation
    if (
      !endpoint ||
      typeof status === "undefined" ||
      typeof responseTime === "undefined"
    ) {
      console.error("Missing required fields in /api/log POST", {
        endpoint,
        status,
        responseTime,
      });
      return NextResponse.json(
        { error: "Missing required fields", body },
        { status: 400 },
      );
    }
    // Ensure numeric fields are numbers
    const numericStatus = Number(status);
    const numericResponseTime = Number(responseTime);

    const log = await (prisma as any).log.create({
      data: {
        projectId: project.id,
        endpoint,
        method: method || "GET",
        status: numericStatus,
        responseTime: numericResponseTime,
      },
    });

    // 💾 Emit socket event (non-blocking — don't let it fail the request)
    try {
      const io = getIO();
      io.emit("new-log", {
        projectId: project.id,
        endpoint,
        status,
        responseTime,
        createdAt: new Date(),
      });
    } catch (socketErr) {
      console.error("Socket emit failed (non-fatal):", socketErr);
    }

    return NextResponse.json({ success: true, log });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}
