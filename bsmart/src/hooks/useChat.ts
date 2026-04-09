import { useState } from "react"
import type { Chat, Mode } from "../types"

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)

  const sendMessage = (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    const fullText = selectedMode ? `${selectedMode.label} ${trimmedText}` : trimmedText
    let chatId = activeChatId

    setChats((prevChats) => {
      if (!chatId) {
        chatId = Date.now().toString()
        return [
          {
            id: chatId,
            title: fullText.slice(0, 12),
            messages: [{ role: "user", content: fullText }],
          },
          ...prevChats,
        ]
      }

      return prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, { role: "user", content: fullText }],
            }
          : chat,
      )
    })

    if (!chatId) {
      chatId = Date.now().toString()
    }

    setActiveChatId(chatId)
    setIsLoading(true)

    window.setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: `已收到指令：「${fullText}」。正在處理中...`,
                  },
                ],
              }
            : chat,
        ),
      )
      setIsLoading(false)
    }, 1500)
  }

  const newChat = () => {
    setActiveChatId(null)
    setSelectedMode(null)
  }

  const selectChat = (id: string) => {
    setActiveChatId(id)
  }

  const renameChat = (id: string, title: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === id ? { ...chat, title } : chat)),
    )
  }

  const deleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id))
    if (activeChatId === id) {
      setActiveChatId(null)
    }
  }

  return {
    chats,
    activeChatId,
    activeChat: chats.find((chat) => chat.id === activeChatId),
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
