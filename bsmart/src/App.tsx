import { useEffect, useState } from 'react';
import { SplashScreen } from './components/splash/SplashScreen';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ChatView } from './components/chat/ChatView';
import { HomeView } from './components/home/HomeView';
import { SettingsModal } from './components/settings/SettingsModal';
import { useChat } from './hooks/useChat';
import { MODELS, TIER_TO_MODEL_ID } from './constants/models';
import type { Model, Mode, QuickAction } from './types';
import logoRmbg from '@logo/LOGO_rmbg.png';

interface HardwareInfo {
  source: string
  name: string
  total_mb: number
  free_mb: number
}

type ConnectionStatus = 'connected' | 'loading' | 'disconnected';

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
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('loading');
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [modeDescription, setModeDescription] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const chat = useChat(model.id);

  // Toast 自動消失
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(id);
  }, [toast]);

  // 有對話在進行時顯示橘色「執行中」，否則依 connectionStatus
  const displayConnectionStatus =
    chat.isLoading ? 'running' as const : connectionStatus;

  // 關閉/離開頁面時的提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '關閉網頁不會停止 AI 運算，您可隨時回來查看進度。';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (screen !== 'main') return;
    const poll = () => {
      fetch('/api/status')
        .then((res) => res.json())
        .then((data: { llama?: string; agent?: string }) => {
          if (data.llama === 'running' && data.agent === 'ready') {
            setConnectionStatus('connected');
          } else if (data.llama === 'loading' || data.agent === 'initializing') {
            setConnectionStatus('loading');
          } else if (data.llama === 'stopped') {
            setConnectionStatus('disconnected');
          }
        })
        .catch(() => {
          setConnectionStatus('disconnected');
        });
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, [screen]);

  const handleAddCustomModel = (name: string) => {
    const newModel: Model = { id: name, name, desc: '自訂模型' };
    setCustomModels((prev) => [...prev, newModel]);
  };

  const handleNewChat = () => {
    chat.newChat();
    setSuggestions([]);
    setQuickActions([]);
    setModeDescription(null);
  };

  // 點擊插頭 icon（連線中）→ 詢問是否離開
  const handleConnectionClick = () => {
    if (connectionStatus !== 'connected') return;
    if (window.confirm('離開 BSMART？')) {
      setConnectionStatus('disconnected');
      setScreen('disconnected');
    }
  };

  // 選模式 → 通知後端 POST /api/mode/select，拿回 suggestions
  const handleSelectMode = (mode: Mode) => {
    chat.setSelectedMode(mode);
    setSuggestions([]); // 先清空，等回傳
    setQuickActions([]);
    setModeDescription(null);
    fetch('/api/mode/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode.key }),
    })
      .then((res) => res.json())
      .then((data: { suggestions?: string[]; quick_actions?: QuickAction[]; name?: string; description?: string }) => {
        setSuggestions(data.suggestions ?? []);
        setQuickActions(data.quick_actions ?? []);
        if (data.description) setModeDescription(data.description);
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
    })
      .then((res) => res.json())
      .then((data: { message?: string }) => {
        setToast(data.message ?? `已切換至 ${m.name}`);
      })
      .catch(() => {});
  };

  // SplashScreen 完成後 → 從 /api/status 取 tier & hardware，自動套用推薦模型
  const handleSplashFinish = () => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data: { tier?: string; hardware?: HardwareInfo }) => {
        if (data.tier) {
          const modelId = TIER_TO_MODEL_ID[data.tier];
          const matched = modelId ? MODELS.find((m) => m.id === modelId) : undefined;
          if (matched) setModel(matched);
        }
        if (data.hardware) setHardware(data.hardware);
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
        onNewChat={handleNewChat}
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
            quickActions={quickActions}
          />
        ) : (
          <HomeView
            onSend={chat.sendMessage}
            selectedMode={chat.selectedMode}
            onSelectMode={handleSelectMode}
            suggestions={suggestions}
            quickActions={quickActions}
            modeDescription={modeDescription}
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
        hardware={hardware}
      />

      {/* 模型切換 Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-xl bg-[#333] px-5 py-2.5 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast}
        </div>
      )}
    </div>
  );
}