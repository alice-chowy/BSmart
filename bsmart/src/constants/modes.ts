import type { Mode } from "../types"

export const MODE_OPTIONS: Mode[] = [
  { key: "scan",   number: 1, label: "掃描", icon: "/icons/scan_6.png",    iconSize: "w-5 h-5" },
  { key: "search", number: 2, label: "搜尋", icon: "/icons/search_2.png", iconSize: "w-4 h-4" },
  { key: "manage", number: 3, label: "管理", icon: "/icons/manage_2.png", iconSize: "w-4 h-4" },
  { key: "sync",   number: 4, label: "同步", icon: "/icons/sync_1.png",   iconSize: "w-4.25 h-4.25" },
]
