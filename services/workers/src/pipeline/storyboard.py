import uuid
from typing import List, Dict, Any

class StoryboardEngine:
    """
    Stage 6 Visual Storyboard & Asset Matcher:
    Matches script scenes to stock b-roll queries, motion graphic templates,
    or generative AI diffusion prompts.
    """
    def generate_storyboard(self, script: Dict[str, Any], aspect_ratio: str = "16:9") -> Dict[str, Any]:
        scenes = script.get("scenes", [])
        if not scenes:
            raise ValueError("Script contains no scenes to storyboard")
        
        storyboard_items: List[Dict[str, Any]] = []
        cursor_ms = 0

        for scene in scenes:
            dur_ms = int(scene.get("duration_sec", 10) * 1000)
            template = scene.get("template", "QuoteCard")
            narration = scene.get("narration", "")

            # Determine visual strategy
            if template in ["BarChart", "LineChart", "Comparison", "TierList", "QuoteCard", "StatCounter"]:
                asset_strategy = "motion_graphic"
                stock_query = None
                diffusion_prompt = None
            else:
                asset_strategy = "stock_video"
                words = [w for w in narration.replace(".", "").replace(",", "").split() if len(w) > 4]
                stock_query = " ".join(words[:3]) if words else "technology modern"
                diffusion_prompt = f"Cinematic 4k shot of {stock_query}, hyperdetailed, editorial lighting"

            item = {
                "scene_id": scene.get("id"),
                "order": scene.get("order"),
                "start_ms": cursor_ms,
                "end_ms": cursor_ms + dur_ms,
                "duration_ms": dur_ms,
                "asset_strategy": asset_strategy,
                "template": template,
                "props": scene.get("props", {}),
                "stock_query": stock_query,
                "diffusion_prompt": diffusion_prompt,
                "aspect_ratio": aspect_ratio
            }
            storyboard_items.append(item)
            cursor_ms += dur_ms

        return {
            "storyboard_id": f"sb_{uuid.uuid4().hex[:8]}",
            "project_id": script.get("project_id"),
            "total_duration_ms": cursor_ms,
            "items_count": len(storyboard_items),
            "items": storyboard_items
        }
