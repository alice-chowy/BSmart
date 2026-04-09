import { useState, useEffect, useRef } from 'react';
import {
  HardDrive,
  Laptop,
  Send,
  Settings,
  ChevronDown,
  Search,
  Database,
  Zap,
  Activity,
  ArrowRightLeft,
  RefreshCcw,
  SearchCode,
  Settings2,
  User,
} from 'lucide-react';
import { SplashScreen } from './components/splash/SplashScreen';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'main'>('splash');
  const [mode, setMode] = useState('backup');
  const [isChatActive, setIsChatActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [binaryData, setBinaryData] = useState<Array<{
    id: number; val: number; delay: number; top: number; speed: number;
  }>>([]);

  useEffect(() => {
    const data = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      val: Math.round(Math.random()),
      delay: i * 0.2,
      top: Math.random() * 50 + 25,
      speed: Math.random() * 0.7 + 1.2,
    }));
    setBinaryData(data);
  }, [mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (!isChatActive) setIsChatActive(true);
    const newUserMsg = { role: 'user', content: inputValue };
    const newAiMsg = {
      role: 'ai',
      content: `正在為您執行「${inputValue}」相關的操作... 磁碟狀態良好，同步進度正常。`,
    };
    setChatHistory((prev) => [...prev, newUserMsg, newAiMsg]);
    setInputValue('');
  };

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('main')} />;
  }

  const accentColor = {
    sync:   { dot: 'bg-purple-500', badge: 'text-purple-600 border-purple-100', zap: 'fill-purple-600' },
    search: { dot: 'bg-sky-500',    badge: 'text-sky-600 border-sky-100',       zap: 'fill-sky-600'    },
    manage: { dot: 'bg-emerald-500',badge: 'text-emerald-600 border-emerald-100',zap: 'fill-emerald-600'},
    backup: { dot: 'bg-indigo-500', badge: 'text-indigo-600 border-indigo-100', zap: 'fill-indigo-600' },
  }[mode] ?? { dot: 'bg-indigo-500', badge: 'text-indigo-600 border-indigo-100', zap: 'fill-indigo-600' };

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
  );
}
