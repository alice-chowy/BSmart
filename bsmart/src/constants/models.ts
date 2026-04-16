import type { Model } from "../types"

export const MODELS: Model[] = [
  {
    id: "Gemma-4-Ultra",
    name: "Gemma 4 26B",
    desc: "Ultra — VRAM > 16 GB",
  },
  {
    id: "Llama-3.1-8B-Advance",
    name: "Llama 3.1 8B",
    desc: "Advance — VRAM 8–16 GB",
  },
  {
    id: "Gemma-4-Standard",
    name: "Gemma 4 4B",
    desc: "Standard — VRAM ≤ 8 GB",
  },
  {
    id: "Gemma-4-Lite",
    name: "Gemma 4 2B",
    desc: "Lite — CPU only",
  },
]

/** 後端 tier 字串 → MODELS 中對應的 id */
export const TIER_TO_MODEL_ID: Record<string, string> = {
  Ultra:    "Gemma-4-Ultra",
  Advance:  "Llama-3.1-8B-Advance",
  Standard: "Gemma-4-Standard",
  Lite:     "Gemma-4-Lite",
}
