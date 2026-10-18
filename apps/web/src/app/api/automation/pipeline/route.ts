import { NextResponse } from "next/server";

export interface PipelineStageResult {
  stage: string;
  status: "completed" | "in_progress" | "pending";
  latencyMs: number;
  outputArtifact?: string;
}

export interface AutomationJobResponse {
  jobId: string;
  recipeName: string;
  totalDurationMs: number;
  webhookDelivered: boolean;
  webhookEndpoint: string;
  stages: PipelineStageResult[];
  artifacts: {
    title: string;
    format: string;
    resolution: string;
    downloadUrl: string;
  }[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipeId = "podcast_to_shorts",
      webhookUrl = "https://api.omnicut.studio/v1/webhooks/shorts-dispatch",
      inputSource = "s3://studio-raw-ingest/ep42_quantum_master.mov",
    } = body;

    const stages: PipelineStageResult[] = [
      {
        stage: "1. Headless Audio Transcribe & Alignment",
        status: "completed",
        latencyMs: 1420,
        outputArtifact: "transcript_word_timestamps.json",
      },
      {
        stage: "2. Active Speaker Computer Vision Framing (9:16)",
        status: "completed",
        latencyMs: 2150,
        outputArtifact: "face_tracking_crop_coordinates.json",
      },
      {
        stage: "3. Kinetic Word-by-Word Caption Baking",
        status: "completed",
        latencyMs: 1840,
        outputArtifact: "captions_track_v3.mp4",
      },
      {
        stage: "4. Webhook Dispatch to CDN & Social Queues",
        status: "completed",
        latencyMs: 420,
        outputArtifact: "webhook_delivery_200_ok.json",
      },
    ];

    const response: AutomationJobResponse = {
      jobId: `auto_job_${Date.now()}`,
      recipeName:
        recipeId === "podcast_to_shorts"
          ? "Headless Podcast to Shorts Auto-Repurposer"
          : recipeId === "raw_to_proxy"
          ? "8K Raw Ingest to 540p ProRes Proxy Suite"
          : "Global Multilingual Dubbing CI/CD Fleet",
      totalDurationMs: 5830,
      webhookDelivered: true,
      webhookEndpoint: webhookUrl,
      stages,
      artifacts: [
        {
          title: "Viral Short #1: Quantum Transmon Cryostat (9:16 60fps)",
          format: "MP4 (H.264 / AAC)",
          resolution: "1080x1920",
          downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
          title: "Viral Short #2: 10,000x Speedup Explained (9:16 60fps)",
          format: "MP4 (H.264 / AAC)",
          resolution: "1080x1920",
          downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        },
      ],
    };

    return NextResponse.json({ success: true, ...response });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute automation pipeline" },
      { status: 500 }
    );
  }
}
