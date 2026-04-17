import { useEffect, useRef } from "react"
import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"
import { DeviceBridge } from "../home/DeviceBridge"
import type { Message, Mode } from "../../types"

interface ChatViewProps {
  messages: Message[]
  onSend: (text: string) => void
  isLoading: boolean
  selectedMode: Mode | null
  onSelectMode: (mode: Mode) => void
  suggestions?: string[]
}

export function ChatView({
  messages,
  onSend,
  isLoading,
  selectedMode,
  onSelectMode,
  suggestions = [],
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="py-2">
        <DeviceBridge compact mode={selectedMode} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-5">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="" loading />}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 pb-6">
        <ChatInput
          onSend={onSend}
          placeholder="掃描"
          disabled={isLoading}
          showModeIcon
          selectedMode={selectedMode}
          onSelectMode={onSelectMode}
          suggestions={suggestions}
        />
      </div>
    </div>
  )
}
