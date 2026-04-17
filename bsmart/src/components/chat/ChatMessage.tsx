import ReactMarkdown from 'react-markdown'
import { LogoPlaceholder } from "../common/LogoPlaceholder"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  loading?: boolean
  timestamp?: string
}

export function ChatMessage({ role, content, loading = false, timestamp }: ChatMessageProps) {
  const isUser = role === "user"
  const timeLabel = timestamp
    ? new Date(timestamp).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })
    : null

  return (
    <div className={`flex gap-3 mb-5 ${isUser ? "justify-end pr-40" : "justify-start pl-40"}`}>
      {!isUser && <LogoPlaceholder size={32} />}
      <div className="flex flex-col gap-0.5 max-w-[60%]">
        <div
          className={`rounded-[18px] px-4 py-3 text-sm leading-6 break-words overflow-hidden ${
            isUser ? "bg-[#f0ede8] text-[#222]" : "bg-white text-[#333] shadow-sm"
          }`}
        >
          {loading ? (
            <span className="text-[#888]"> <span className="bsmart-dot-anim">掃描中...</span> </span>
          ) : isUser ? (
            content
          ) : (
            <div className="markdown-body"><ReactMarkdown>{content}</ReactMarkdown></div>
          )}
        </div>
        {timeLabel && !loading && (
          <span className={`text-[10px] text-[#bbb] px-1 ${isUser ? "text-right" : "text-left"}`}>
            {timeLabel}
          </span>
        )}
      </div>
    </div>
  )
}