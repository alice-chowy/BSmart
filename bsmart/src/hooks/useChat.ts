import { useCallback, useRef, useState } from "react"
import type { Chat, Mode } from "../types"

export function useChat(modelId?: string) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  // session_id per chat: Map<chatId, session_id>
  const sessionMap = useRef<Map<string, string>>(new Map())
  const wsRef = useRef<WebSocket | null>(null)

  const sendMessage = useCallback(
    (text: string) => {
      const trimmedText = text.trim()
      if (!trimmedText || isLoading) return

      // 關掉上一個還沒結束的 WS
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }

      // 決定 chatId
      let chatId = activeChatId
      if (!chatId) {
        chatId = Date.now().toString()
      }
      const currentChatId = chatId

      // 加入 user 訊息
      setChats((prev) => {
        const exists = prev.find((c) => c.id === currentChatId)
        if (exists) {
          return prev.map((c) =>
            c.id === currentChatId
              ? { ...c, messages: [...c.messages, { role: "user", content: trimmedText }] }
              : c,
          )
        }
        return [
          { id: currentChatId, title: trimmedText.slice(0, 16), messages: [{ role: "user", content: trimmedText }] },
          ...prev,
        ]
      })

      setActiveChatId(currentChatId)
      setIsLoading(true)

      // 先插入一個空的 assistant 訊息（用於 streaming 累加）
      const assistantPlaceholder = { role: "assistant" as const, content: "" }
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, assistantPlaceholder] }
            : c,
        ),
      )

      // 決定 session_id（與 chat 綁定）
      if (!sessionMap.current.has(currentChatId)) {
        const modeKey = selectedMode?.key ?? "scan"
        sessionMap.current.set(currentChatId, `${modeKey}_${currentChatId}`)
      }
      const sessionId = sessionMap.current.get(currentChatId)!

      // 建立 WebSocket 連線
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws/chat`)
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            message: trimmedText,
            mode: selectedMode?.key ?? "scan",
            session_id: sessionId,
            ...(modelId ? { model_id: modelId } : {}),
          }),
        )
      }

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            token: string
            done: boolean
          }
          // 累加 token 到最後一則 assistant 訊息
          setChats((prev) =>
            prev.map((c) => {
              if (c.id !== currentChatId) return c
              const msgs = [...c.messages]
              const last = msgs[msgs.length - 1]
              if (last?.role === "assistant") {
                msgs[msgs.length - 1] = { ...last, content: last.content + data.token }
              }
              return { ...c, messages: msgs }
            }),
          )
          if (data.done) {
            setIsLoading(false)
            ws.close()
            wsRef.current = null
          }
        } catch {
          // ignore malformed frames
        }
      }

      ws.onerror = () => {
        ws.close()
        wsRef.current = null
        // fallback: 用 POST /api/chat
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmedText,
            mode: selectedMode?.key ?? "scan",
            session_id: sessionId,
            ...(modelId ? { model_id: modelId } : {}),
          }),
        })
          .then((res) => res.json())
          .then((data: { response: string }) => {
            setChats((prev) =>
              prev.map((c) => {
                if (c.id !== currentChatId) return c
                const msgs = [...c.messages]
                const last = msgs[msgs.length - 1]
                if (last?.role === "assistant") {
                  msgs[msgs.length - 1] = { ...last, content: data.response }
                }
                return { ...c, messages: msgs }
              }),
            )
          })
          .catch(() => {
            setChats((prev) =>
              prev.map((c) => {
                if (c.id !== currentChatId) return c
                const msgs = [...c.messages]
                const last = msgs[msgs.length - 1]
                if (last?.role === "assistant") {
                  msgs[msgs.length - 1] = { ...last, content: "⚠️ 無法連線至後端，請確認伺服器已啟動。" }
                }
                return { ...c, messages: msgs }
              }),
            )
          })
          .finally(() => setIsLoading(false))
      }
    },
    [activeChatId, isLoading, selectedMode, modelId],
  )

  const newChat = () => {
    setActiveChatId(null)
    setSelectedMode(null)
  }

  const selectChat = (id: string) => {
    setActiveChatId(id)
  }

  const renameChat = (id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))
  }

  const deleteChat = (id: string) => {
    // 同步通知後端刪除
    const sessionId = sessionMap.current.get(id)
    if (sessionId) {
      fetch(`/api/history/${sessionId}`, { method: "DELETE" }).catch(() => {})
      sessionMap.current.delete(id)
    }
    setChats((prev) => prev.filter((c) => c.id !== id))
    if (activeChatId === id) setActiveChatId(null)
  }

  return {
    chats,
    activeChatId,
    activeChat: chats.find((c) => c.id === activeChatId),
    isLoading,
    selectedMode,
    sendMessage,
    newChat,
    selectChat,
    renameChat,
    deleteChat,
    setSelectedMode,
  }
}
