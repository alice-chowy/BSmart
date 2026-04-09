import type { Mode } from "../types"

export const MODE_OPTIONS: Mode[] = [
  { key: "scan", number: 1, label: "掃描" },
  { key: "import", number: 2, label: "匯入" },
  { key: "restore", number: 3, label: "還原" },
  { key: "sync", number: 4, label: "同步" },
]
