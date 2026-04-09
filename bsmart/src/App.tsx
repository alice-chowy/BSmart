import { useState } from 'react';
import { SplashScreen } from './components/splash/SplashScreen';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ChatView } from './components/chat/ChatView';
import { HomeView } from './components/home/HomeView';
import { SettingsModal } from './components/settings/SettingsModal';
import { useChat } from './hooks/useChat';
import { MODELS } from './constants/models';
import type { Model, Mode } from './types';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'main'>('splash');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [model, setModel] = useState<Model>(MODELS[0]);
  const [customModels, setCustomModels] = useState<Model[]>([]);
  const chat = useChat(model.id);

  const handleAddCustomModel = (name: string) => {
    const newModel: Model = { id: name, name, desc: '自訂模型' };
    setCustomModels((prev) => [...prev, newModel]);
  };

  // 選模式 → 通知後端 POST /api/mode/select
  const handleSelectMode = (mode: Mode) => {
    chat.setSelectedMode(mode);
    fetch('/api/mode/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode.key }),
    }).catch(() => {}); // 失敗靜默，不影響前端互動
  };

  // 切換模型 → 通知後端 POST /api/models/select
  const handleSelectModel = (m: Model) => {
    setModel(m);
    fetch('/api/models/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_id: m.id }),
    }).catch(() => {});
  };

  // SplashScreen 完成後 → 確認後端 agent ready，再進主畫面
  const handleSplashFinish = () => {
    fetch('/api/status')
      .then((res) => res.json())
      .then(() => {
        setScreen('main');
      })
      .catch(() => {
        // 後端沒開也能正常進入（Mock 模式）
        setScreen('main');
      });
  };

  if (screen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
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
        onRenameChat={chat.renameChat}
        onDeleteChat={chat.deleteChat}
        deviceName="SE880"
      />

      <div className={`flex-1 flex flex-col overflow-hidden ${chat.activeChatId ? 'bg-white' : 'bg-[#F0F4F8]'}`}>
        <TopBar model={model} onSelect={handleSelectModel} onOpenSettings={() => setSettingsOpen(true)} />
        {chat.activeChatId ? (
          <ChatView
            messages={chat.activeChat?.messages ?? []}
            onSend={chat.sendMessage}
            isLoading={chat.isLoading}
            selectedMode={chat.selectedMode}
            onSelectMode={handleSelectMode}
          />
        ) : (
          <HomeView
            onSend={chat.sendMessage}
            selectedMode={chat.selectedMode}
            onSelectMode={handleSelectMode}
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
  );
}