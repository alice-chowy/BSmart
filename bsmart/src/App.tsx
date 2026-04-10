import { useEffect, useState } from 'react';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'running' | 'disconnected'>('disconnected');
  const chat = useChat(model.id);

  // 定期 poll /api/status 更新連線指示燈（每 10 秒）
  useEffect(() => {
    const check = () => {
      fetch('/api/status')
        .then((res) => res.json())
        .then((data: { agent?: string; llama?: string }) => {
          if (data.agent === 'ready') setConnectionStatus('connected');
          else setConnectionStatus('running');
        })
        .catch(() => setConnectionStatus('disconnected'));
    };
    check();
    const timer = setInterval(check, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCustomModel = (name: string) => {
    const newModel: Model = { id: name, name, desc: '自訂模型' };
    setCustomModels((prev) => [...prev, newModel]);
  };

  // 選模式 → 通知後端 POST /api/mode/select，拿回 suggestions
  const handleSelectMode = (mode: Mode) => {
    chat.setSelectedMode(mode);
    setSuggestions([]); // 先清空，等回傳
    fetch('/api/mode/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode.key }),
    })
      .then((res) => res.json())
      .then((data: { suggestions?: string[] }) => {
        setSuggestions(data.suggestions ?? []);
      })
      .catch(() => {});
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
        onClearAll={chat.clearAllChats}
        connectionStatus={connectionStatus}
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
            suggestions={suggestions}
          />
        ) : (
          <HomeView
            onSend={chat.sendMessage}
            selectedMode={chat.selectedMode}
            onSelectMode={handleSelectMode}
            suggestions={suggestions}
          />
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        models={MODELS}
        customModels={customModels}
        onAddCustom={handleAddCustomModel}
        onShutdown={() => {
          fetch('/api/shutdown', { method: 'POST' }).catch(() => {});
        }}
      />
    </div>
  );
}