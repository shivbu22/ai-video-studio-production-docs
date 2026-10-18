import { NextRequest, NextResponse } from "next/server";
import { lambdaRenderer } from "@/lib/lambdaRenderer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, projectTitle, durationMs, resolution, clips } = body;

    const job = await lambdaRenderer.startRender({
      projectId: projectId || "proj_omnicut",
      projectTitle: projectTitle || "OmniCut Master Video",
      durationMs: durationMs || 15000,
      resolution: resolution || "1080p",
      clips: clips || [],
    });

    return NextResponse.json({
      success: true,
      job,
      cluster: {
        provider: "AWS Lambda / Remotion",
        region: job.region,
        concurrency: job.concurrencyPerRender,
        estimatedTimeSec: 15,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch Lambda render" },
      { status: 500 }
    );
  }
}