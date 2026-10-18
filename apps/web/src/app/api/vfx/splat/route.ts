import { NextRequest, NextResponse } from "next/server";

export interface SplatSceneRequest {
  sceneId: string;
  durationMs?: number;
  cameraPathPreset?: "orbitSpiral" | "dollyThrough" | "heroReveal";
  focalLengthMm?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: SplatSceneRequest = await req.json();
    const { sceneId, durationMs = 5000, cameraPathPreset = "orbitSpiral", focalLengthMm = 35 } = body;

    const scenes: Record<string, {
      title: string;
      splatCount: number;
      format: string;
      captureMethod: string;
      densityPerM3: number;
    }> = {
      cryo_lab: {
        title: "Google Quantum Cryostat Laboratory",
        splatCount: 420_000,
        format: ".splat / .ply (32-bit float)",
        captureMethod: "Gaussian Splatting Volumetric Scan",
        densityPerM3: 14_500,
      },
      supercomputer: {
        title: "Summit Supercomputer Server Vault",
        splatCount: 310_000,
        format: ".splat (16-bit half float)",
        captureMethod: "LiDAR + Photogrammetry Gaussian Fusion",
        densityPerM3: 9_800,
      },
      cyberpunk_alley: {
        title: "Neo-Tokyo Cyberpunk Optical Alley",
        splatCount: 580_000,
        format: ".splat (32-bit float)",
        captureMethod: "Drone Gaussian Multi-Pass",
        densityPerM3: 18_200,
      },
    };

    const scene = scenes[sceneId] || scenes.cryo_lab;

    // Generate 60 keyframe nodes for the 3D camera flythrough path
    const keyframes = [];
    const totalFrames = 60;
    for (let f = 0; f < totalFrames; f++) {
      const progress = f / (totalFrames - 1);
      const angle = progress * Math.PI * 1.5;
      const radius = 280 - progress * 90;
      const height = -30 + Math.sin(progress * Math.PI) * 50;

      keyframes.push({
        frame: f,
        timeMs: Math.round(progress * durationMs),
        posX: Math.round(Math.cos(angle) * radius * 10) / 10,
        posY: Math.round(height * 10) / 10,
        posZ: Math.round(Math.sin(angle) * radius * 10) / 10,
        pitchDeg: Math.round((12 - progress * 18) * 10) / 10,
        yawDeg: Math.round((angle * (180 / Math.PI) - 90) * 10) / 10,
        rollDeg: Math.round(Math.sin(progress * Math.PI * 2) * 4 * 10) / 10,
        fovDeg: 55,
        focalLengthMm,
      });
    }

    return NextResponse.json({
      success: true,
      sceneId,
      sceneInfo: scene,
      cameraPathPreset,
      durationMs,
      totalFrames,
      keyframes,
      rasterizerEngine: "OmniCut-WebGPU-Splat-Rasterizer-v1.4",
      status: "ready",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load 3D Gaussian Splat scene" },
      { status: 500 }
    );
  }
}
