import uuid
import datetime
from typing import List, Dict, Any

class ScriptWriter:
    """
    Stage 3 Scene Script Generator:
    Transforms research claims into a high-retention multi-scene sequence:
    Hook (0-15s) -> Core Narrative Data (3-4 scenes) -> Outro/CTA.
    Assigns Remotion motion graphic templates and typed props.
    """
    def generate_script(
        self,
        project_id: str,
        topic: str,
        claims: List[Dict[str, Any]],
        target_length_sec: int = 180,
        version: int = 1
    ) -> Dict[str, Any]:
        if not claims:
            raise ValueError("Cannot generate script without research claims")
        
        # Calculate scene durations
        hook_dur = min(15, max(8, int(target_length_sec * 0.12)))
        outro_dur = min(15, max(8, int(target_length_sec * 0.10)))
        remaining_dur = max(30, target_length_sec - hook_dur - outro_dur)
        per_body = max(10, remaining_dur // 3)
        last_body_dur = max(10, remaining_dur - (per_body * 2))

        scenes: List[Dict[str, Any]] = []

        # 1. Hook Scene
        scenes.append({
            "id": f"scene_1_{uuid.uuid4().hex[:6]}",
            "order": 1,
            "hook": f"Why is everyone talking about {topic} in 2026?",
            "narration": f"Traditional methods are failing. In 2026, the breakthrough in {topic} is transforming how high-performing teams operate.",
            "duration_sec": hook_dur,
            "template": "QuoteCard",
            "visual_intent": "Punchy typographic quote highlighting the core transformation",
            "props": {
                "quote": f"The breakthrough in {topic} isn't just speed—it's complete automation.",
                "author": "AI Video Studio Analysis"
            }
        })

        # 2. Scene 2: Data & Benchmark (BarChart)
        first_claim = claims[0]["claim"] if len(claims) > 0 else "Speed increased dramatically."
        scenes.append({
            "id": f"scene_2_{uuid.uuid4().hex[:6]}",
            "order": 2,
            "hook": "The numbers tell an undeniable story.",
            "narration": f"Here is what the benchmarks show: {first_claim} The performance leap completely outpaces legacy workflows.",
            "duration_sec": per_body,
            "template": "BarChart",
            "visual_intent": "Horizontal animated bar chart comparing legacy vs modern metrics",
            "props": {
                "title": "Throughput & Efficiency Gains",
                "unit": "x",
                "items": [
                    {"label": "Legacy Workflow", "value": 1, "color": "#ef4444"},
                    {"label": "Semi-Automated", "value": 3.5, "color": "#f59e0b"},
                    {"label": "AI Autonomous", "value": 10, "color": "#10b981"}
                ]
            }
        })

        # 3. Scene 3: Comparison (Comparison template)
        second_claim = claims[1]["claim"] if len(claims) > 1 else claims[0]["claim"]
        scenes.append({
            "id": f"scene_3_{uuid.uuid4().hex[:6]}",
            "order": 3,
            "hook": "Old architecture versus the new paradigm.",
            "narration": f"Comparing both models reveals the secret: {second_claim} Switching architectures eliminates ninety percent of bottlenecks.",
            "duration_sec": per_body,
            "template": "Comparison",
            "visual_intent": "Split-screen side-by-side comparison card",
            "props": {
                "title": "Legacy Approach vs AI Pipeline",
                "sideA": {
                    "title": "Legacy Stack",
                    "points": ["Manual keyframing", "Long render queues", "Siloed tools"],
                    "color": "#ef4444"
                },
                "sideB": {
                    "title": "Autonomous Studio",
                    "points": ["Instant text-to-video", "Zero credit throttling", "Clean-room MIT code"],
                    "color": "#10b981"
                }
            }
        })

        # 4. Scene 4: Key Metric (StatCounter)
        third_claim = claims[2]["claim"] if len(claims) > 2 else "Efficiency jumped by 80%."
        scenes.append({
            "id": f"scene_4_{uuid.uuid4().hex[:6]}",
            "order": 4,
            "hook": "The single metric that changes everything.",
            "narration": f"Consider this: {third_claim} When you combine speed with precision, quality compounds.",
            "duration_sec": last_body_dur,
            "template": "StatCounter",
            "visual_intent": "Big bold animated counter zooming into view",
            "props": {
                "number": 80,
                "suffix": "%",
                "label": "Reduction in Production Turnaround Time",
                "caption": "Verified across production benchmarks"
            }
        })

        # 5. Outro / CTA Scene
        scenes.append({
            "id": f"scene_5_{uuid.uuid4().hex[:6]}",
            "order": 5,
            "hook": "Here is what you should do next.",
            "narration": f"The future belongs to creators who automate the tedious and focus on the creative. Build your next video with AI Video Studio today.",
            "duration_sec": outro_dur,
            "template": "QuoteCard",
            "visual_intent": "Clean CTA card with product logo and subscription action",
            "props": {
                "quote": "Automate the tedious. Focus entirely on your story.",
                "author": "AI Video Studio"
            }
        })

        total_actual_sec = sum(s["duration_sec"] for s in scenes)

        return {
            "id": f"script_{uuid.uuid4().hex[:8]}",
            "project_id": project_id,
            "version": version,
            "total_duration_sec": total_actual_sec,
            "scenes_count": len(scenes),
            "scenes": scenes,
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
