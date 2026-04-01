# BSMART Frontend 專案重構 — GitHub Copilot Prompt

## 目標

將 `bsmart-app.jsx` 單檔 React 元件拆分為標準前端專案架構。技術棧：React 19 + Vite + Tailwind CSS。所有 logo/icon 維持佔位符（Placeholder），方便後續替換。

---

## 專案初始化

使用 Vite 建立 React + TypeScript 專案：

```bash
npm create vite@latest bsmart-app -- --template react-ts
cd bsmart-app
npm install
npm install -D tailwindcss @tailwindcss/vite
```

配置 Tailwind：在 `vite.config.ts` 加入 `@tailwindcss/vite` plugin，在 `src/index.css` 頂部加入 `@import "tailwindcss";`。

---

## 目標目錄結構

```
src/
├── main.tsx                    # ReactDOM entry
├── App.tsx                     # Router / screen state (splash → main)
├── index.css                   # Tailwind import + global styles (@keyframes)
│
├── constants/
│   ├── models.ts               # MODELS 預設模型陣列、Model type
│   └── modes.ts                # MODE_OPTIONS 功能模式陣列、Mode type
│
├── types/
│   └── index.ts                # 共用 type：Chat, Message, Model, Mode
│
├── hooks/
│   ├── useClickOutside.ts      # 通用 click outside hook（取代多處 useEffect）
│   └── useChat.ts              # 聊天狀態管理 hook（chats, activeChatId, send, newChat）
│
├── components/
│   ├── common/
│   │   ├── LogoPlaceholder.tsx  # Logo 佔位符元件
│   │   └── IconPlaceholder.tsx  # Icon 佔位符元件
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx          # 左側欄（展開/收合、對話歷史、裝置狀態）
│   │   └── TopBar.tsx           # 頂部列（包含 ModelSelector）
│   │
│   ├── splash/
│   │   └── SplashScreen.tsx     # 載入畫面（進度條動畫）
│   │
│   ├── home/
│   │   ├── HomeView.tsx         # 首頁歡迎畫面
│   │   └── DeviceBridge.tsx     # SSD ↔ 電腦雙卡片視覺元件
│   │
│   ├── chat/
│   │   ├── ChatView.tsx         # 對話頁面容器
│   │   ├── ChatMessage.tsx      # 單則訊息氣泡
│   │   └── ChatInput.tsx        # 輸入框（含 ModeMenu）
│   │
│   ├── model/
│   │   └── ModelSelector.tsx    # 模型下拉選單
│   │
│   ├── mode/
│   │   └── ModeMenu.tsx         # 功能模式彈出選單（掃描/匯入/還原/同步）
│   │
│   └── settings/
│       └── SettingsModal.tsx    # 模型管理浮窗（一般 / 模型管理分頁）
│
└── assets/
    └── placeholder/             # 未來放置實際 logo/icon 的目錄
```

---

## 拆分規則

### 1. Types（`src/types/index.ts`）

從 inline 定義抽出所有 TypeScript 介面：

```ts
export interface Model {
  id: string;
  name: string;
  desc: string;
}

export interface Mode {
  key: string;
  number: number;
  label: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}
```

### 2. Constants（`src/constants/`）

- `models.ts`：匯出 `MODELS: Model[]`（Llama-3.1-8B、Qwen2.5-14B-Instruct、Mistral Small 24B Instruct）
- `modes.ts`：匯出 `MODE_OPTIONS: Mode[]`（掃描、匯入、還原、同步）

### 3. Hooks

**`useClickOutside.ts`**：
接收 `ref` 和 `callback`，綁定/解綁 mousedown listener。取代 ModelSelector、ModeMenu、ChatInput 中重複的 useEffect 邏輯。

**`useChat.ts`**：
封裝以下狀態與方法：
- `chats`, `activeChatId`, `isLoading`, `selectedMode`
- `sendMessage(text: string)`：建立新對話（如尚未有 activeChatId）、新增 user message、1.5s 後模擬 assistant 回覆
- `newChat()`：重置 activeChatId 和 selectedMode
- `selectChat(id: string)`
- `setSelectedMode(mode: Mode)`

