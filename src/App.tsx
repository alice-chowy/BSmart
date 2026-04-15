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
import logoRmbg from '@logo/LOGO_rmbg.png';

type ConnectionStatus = 'connected' | 'running' | 'disconnected';

// 離開後的關閉畫面
function DisconnectedScreen() {
  return (
    <div className="w-screen h-screen bg-[#D4E1F5] flex flex-col items-center justify-center gap-4">
      <img src={logoRmbg} alt="BSMART" style={{ maxHeight: 180, maxWidth: 380 }} className="object-contain" />
      <p className="text-[#4a4a7a] text-sm tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        BSMART 已關閉，可以安全關閉此視窗
      </p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'main' | 'disconnected'>('splash');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [model, setModel] = useState<Model>(MODELS[0]);
  const [customModels, setCustomModels] = useState<Model[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const chat = useChat(model.id);

  // 有對話在進行時顯示橘色「執行中」，否則依 connectionStatus
  const displayConnectionStatus: ConnectionStatus =
    chat.isLoading ? 'running' : connectionStatus;

  // 關閉/離開頁面時的提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      if (screen === 'disconnected') {
        e.returnValue = '確定離開?';
      } else {
        e.returnValue = '關閉網頁不會停止BSMART，可以隨時回來查看進度';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [screen]);

  const handleAddCustomModel = (name: string) => {
    const newModel: Model = { id: name, name, desc: '自訂模型' };
    setCustomModels((prev) => [...prev, newModel]);
  };

  // 點擊插頭 icon（連線中）→ 詢問是否離開
  const handleConnectionClick = () => {
    if (connectionStatus !== 'connected') return;
    if (window.confirm('離開 BSMART？')) {
      chat.shutdown();
      setConnectionStatus('disconnected');
      setScreen('disconnected');
    }
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

  if (screen === 'disconnected') {
    return <DisconnectedScreen />;
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
        connectionStatus={displayConnectionStatus}
        onConnectionClick={handleConnectionClick}
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
        onClearAllChats={chat.clearAllChats}
        onShutdown={chat.shutdown}
      />
    </div>
  );
}