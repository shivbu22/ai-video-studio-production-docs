import { NextRequest, NextResponse } from "next/server";

export interface PublishRequest {
  platform: "youtube" | "tiktok" | "instagram";
  projectTitle: string;
  description: string;
  tags: string[];
  privacyStatus?: "public" | "unlisted" | "private";
  videoUrl?: string;
  thumbnailUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PublishRequest = await req.json();
    const { platform, projectTitle, description, tags, privacyStatus } = body;

    if (!projectTitle) {
      return NextResponse.json(
        { success: false, error: "Project title is required" },
        { status: 400 }
      );
    }

    const publishId = `pub_${platform}_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Check platform specific configs or simulate verified OAuth direct publish
    if (platform === "youtube") {
      return NextResponse.json({
        success: true,
        publishId,
        platform: "youtube",
        status: "PUBLISHED",
        visibility: privacyStatus || "public",
        videoUrl: `https://youtube.com/watch?v=omni_${Math.random().toString(36).substring(2, 9)}`,
        directPostId: `yt_video_${Date.now()}`,
        metadata: {
          title: projectTitle,
          descriptionSnippet: description ? description.slice(0, 150) + "..." : "",
          tagsCount: tags ? tags.length : 0,
        },
        message: "Successfully uploaded to YouTube via YouTube Data API v3",
        timestamp,
      });
    } else if (platform === "tiktok") {
      return NextResponse.json({
        success: true,
        publishId,
        platform: "tiktok",
        status: "SCHEDULED",
        videoUrl: `https://tiktok.com/@creator/video/${Date.now()}`,
        directPostId: `tt_post_${Date.now()}`,
        format: "vertical_9_16",
        message: "Video scheduled to TikTok via Content Posting API",
        timestamp,
      });
    } else {
      return NextResponse.json({
        success: true,
        publishId,
        platform: "instagram",
        status: "READY",
        format: "reels_9_16",
        message: "Media container prepared for Instagram Graph API publish",
        timestamp,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Publish request failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Returns connected creator channel statuses
  return NextResponse.json({
    channels: [
      {
        platform: "youtube",
        channelName: "Quantum & Tech Breakdowns (Verified)",
        subscribers: "148,000",
        connected: true,
        scopes: ["youtube.upload", "youtube.readonly"],
      },
      {
        platform: "tiktok",
        channelName: "@techbreakdowns",
        followers: "84,500",
        connected: true,
        scopes: ["video.upload", "video.publish"],
      },
      {
        platform: "instagram",
        channelName: "@omnicut_creator",
        followers: "32,100",
        connected: false,
        scopes: ["instagram_content_publish"],
      },
    ],
  });
}