### 4. Components 拆分對應

| 原始程式碼區塊 | 目標檔案 | 備註 |
|---|---|---|
| `LogoPlaceholder` | `components/common/LogoPlaceholder.tsx` | Props: `size`, `label` |
| `IconPlaceholder` | `components/common/IconPlaceholder.tsx` | Props: `size`, `label`, `style`, `onClick` |
| `SplashScreen` | `components/splash/SplashScreen.tsx` | Props: `onFinish` |
| `DeviceBridge` | `components/home/DeviceBridge.tsx` | Props: `compact` |
| `HomeView` | `components/home/HomeView.tsx` | 組合 DeviceBridge + ChatInput |
| `ModelSelector` | `components/model/ModelSelector.tsx` | 使用 `useClickOutside`，Props 加入 `onOpenSettings` |
| `SettingsModal` | `components/settings/SettingsModal.tsx` | Props: `open`, `onClose`, `models`, `customModels`, `onAddCustom` |
| `Sidebar` | `components/layout/Sidebar.tsx` | 完整搬移 |
| `ChatInput` | `components/chat/ChatInput.tsx` | 內含 ModeMenu 或引用獨立 ModeMenu 元件 |
| `ModeMenu`（從 ChatInput 抽出） | `components/mode/ModeMenu.tsx` | Props: `open`, `selectedMode`, `onSelect` |
| `ChatMessage` | `components/chat/ChatMessage.tsx` | Props: `role`, `content`, `loading` |
| `ChatView` | `components/chat/ChatView.tsx` | 組合 DeviceBridge(compact) + ChatMessage list + ChatInput |
| `TopBar` | `components/layout/TopBar.tsx` | 包裝 ModelSelector |

### 5. Styling 遷移

將 `styles` 物件中的 inline styles 轉為 Tailwind utility classes：

- `styles.splash` → `className="w-screen h-screen bg-[#dde1ec] flex items-center justify-center"`
- `styles.appContainer` → `className="flex w-screen h-screen bg-[#ebeef5] overflow-hidden font-sans"`
- `styles.sidebar` → `className="bg-[#d6dae8] border-r border-[#c0c4d4] flex flex-col p-2.5 overflow-hidden shrink-0 transition-[width] duration-250"`
- 其餘依此類推，保留需要動態計算的部分（如 `width: expanded ? 200 : 48`）使用 inline style 或 Tailwind arbitrary values

將 `@keyframes dotPulse` 移至 `src/index.css`。

### 6. App.tsx 頂層結構

```tsx
export default function App() {
  const [screen, setScreen] = useState<"splash" | "main">("splash");
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customModels, setCustomModels] = useState<Model[]>([]);

  if (screen === "splash") {
    return <SplashScreen onFinish={() => setScreen("main")} />;
  }

  return (
    <div className="flex w-screen h-screen bg-[#ebeef5] overflow-hidden">
      <Sidebar ... />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar model={model} onSelect={setModel} onOpenSettings={() => setSettingsOpen(true)} />
        {chat.activeChatId ? <ChatView ... /> : <HomeView ... />}
      </div>
      <SettingsModal ... />
    </div>
  );
}
```

---

## 執行步驟

1. 初始化 Vite + React-TS 專案並設定 Tailwind
2. 建立 `src/types/index.ts` 和 `src/constants/` 下的常數檔
3. 建立 `src/hooks/useClickOutside.ts` 和 `src/hooks/useChat.ts`
4. 依上表逐一建立 components，從葉節點開始（Placeholder → DeviceBridge → ChatMessage → ...）
5. 將 inline styles 轉為 Tailwind classes
6. 組裝 `App.tsx`，驗證所有畫面狀態正常運作
7. 移除原始 `bsmart-app.jsx`

---

## 注意事項

- 所有 Logo/Icon 佔位符保持原樣，僅搬移至獨立檔案，不需替換為實際圖片
- 保持所有中文文案不變
- TypeScript strict mode 開啟
- 每個元件檔案使用 named export + default export 皆可，但全專案保持一致（建議 default export）
- 不引入額外狀態管理庫（Zustand/Redux），useChat hook 足夠應付當前規模
