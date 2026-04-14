import { useRef, useState } from "react"
import { PanelLeftClose, PanelLeftOpen, SquarePen, HardDrive, Wifi } from "lucide-react"
import type { Chat } from "../../types"
import { useClickOutside } from "../../hooks/useClickOutside"

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  onSelectChat: (id: string) => void
  onRenameChat?: (id: string, title: string) => void
  onDeleteChat?: (id: string) => void
}

function ChatItem({ chat, isActive, onSelectChat, onRenameChat, onDeleteChat }: ChatItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => setMenuOpen(false))

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onSelectChat(chat.id)}
        className={`w-full rounded-xl px-3 py-2 text-left text-xm flex items-center gap-1 ${
          isActive ? "bg-[#E9EEF6]" : "bg-transparent hover:bg-[#E9EEF6]"
        }`}
      >
        <span className="flex-1 truncate">{chat.title}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#555] hover:bg-[#D4DEF0] flex-shrink-0 leading-none"
        >
          ⋯
        </button>
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 z-50 w-36 overflow-hidden rounded-xl border border-[#999999] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          <button
            type="button"
            onClick={() => {
              const title = window.prompt("請輸入新名稱", chat.title)
              if (title && title.trim()) onRenameChat?.(chat.id, title.trim())
              setMenuOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-[#333] hover:bg-[#F5F5F5]"
          >
            <EditIcon />
            重新命名
          </button>
          <button
            type="button"
            onClick={() => {
              onDeleteChat?.(chat.id)
              setMenuOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-[#E53E3E] hover:bg-[#FFF0F0]"
          >
            <TrashIcon />
            刪除
          </button>
        </div>
      )}
    </div>
  )
}

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
  onRenameChat?: (id: string, title: string) => void
  onDeleteChat?: (id: string) => void
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
  onRenameChat,
  onDeleteChat,
}: SidebarProps) {
  const conn = CONNECTION_CONFIG[connectionStatus]
  const iconRow = `relative group w-full flex ${expanded ? "" : "justify-center"}`

  return (
    <aside
      className={`flex flex-col bg-[#D4E1F5] border-r border-[#999999] transition-all duration-200 overflow-visible ${
        expanded ? "w-[200px] p-2.5" : "w-[48px] py-2.5"
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* 1. Toggle */}
        <div className={iconRow}>
          <button
            type="button"
            onClick={onToggle}
            aria-label={expanded ? "收回左欄" : "展開左欄"}
            className="p-1.5 text-[#444] hover:text-[#111]"
          >
            {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        {/* 2. New chat */}
        <div className={iconRow}>
          <button
            type="button"
            onClick={onNewChat}
            aria-label="新對話"
            className="flex items-center gap-2 p-1.5 text-[#444] hover:text-[#111]"
          >
            <SquarePen size={20} />
            {expanded && <span className="text-sm font-medium">新的對話</span>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex-1 mt-3 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChat}
              onSelectChat={onSelectChat}
              onRenameChat={onRenameChat}
              onDeleteChat={onDeleteChat}
            />
          ))}
        </div>
      )}

      <div className="mt-auto">
        {expanded ? (
          <div className="border-t border-[#999999] mb-3" />
        ) : (
          <div className="flex justify-center mb-3">
            <div className="w-[60%] border-t border-[#999999]" />
          </div>
        )}
        <div className="pt-0">
        <div className={`relative group flex items-center ${expanded ? "gap-2 pl-1.5 cursor-pointer" : "justify-center cursor-pointer"}`} onClick={onOpenSettings} role="button" aria-label="設定">
          <HardDrive size={22} color="#333" />
          {expanded && <span className="text-[13px] font-semibold">{deviceName || "SE880"}</span>}
          <SidebarTooltip text="設定" />
        </div>

        <div className={`relative group mt-2 flex items-center ${expanded ? "gap-2 pl-1.5" : "justify-center"}`}>
          <Wifi size={22} color={conn.color} />
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
      </div>
    </aside>
  )
}
