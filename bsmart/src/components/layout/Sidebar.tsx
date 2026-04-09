import type { Chat } from "../../types"
import { IconPlaceholder } from "../common/IconPlaceholder"

type ConnectionStatus = "connected" | "running" | "disconnected"

const CONNECTION_CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
  connected: { color: "#5a9a3c", label: "連線中" },
  running: { color: "#e07b00", label: "執行中" },
  disconnected: { color: "#999999", label: "已斷線" },
}

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
  chats: Chat[]
  activeChat: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onOpenSettings: () => void
  deviceName?: string
  connectionStatus?: ConnectionStatus
}

function SidebarTooltip({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-[#4D4D4D] px-2 py-1 text-xs text-white z-50 opacity-0 group-hover:opacity-100 transition-opacity">
      {text}
    </span>
  )
}

export function Sidebar({
  expanded,
  onToggle,
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onOpenSettings,
  deviceName,
  connectionStatus = "connected",
}: SidebarProps) {
  const conn = CONNECTION_CONFIG[connectionStatus]
  const iconRow = `relative group w-full flex ${expanded ? "" : "justify-center"}`

  return (
    <aside
      className={`flex flex-col bg-[#D4E1F5] border-r border-[#999999] transition-all duration-200 ${
        expanded ? "w-[200px] p-2.5" : "w-[48px] py-2.5"
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* 1. Toggle */}
        <div className={iconRow}>
          <button type="button" onClick={onToggle} aria-label={expanded ? "收回左欄" : "展開左欄"} className="p-1.5">
            <IconPlaceholder size={20} label="menu" />
          </button>
          <SidebarTooltip text={expanded ? "收回左欄" : "展開左欄"} />
        </div>

        {/* 2. New chat */}
        <div className={iconRow}>
          <button type="button" onClick={onNewChat} aria-label="新對話" className="p-1.5">
            <IconPlaceholder size={20} label="new-chat" />
          </button>
          {!expanded && <SidebarTooltip text="新對話" />}
        </div>

        {/* 3. Settings (expanded only) */}
        {expanded && (
          <div className={iconRow}>
            <button type="button" onClick={onOpenSettings} aria-label="設定" className="p-1.5">
              <IconPlaceholder size={20} label="settings" />
            </button>
            <SidebarTooltip text="設定" />
          </div>
        )}
      </div>

      {expanded && (
        <div className="flex-1 mt-3 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <button
              type="button"
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                chat.id === activeChat ? "bg-[#c8cfe0]" : "bg-transparent hover:bg-[#eef2f9]"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-[#999999]">
        <div className={`flex items-center ${expanded ? "gap-2 pl-1.5" : "justify-center"}`}>
          <IconPlaceholder size={22} label="device" style={{ background: "#333", borderRadius: "999px" }} />
          {expanded && <span className="text-[13px] font-semibold">{deviceName || "SE880"}</span>}
        </div>

        <div className={`relative group mt-2 flex items-center ${expanded ? "gap-2 pl-1.5" : "justify-center"}`}>
          <IconPlaceholder size={22} label="connection" style={{ background: conn.color, borderRadius: "999px" }} />
          {expanded ? (
            <>
              <span className="text-[12px]" style={{ color: conn.color }}>{conn.label}</span>
              <SidebarTooltip text="狀態" />
            </>
          ) : (
            <SidebarTooltip text={conn.label} />
          )}
        </div>
      </div>
    </aside>
  )
}
