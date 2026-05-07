import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { generateApiKey } from "@/lib/apiKey";
import { extractProjectData } from "../../../lib/project";
// import your auth helper (example below assumes userId is available)

export async function POST(req: Request) {
  try {
    console.log("STEP 1");

    const body = await req.json();
    const { name } = body;
    console.log("STEP 2", body);

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    // 🔐 Replace this with real auth (Clerk / NextAuth)
    // Use the same placeholder userId as the GET route so newly created
    // projects appear in the list during development.
    const userId = "user_123"; // TODO: get from session

    const apiKey = generateApiKey();
    console.log("STEP 3", apiKey);

    const project = await prisma.project.create({
      data: {
        name,
        apiKey,
        userId,
      },
    });
    console.log("STEP 4", project);

    const dto = extractProjectData(project, { includeApiKey: true });
    console.log("STEP 5", dto);
    return NextResponse.json(dto);
  } catch (error) {
    console.error("FULL ERROR OBJECT:");
    console.error(error);

    if (error instanceof Error) {
      console.error("STACK:");
      console.error(error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to create project",
        details:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // 🔐 Replace this with real auth (Clerk / NextAuth)
    const userId = "user_123"; // TODO: get from session

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const dtos = projects.map((p) => extractProjectData(p));

    return NextResponse.json(dtos);
  } catch (error) {
    // Log the server error and return an empty array so client fetches
    // succeed and the UI can show an empty state instead of a 500 page.
    console.error("/api/projects GET error:", error);
    return NextResponse.json([]);
  }
}
