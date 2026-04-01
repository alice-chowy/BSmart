import type { Chat } from "../../types"
import { IconPlaceholder } from "../common/IconPlaceholder"

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
  chats: Chat[]
  activeChat: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  deviceName?: string
}

export function Sidebar({
  expanded,
  onToggle,
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  deviceName,
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-col bg-[#d6dae8] border-r border-[#c0c4d4] p-2.5 overflow-hidden transition-all duration-200 ${
        expanded ? "w-[200px]" : "w-[48px]"
      }`}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5"
          title={expanded ? "收合左欄" : "展開左欄"}
        >
          <IconPlaceholder size={20} label="menu" />
        </button>
        {expanded && (
          <span className="ml-2 rounded-md bg-[#d8dce6] px-2 py-1 text-[12px] text-[#555]">收合左欄</span>
        )}
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mt-2 p-1.5"
        title="新對話"
      >
        <IconPlaceholder size={20} label="new-chat" />
      </button>

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

      <div className="mt-auto pt-3 border-t border-[#c0c4d4]">
        <div className="flex items-center gap-2">
          <IconPlaceholder size={22} label="device" style={{ background: "#333", borderRadius: "999px" }} />
          {expanded && <span className="text-[13px] font-semibold">{deviceName || "SE880"}</span>}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <IconPlaceholder size={22} label="connection" style={{ background: "#5a9a3c", borderRadius: "999px" }} />
          {expanded && <span className="text-[12px] text-[#5a9a3c]">連線中</span>}
        </div>
      </div>
    </aside>
  )
}
