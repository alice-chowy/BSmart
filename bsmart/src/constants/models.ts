import type { Model } from "../types"

export const MODELS: Model[] = [
  {
    id: "llama-3.1-8b",
    name: "Llama-3.1-8B",
    desc: "適用 CPU 及 GPU 記憶體小10GB電腦",
  },
  {
    id: "qwen-2.5-14b",
    name: "Qwen2.5-14B-Instruct",
    desc: "適用 GPU 記憶體約 12~16GB 電腦",
  },
  {
    id: "mistral-24b",
    name: "Mistral Small 24B Instruct",
    desc: "適用 GPU 記憶體 16GB 以上電腦",
  },
]
