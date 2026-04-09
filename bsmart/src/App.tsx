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
    <div className="flex h-screen w-full bg-slate-50 text-slate-700 font-sans overflow-hidden">
      <aside className="w-20 border-r border-slate-200 bg-white flex flex-col items-center py-8 gap-8 z-30 shadow-sm">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
          <Database size={24} />
        </div>
        <nav className="flex flex-col gap-6 mt-4">
          {[
            { id: 'backup',  Icon: Activity,   active: 'text-indigo-600 bg-indigo-50',  hover: 'hover:text-indigo-600 hover:bg-indigo-50' },
            { id: 'search',  Icon: SearchCode,  active: 'text-sky-600 bg-sky-50',        hover: 'hover:text-sky-600 hover:bg-sky-50' },
            { id: 'sync',    Icon: RefreshCcw,  active: 'text-purple-600 bg-purple-50',  hover: 'hover:text-purple-600 hover:bg-purple-50' },
            { id: 'manage',  Icon: Settings2,   active: 'text-emerald-600 bg-emerald-50',hover: 'hover:text-emerald-600 hover:bg-emerald-50' },
          ].map(({ id, Icon, active, hover }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`p-3 rounded-xl transition-all ${mode === id ? active : `text-slate-400 ${hover}`}`}
            >
              <Icon size={24} />
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Settings size={24} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative transition-all duration-700 ease-in-out">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <header className="p-6 flex justify-between items-center z-10 shrink-0">
          <div
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-sm cursor-pointer"
            onClick={() => setIsChatActive(false)}
          >
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${accentColor.dot}`} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">系統狀態:</span>
            <span className="text-sm font-extrabold text-slate-800">
              {mode === 'backup' && '資料讀取中'}
              {mode === 'search' && '深度搜尋中'}
              {mode === 'sync'   && '系統同步中'}
              {mode === 'manage' && '本機管理中'}
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
          <div className={`flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-xl border shadow-sm transition-all duration-300 ${accentColor.badge}`}>
            <Zap size={14} />
            串流同步中
          </div>
        </header>

        <div className={`flex flex-col items-center justify-center px-4 transition-all duration-700 ease-in-out shrink-0 ${isChatActive ? 'h-48 py-4' : 'flex-1 -mt-12'}`}>
          <div className={`relative w-full max-w-4xl flex items-center justify-between px-16 transition-all duration-700 ${isChatActive ? 'scale-50 h-32' : 'h-80 mb-12'}`}>
            <div className={`flex flex-col items-center gap-6 group transition-all duration-500 ${mode === 'manage' ? 'opacity-40 scale-95' : ''}`}>
              <div className="relative">
                {mode === 'search' && (
                  <div className="absolute inset-0 -m-4">
                    <div className="absolute inset-0 border-2 border-sky-400/30 rounded-full animate-ping" />
                    <div className="absolute inset-0 border border-sky-400/20 rounded-full animate-ping" style={{ animationDelay: '0.7s' }} />
                  </div>
                )}
                {mode !== 'manage' && (
                  <div className={`absolute top-0 left-0 w-full h-1.5 z-20 animate-scan-line rounded-full shadow-[0_0_12px] transition-colors duration-500 ${
                    mode === 'sync' ? 'bg-purple-500 shadow-purple-500' : mode === 'search' ? 'bg-sky-500 shadow-sky-500' : 'bg-indigo-500 shadow-indigo-500'
                  }`} />
                )}
                <div className="w-32 h-44 bg-white rounded-[2rem] flex flex-col items-center justify-center border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-40 transition-colors duration-500 ${
                    mode === 'sync' ? 'from-purple-100' : mode === 'search' ? 'from-sky-100' : 'from-indigo-100'
                  } to-transparent`} />
                  <HardDrive size={64} className={`mb-4 transition-colors duration-500 ${
                    mode === 'sync' ? 'text-purple-600' : mode === 'search' ? 'text-sky-600' : 'text-slate-800'
                  }`} />
                  <div className="flex gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${
                      mode === 'manage' ? 'bg-slate-300' : mode === 'sync' ? 'bg-purple-500 animate-pulse' : mode === 'search' ? 'bg-sky-500 animate-pulse' : 'bg-indigo-500 animate-pulse'
                    }`} />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>
              {!isChatActive && <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">External SSD</span>}
            </div>

            <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${mode === 'manage' ? 'opacity-0' : ''}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-px bg-slate-200/60" />
              {binaryData.map((d) => (
                <div
                  key={d.id}
                  className={`absolute font-mono text-[18px] font-black select-none transition-colors duration-500 ${
                    mode === 'sync' ? 'text-purple-500/40' : mode === 'search' ? 'text-sky-500/40' : 'text-indigo-500/40'
                  }`}
                  style={{
                    top: `${d.top}%`,
                    left: mode === 'sync' ? '62%' : '32%',
                    animationName: mode === 'sync' ? 'binaryFlowReverse' : mode === 'search' ? 'binaryFlowSearch' : 'binaryFlow',
                    animationDuration: `${d.speed}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationDelay: `${d.delay}s`,
                    opacity: 0,
                  }}
                >
                  {d.val}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {mode === 'manage' && (
                  <div className="absolute inset-0 -m-8 flex items-center justify-center">
                    <div className="w-full h-full border-[3px] border-dashed border-emerald-500/20 rounded-full animate-spin-slow" />
                    <div className="absolute w-[110%] h-[110%] border-t-2 border-emerald-500/40 rounded-full animate-spin" />
                  </div>
                )}
                <div className={`absolute inset-0 blur-3xl animate-pulse rounded-full transition-colors duration-500 ${
                  mode === 'sync' ? 'bg-purple-500/5' : mode === 'search' ? 'bg-sky-500/5' : mode === 'manage' ? 'bg-emerald-500/10' : 'bg-indigo-500/5'
                }`} />
                <div className={`w-60 h-44 bg-white border rounded-[2.5rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative z-10 transition-all duration-500 ${
                  mode === 'manage' ? 'border-emerald-200' : mode === 'search' ? 'border-sky-200' : mode === 'sync' ? 'border-purple-200' : 'border-slate-200'
                }`}>
                  <div className="w-full h-full bg-slate-50 rounded-[1.8rem] flex items-center justify-center border border-slate-100 relative overflow-hidden">
                    <Laptop size={80} className={
                      mode === 'manage' ? 'text-emerald-200' : mode === 'search' ? 'text-sky-200' : mode === 'sync' ? 'text-purple-200' : 'text-slate-300'
                    } />
                    <div className="absolute inset-0 grid grid-cols-5 gap-1 p-6 opacity-10">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full w-1 h-1 animate-ping ${
                            mode === 'sync' ? 'bg-purple-600' : mode === 'search' ? 'bg-sky-600' : mode === 'manage' ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {mode === 'manage'
                        ? <Settings2 className="text-emerald-500/50 animate-spin-slow" size={48} />
                        : mode === 'search'
                          ? <Search className="text-sky-500/40 animate-bounce" size={40} />
                          : <ArrowRightLeft className={`animate-pulse ${mode === 'sync' ? 'text-purple-500/30' : 'text-indigo-500/30'}`} size={40} />
                      }
                    </div>
                  </div>
                </div>
              </div>
              {!isChatActive && (
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-colors duration-500 ${
                  mode === 'manage' ? 'text-emerald-600' : mode === 'search' ? 'text-sky-600' : mode === 'sync' ? 'text-purple-600' : 'text-slate-400'
                }`}>Local Workstation</span>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-col items-center transition-all duration-700 w-full max-w-3xl mx-auto px-6 ${isChatActive ? 'flex-1 overflow-hidden pb-6' : 'mb-12'}`}>
          {isChatActive && (
            <div className="flex-1 w-full overflow-y-auto mb-6 pr-2 space-y-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex items-start gap-4 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${chat.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-white'}`}>
                    {chat.role === 'user' ? <User size={20} /> : <Database size={20} />}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium shadow-sm ${
                    chat.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 rounded-tl-none text-slate-700'
                  }`}>
                    {chat.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          {!isChatActive && (
            <div className="w-full text-center space-y-6 mb-10">
              <div className="flex justify-center gap-2">
                {[
                  { id: 'backup', label: '讀取備份', Icon: Zap,       activeClass: 'bg-indigo-600 text-white border-indigo-600' },
                  { id: 'search', label: '深度搜尋', Icon: Search,     activeClass: 'bg-sky-500 text-white border-sky-500' },
                  { id: 'sync',   label: '系統同步', Icon: RefreshCcw, activeClass: 'bg-purple-600 text-white border-purple-600' },
                  { id: 'manage', label: '管理地端', Icon: Settings2,  activeClass: 'bg-emerald-600 text-white border-emerald-600' },
                ].map(({ id, label, Icon, activeClass }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border transition-all duration-300 shadow-sm ${
                      mode === id ? `${activeClass} shadow-md` : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                  {mode === 'manage' ? <>正在管理 <span className="text-emerald-600">地端主機</span></>
                    : mode === 'backup' ? <>你好，我是您的 <span className="text-indigo-600">備份助手</span></>
                    : mode === 'search' ? <>正在為您 <span className="text-sky-500">檢索檔案</span></>
                    : <>正在執行 <span className="text-purple-600">系統同步</span></>
                  }
                </h1>
                <p className="text-slate-500 text-base font-medium leading-relaxed">
                  數據串流穩定。請在下方輸入指令，我將立即為您處理磁碟檔案。
                </p>
              </div>
            </div>
          )}

          <div className="w-full relative group">
            <div className={`absolute -inset-2 rounded-[2.2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700 ${
              mode === 'sync' ? 'bg-purple-500/10' : mode === 'search' ? 'bg-sky-500/10' : mode === 'manage' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
            }`} />
            <div className="relative bg-white border border-slate-200 rounded-[1.8rem] flex items-center p-2.5 pr-4 shadow-2xl shadow-slate-200/50 focus-within:border-slate-300 transition-all">
              <div className={`p-4 rounded-2xl mr-4 shadow-inner transition-colors duration-500 ${
                mode === 'sync'   ? 'text-purple-500 bg-purple-50'
                : mode === 'search' ? 'text-sky-500 bg-sky-50'
                : mode === 'manage' ? 'text-emerald-500 bg-emerald-50'
                : 'text-indigo-500 bg-indigo-50'
              }`}>
                {mode === 'search' ? <Search size={24} /> : mode === 'manage' ? <Settings2 size={24} /> : <Zap size={24} />}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="輸入指令啟動分析..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 text-lg font-bold outline-none"
              />
              <button
                onClick={handleSendMessage}
                className={`px-8 py-4 text-white rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl active:scale-95 ${
                  mode === 'sync'   ? 'bg-purple-600 hover:bg-purple-500'
                  : mode === 'search' ? 'bg-sky-500 hover:bg-sky-600'
                  : mode === 'manage' ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-slate-900 hover:bg-indigo-600'
                }`}
              >
                {isChatActive ? '發送' : mode === 'search' ? '開始搜尋' : '執行指令'}
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes binaryFlow {
          0%   { left: 32%; opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 62%; opacity: 0; transform: scale(1.1); }
        }
        @keyframes binaryFlowSearch {
          0%   { left: 45%; opacity: 0; transform: scale(0.5) translateY(10px); }
          50%  { opacity: 1; transform: scale(1.3) translateY(-15px); }
          100% { left: 52%; opacity: 0; transform: scale(0.5) translateY(0); }
        }
        @keyframes binaryFlowReverse {
          0%   { left: 62%; opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 32%; opacity: 0; transform: scale(1.1); }
        }
        @keyframes scan-line {
          0%   { top: 5%;  opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-scan-line { animation: scan-line 3.2s cubic-bezier(0.4,0,0.2,1) infinite; }
      `}} />
    </div>
  );
}
