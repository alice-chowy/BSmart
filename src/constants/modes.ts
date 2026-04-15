import type { Mode } from "../types"

export const MODE_OPTIONS: Mode[] = [
  { key: "scan",   number: 1, label: "掃描" },
  { key: "search", number: 2, label: "搜尋" },
  { key: "manage", number: 3, label: "管理" },
  { key: "sync",   number: 4, label: "同步" },
]
