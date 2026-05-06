# bsmart — AI SSD 對話介面

> 一般使用者透過自然語言對話與 SSD 裝置互動，執行掃描、搜尋、管理、同步等操作的前端原型。

---

## Purpose

bsmart 是 AI SSD 備份助手的前端原型。使用者不需要了解底層指令，透過對話介面即可驅動 SSD 掃描、語意搜尋、檔案管理與資料同步，降低技術門檻並提升操作可信度。

**為誰解決：** 不熟悉技術的一般使用者  
**解決後的價值：** 降低 SSD 維護的操作門檻；透過 AI 對話取代手動指令

---

## Scope

### In Scope
- SplashScreen 開機流程（WebSocket boot 推送 + 進度條）
- 四種對話模式：`scan`（掃描）、`search`（語意搜尋）、`manage`（管理）、`sync`（同步）
- Streaming 對話（WebSocket `/ws/chat`，fallback 至 REST）
- 對話歷史管理（載入 / 刪除 / 新增）
- AI 模型切換（llama-3.1-8B / Qwen2.5-14B / Mistral-Small-24B）
- 關機流程（`POST /api/shutdown` + DisconnectedScreen）

### Out of Scope
- 實際 SSD 硬體存取（由 AISSD_MockServer 模擬）
- 使用者帳號 / 登入機制
- 多裝置同時連線
- 行動端 / 響應式支援（目前僅 1024px+ 桌面）

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | ~5.9（strict mode） |
| UI Framework | React | ^19.2 |
| Build Tool | Vite | ^8 |
| CSS | Tailwind CSS | ^4.2（@tailwindcss/vite plugin） |
| Icons | Lucide React | ^1.8 |
| Markdown | react-markdown | ^10.1 |
| Linting | ESLint + typescript-eslint | ^9 |
| Backend (Mock) | AISSD_MockServer.exe | localhost:8081 |

### AI 模型

| Model ID | 適用場景 |
|----------|---------|
| `llama-3.1-8B` | CPU 或低記憶體 GPU |
| `Qwen2.5-14B-Instruct` | GPU 12–16 GB |
| `Mistral-Small-24B-Instruct` | GPU 16 GB 以上 |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser（React + TypeScript）                          │
│                                                         │
│  元件層（.tsx）                                          │
│    SplashScreen / HomeView / ChatView / Sidebar         │
│    TopBar / SettingsModal / DisconnectedScreen          │
│         │ props / callbacks                             │
│  Hook 層                                                │
│    useChat.ts  ── 狀態管理、WebSocket 生命週期、API 呼叫 │
│         │ fetch / WebSocket                             │
│  Vite Dev Proxy                                         │
│    /api  →  http://localhost:8081                       │
│    /ws   →  http://localhost:8081 (ws: true)            │
└─────────────────────────────────────────────────────────┘
         ↕  REST + WebSocket
┌─────────────────────────────────────────────────────────┐
│  AISSD_MockServer.exe（FastAPI, localhost:8081）         │
└─────────────────────────────────────────────────────────┘
```

**分層規則：**
- 元件層只讀 props、呼叫 callback，不持有 WebSocket 或直接 `fetch`
- WebSocket 生命週期統一由 `useChat.ts` 管理
- 所有 API 路徑透過 Vite proxy `/api`、`/ws`，不硬寫後端位址

---

## Quick Start

### 前置需求
- Node.js 18+
- Windows（AISSD_MockServer.exe 為 Windows 執行檔）

### 啟動步驟

```bash
# Step 1：啟動 Mock Server
cd AISSD_MockServer
.\AISSD_MockServer.exe      # → http://localhost:8081

# Step 2：啟動前端（新 Terminal）
cd bsmart
npm install
npm run dev                  # → http://localhost:5173
```

### 建置與品質檢查

```bash
cd bsmart

# 建置
npm run build                # tsc -b && vite build

# 預覽建置結果
npm run preview

# Lint
npm run lint

# Type Check
npx tsc --noEmit
```

### 核心路徑驗證（PR Gate）

```
SplashScreen 開機 → 進入主畫面 → 選擇對話模式 → 送出訊息 → 收到 AI 回覆
```

---

## Project Structure

```
SSD/                              ← 專案根目錄
├── bsmart/                       ← 前端應用
│   ├── src/
│   │   ├── App.tsx               ← 頂層狀態協調（唯一可直接 fetch 的元件）
│   │   ├── components/
│   │   │   ├── chat/             ← ChatView, ChatMessage, ChatInput
│   │   │   ├── common/           ← 共用 UI 元件
│   │   │   ├── home/             ← HomeView, DeviceBridge, ModeMenu
│   │   │   ├── layout/           ← TopBar, Sidebar
│   │   │   ├── mode/             ← 模式相關元件
│   │   │   ├── model/            ← 模型選擇元件
│   │   │   ├── settings/         ← SettingsModal
│   │   │   └── splash/           ← SplashScreen
│   │   ├── hooks/
│   │   │   └── useChat.ts        ← 核心狀態管理（WebSocket + API）
│   │   ├── constants/
│   │   │   ├── models.ts         ← AI 模型清單（靜態）
│   │   │   └── modes.ts          ← 對話模式清單（靜態）
│   │   └── types/
│   │       └── index.ts          ← 所有 TypeScript 型別定義
│   └── vite.config.ts            ← Vite 設定（含 Proxy + @logo alias）
├── AISSD_MockServer/             ← Mock 後端（封裝執行檔，不可修改）
├── logo/                         ← bsmart LOGO 資源（@logo alias 指向此處）
├── docs/                         ← AI 輔助開發文件
│   ├── mvp-spec.md               ← MVP 規格（Sprint 1-3 完成）
│   └── mvp-tasks.md              ← 任務追蹤與技術債
├── API_REFERENCE.md              ← REST + WebSocket 端點文件
├── .github/copilot-instructions.md ← Copilot 指令集
└── AGENTS.md                     ← AI Agent 行為邊界
```

---

## References

- [API Reference](API_REFERENCE.md) — REST + WebSocket 端點完整文件
- [Copilot Instructions](.github/copilot-instructions.md) — 編碼標準與開發指南
- [AGENTS.md](AGENTS.md) — AI Agent 行為邊界（高優先級）
- [MVP Spec](docs/mvp-spec.md) — 功能規格（Sprint 1-3）
- [MVP Tasks](docs/mvp-tasks.md) — 任務追蹤與技術債
