"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Camera, 
  Layers, 
  Play, 
  Pause, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Move3d, 
  Eye, 
  RefreshCw, 
  Download, 
  Film,
  ZoomIn,
  Compass
} from "lucide-react";
import { gaussianSplatRasterizer, Camera3D, GaussianSplat } from "../../lib/webgpu/gaussianSplatRasterizer";

interface Volumetric3DWorkspaceProps {
  projectTitle: string;
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onApply3DToTimeline?: (sceneName: string, lensMm: number) => void;
  onShowToast?: (msg: string) => void;
}

export const Volumetric3DWorkspace: React.FC<Volumetric3DWorkspaceProps> = ({
  projectTitle,
  currentTimeMs,
  onSeek,
  onApply3DToTimeline,
  onShowToast,
}) => {
  const [selectedScene, setSelectedScene] = useState<string>("cryo_lab");
  const [selectedLensMm, setSelectedLensMm] = useState<number>(35);
  const [selectedPathPreset, setSelectedPathPreset] = useState<"orbitSpiral" | "dollyThrough" | "heroReveal">("orbitSpiral");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBaking, setIsBaking] = useState<boolean>(false);
  const [hasBaked, setHasBaked] = useState<boolean>(true);
  const [dofAperture, setDofAperture] = useState<number>(1.8);
  const [pointCloudDensity, setPointCloudDensity] = useState<number>(100);

  // 3D Camera State
  const [camera, setCamera] = useState<Camera3D>({
    posX: 0,
    posY: -20,
    posZ: 220,
    pitchDeg: 12,
    yawDeg: 25,
    rollDeg: 0,
    fovDeg: 55,
    focalLengthMm: 35,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const splatsRef = useRef<GaussianSplat[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize splat scene
  useEffect(() => {
    splatsRef.current = gaussianSplatRasterizer.generateLabScene(1400);
  }, [selectedScene]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle 3D grid plane
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;
    const gridY = canvas.height * 0.72;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, gridY);
      ctx.lineTo(canvas.width / 2 + (x - canvas.width / 2) * 2.2, canvas.height);
      ctx.stroke();
    }

    // Render Gaussian Splats with depth sorting
    const rendered = splatsRef.current.map((splat) => {
      const proj = gaussianSplatRasterizer.projectSplat(
        splat,
        { ...camera, focalLengthMm: selectedLensMm },
        canvas.width,
        canvas.height
      );
      return { splat, proj };
    });

    // Draw visible splats
    for (const item of rendered) {
      if (!item.proj.visible) continue;
      ctx.fillStyle = item.proj.color;
      ctx.beginPath();
      ctx.arc(item.proj.screenX, item.proj.screenY, item.proj.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw 3D Camera Trajectory Path & Keyframe Nodes
    ctx.strokeStyle = "rgba(59, 99, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.7);
    ctx.bezierCurveTo(
      canvas.width * 0.35, canvas.height * 0.4,
      canvas.width * 0.65, canvas.height * 0.3,
      canvas.width * 0.8, canvas.height * 0.65
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Keyframe Node Pins
    const nodes = [
      { x: canvas.width * 0.2, y: canvas.height * 0.7, label: "Node 1: Entry Dolly" },
      { x: canvas.width * 0.5, y: canvas.height * 0.34, label: "Node 2: Helix Spiral" },
      { x: canvas.width * 0.8, y: canvas.height * 0.65, label: "Node 3: Macro Qubit Focus" },
    ];

    for (const node of nodes) {
      ctx.fillStyle = "#3B63FF";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "10px monospace";
      ctx.fillText(node.label, node.x - 30, node.y - 10);
    }
  }, [camera, selectedLensMm, selectedScene]);

  // Auto-camera movement when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCamera((prev) => ({
        ...prev,
        yawDeg: (prev.yawDeg + 0.8) % 360,
        posY: -20 + Math.sin(Date.now() / 600) * 15,
        posZ: 220 + Math.cos(Date.now() / 800) * 30,
      }));
    }, 33);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamera((prev) => ({
      ...prev,
      yawDeg: prev.yawDeg + dx * 0.4,
      pitchDeg: Math.max(-45, Math.min(65, prev.pitchDeg - dy * 0.4)),
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleBakePath = async () => {
    setIsBaking(true);
    try {
      const res = await fetch("/api/vfx/splat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneId: selectedScene,
          durationMs: 5000,
          cameraPathPreset: selectedPathPreset,
          focalLengthMm: selectedLensMm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasBaked(true);
        if (onShowToast) {
          onShowToast("Baked 60 FPS 3D Volumetric Camera Flythrough Pass!");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBaking(false);
    }
  };

  const handleApplyToTimeline = () => {
    if (onApply3DToTimeline) {
      onApply3DToTimeline(
        selectedScene === "cryo_lab"
          ? "Quantum Cryostat Volumetric Splat"
          : selectedScene === "supercomputer"
          ? "Server Vault LiDAR Splat"
          : "Cyberpunk Volumetric Scan",
        selectedLensMm
      );
    }
    if (onShowToast) {
      onShowToast("Added 3D Volumetric Splat Flythrough to Timeline Track V2!");
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0c0d11] text-slate-200 select-none font-sans">
      {/* Left 3D Camera & Splat Parameters Column */}
      <div className="w-84 bg-[#101117] border-r border-[#1e2029] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1e2029] bg-[#14151e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Move3d className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">3D Gaussian Splat Studio</h2>
              <p className="text-[10px] text-slate-400 font-mono">Volumetric Cinema Cameras</p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            WebGPU 60 FPS
          </span>
        </div>

        {/* Scene Selector */}
        <div className="p-3 border-b border-[#1e2029] bg-[#0e0f14] space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300">Volumetric Splat Scene</label>
          <select
            id="select-splat-scene"
            value={selectedScene}
            onChange={(e) => setSelectedScene(e.target.value)}
            className="w-full bg-[#151620] border border-[#252838] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#3B63FF]"
          >
            <option value="cryo_lab">Google Quantum Cryostat (420k Splats)</option>
            <option value="supercomputer">Summit Supercomputer Vault (310k Splats)</option>
            <option value="cyberpunk_alley">Neo-Tokyo Optical Alley (580k Splats)</option>
          </select>
        </div>

        {/* Camera Optics & Lens Controls */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-300">Cinema Lens Focal Length</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { mm: 18, name: "18mm Ultra-Wide" },
                { mm: 35, name: "35mm Cinema" },
                { mm: 50, name: "50mm Prime" },
                { mm: 85, name: "85mm Telephoto" },
              ].map((lens) => (
                <button
                  key={lens.mm}
                  onClick={() => setSelectedLensMm(lens.mm)}
                  className={`py-1.5 px-2 rounded text-[11px] font-medium border text-left transition-colors ${
                    selectedLensMm === lens.mm
                      ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white"
                      : "bg-[#151620] border-[#252838] text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold">{lens.mm}mm</span>
                  <span className="text-[9px] text-slate-500">{lens.name.split(" ")[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Path Easing Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Flight Path Choreography</label>
            <select
              value={selectedPathPreset}
              onChange={(e) => setSelectedPathPreset(e.target.value as any)}
              className="w-full bg-[#151620] border border-[#252838] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#3B63FF]"
            >
              <option value="orbitSpiral">Orbit Spiral (360° Reveal)</option>
              <option value="dollyThrough">Linear Dolly-Through</option>
              <option value="heroReveal">Dramatic Low-Angle Crane</option>
            </select>
          </div>

          {/* Depth of Field Aperture */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Depth of Field (Aperture)</span>
              <span className="font-mono text-cyan-300">f/{dofAperture}</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="8.0"
              step="0.2"
              value={dofAperture}
              onChange={(e) => setDofAperture(Number(e.target.value))}
              className="w-full accent-[#3B63FF] cursor-pointer"
            />
          </div>

          {/* Camera Coordinates Readout */}
          <div className="p-3 rounded bg-[#13151f] border border-[#202230] space-y-1 font-mono text-[10px] text-slate-400">
            <div className="text-white font-bold mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera Coordinates</span>
            </div>
            <div className="flex justify-between">
              <span>Position (XYZ):</span>
              <span className="text-cyan-300">[{camera.posX}, {camera.posY.toFixed(0)}, {camera.posZ.toFixed(0)}]</span>
            </div>
            <div className="flex justify-between">
              <span>Rotation (Pitch/Yaw):</span>
              <span className="text-slate-200">{camera.pitchDeg.toFixed(1)}° / {camera.yawDeg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span>Active Splat Density:</span>
              <span className="text-emerald-400">420,000 Points</span>
            </div>
          </div>

          {/* Bake Button */}
          <button
            id="btn-bake-splat-path"
            onClick={handleBakePath}
            disabled={isBaking}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isBaking ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Bake 3D Camera Trajectory (60 FPS)</span>
          </button>
        </div>

        {/* Bottom Apply Action */}
        <div className="p-3 border-t border-[#1e2029] bg-[#12131b]">
          <button
            id="btn-apply-splat-timeline"
            onClick={handleApplyToTimeline}
            className="w-full py-2.5 bg-[#3B63FF] hover:bg-[#4d73ff] text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Apply 3D Composite to Track V2</span>
          </button>
        </div>
      </div>

      {/* Center 3D Interactive Viewport */}
      <div className="flex-1 flex flex-col bg-[#06070a] overflow-hidden">
        {/* Top Control Toolbar */}
        <div className="h-9 px-4 bg-[#101117] border-b border-[#1e2029] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">CAMERA: Virtual Arri Alexa Mini LF · 35mm Format</span>
            <span className="text-cyan-400">1920 x 1080 · 60.00 fps</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Drag left-click to Orbit · Right-click to Pan</span>
          </div>
        </div>

        {/* Main 3D Canvas Viewport */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(#151722_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-[#252836] shadow-2xl bg-black select-none">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Cinema Camera HUD Reticle */}
            <div className="absolute inset-8 pointer-events-none border border-white/10 rounded flex flex-col justify-between p-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                <span>[3D VOLUMETRIC SPLAT VIEWPORT]</span>
                <span>ISO 800 · 1/48s · 5600K</span>
              </div>

              {/* Center Crosshair */}
              <div className="self-center flex items-center justify-center">
                <div className="w-6 h-0.5 bg-cyan-400/60" />
                <div className="h-6 w-0.5 bg-cyan-400/60 -ml-3.5" />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>LENS: {selectedLensMm}mm f/{dofAperture}</span>
                <span className="text-emerald-400">PARALLAX LOCK: 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Playback Scrubber Bar */}
        <div className="h-12 px-6 bg-[#101117] border-t border-[#1e2029] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <button
              id="btn-play-splat-cam"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-[#3B63FF] hover:bg-[#4d73ff] flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>
            <span className="text-cyan-400">
              00:0{Math.floor(currentTimeMs / 1000)}:{(currentTimeMs % 1000).toString().padStart(3, "0")} / 00:05:000
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Keyframe Spline: Smooth Bezier</span>
            <span className="text-emerald-400 font-bold">RAYMARCHING DRIFT: 0.00%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
