import { useState } from "react"
import { MODELS } from "./constants/models"
import { useChat } from "./hooks/useChat"
import { SplashScreen } from "./components/splash/SplashScreen"
import { Sidebar } from "./components/layout/Sidebar"
import { TopBar } from "./components/layout/TopBar"
import { ChatView } from "./components/chat/ChatView"
import { HomeView } from "./components/home/HomeView"
import { SettingsModal } from "./components/settings/SettingsModal"
import type { Model } from "./types"

export default function App() {
  const [screen, setScreen] = useState<"splash" | "main">("splash")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [model, setModel] = useState<Model>(MODELS[0])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customModels, setCustomModels] = useState<Model[]>([])
  const chat = useChat()

  const handleAddCustomModel = (name: string) => {
    setCustomModels((prev) => [...prev, { id: `custom-${Date.now()}`, name, desc: "自訂模型" }])
  }

  if (screen === "splash") {
    return <SplashScreen onFinish={() => setScreen("main")} />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ebeef5] font-sans text-[#111]">
      <Sidebar
        expanded={sidebarOpen}
        onToggle={() => setSidebarOpen((value) => !value)}
        chats={chat.chats}
        activeChat={chat.activeChatId}
        onSelectChat={chat.selectChat}
        onNewChat={chat.newChat}
        onOpenSettings={() => setSettingsOpen(true)}
        deviceName="SE880"
      />

      <div className={`flex-1 flex flex-col overflow-hidden ${chat.activeChatId ? "bg-white" : "bg-[#F0F4F8]"}`}>
        <TopBar model={model} onSelect={setModel} onOpenSettings={() => setSettingsOpen(true)} />
        {chat.activeChatId ? (
          <ChatView
            messages={chat.activeChat?.messages ?? []}
            onSend={chat.sendMessage}
            isLoading={chat.isLoading}
            selectedMode={chat.selectedMode}
            onSelectMode={chat.setSelectedMode}
          />
        ) : (
          <HomeView
            onSend={chat.sendMessage}
            selectedMode={chat.selectedMode}
            onSelectMode={chat.setSelectedMode}
          />
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        models={MODELS}
        customModels={customModels}
        onAddCustom={handleAddCustomModel}
      />
    </div>
  )
}
