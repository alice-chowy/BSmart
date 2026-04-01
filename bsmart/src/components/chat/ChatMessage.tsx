import { LogoPlaceholder } from "../common/LogoPlaceholder"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  loading?: boolean
}

export function ChatMessage({ role, content, loading = false }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <LogoPlaceholder size={32} />}
      <div
        className={`rounded-[18px] px-4 py-3 text-sm leading-6 ${
          isUser ? "bg-[#f0ede8] text-[#222]" : "bg-white text-[#333] shadow-sm"
        } max-w-[60%]`}
      >
        {loading ? <span className="text-[#888]"> <span className="bsmart-dot-anim">掃描中...</span> </span> : content}
      </div>
    </div>
  )
}
