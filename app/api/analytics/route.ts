import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const logs = await prisma.log.findMany({
      where: { projectId },
    });

    // 📊 Total requests
    const totalRequests = logs.length;

    // 🚨 Errors
    const errorCount = logs.filter((l) => l.status >= 400).length;
    const errorRate = totalRequests
      ? ((errorCount / totalRequests) * 100).toFixed(2)
      : 0;

    // ⚡ Avg response time
    const avgResponseTime = totalRequests
      ? Math.round(
          logs.reduce((sum, l) => sum + l.responseTime, 0) / totalRequests,
        )
      : 0;

    // 📈 Requests over time (group by minute)
    const requestsOverTime: Record<string, number> = {};

    logs.forEach((log) => {
      const key = new Date(log.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      requestsOverTime[key] = (requestsOverTime[key] || 0) + 1;
    });

    // 📊 Status distribution
    const statusCounts: Record<string, number> = {};

    logs.forEach((log) => {
      const key = log.status.toString();
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });

    return NextResponse.json({
      totalRequests,
      errorRate,
      avgResponseTime,
      requestsOverTime,
      statusCounts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
