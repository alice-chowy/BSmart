# bsmart — AI SSD 智慧對話介面

> 運行於本地端固態硬碟（SSD）的 AI 對話前端，透過 WebSocket streaming 與本地 LLM 互動，支援掃描、搜尋、管理、同步四種作業模式。

## Scope

### In Scope
- 四種 SSD 作業對話模式（scan / search / manage / sync）
- 本地 LLM 模型切換（Llama 3.1 8B / Qwen2.5 14B / Mistral Small 24B）
- WebSocket streaming 逐字輸出對話
- 對話歷史管理（列表、載入、刪除）
- 開機載入 SplashScreen（WebSocket `/ws/boot`）

### Out of Scope
- 後端 LLM 推論引擎（由 AISSD_MockServer 模擬，正式版另行開發）
- 雲端部署、使用者帳號認證
- 行動端 / 平板適配
- 真實 SSD 硬體整合（目前為 Mock）

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | ~5.9 |
| UI Framework | React | ^19.2 |
| Build Tool | Vite | ^8 |
| CSS | Tailwind CSS | ^4.2 |
| Icons | Lucide React | ^1.8 |
| Backend (Mock) | FastAPI (packaged .exe) | 1.0.0-mock |

## Architecture

### System Layers

```
┌─────────────────────────────────────────────┐
│  Frontend  bsmart (React + Vite, :5173)     │
│  ┌─────────────────────────────────────────┐│
│  │  SplashScreen → Main Layout             ││
│  │  Sidebar │ TopBar │ ChatView / HomeView  ││
│  └─────────────────────────────────────────┘│
│            REST + WebSocket proxy           │
└──────────────────┬──────────────────────────┘
                   │ localhost:8081
┌──────────────────▼──────────────────────────┐
│  AISSD_MockServer (FastAPI, .exe)           │
│  /api/* (REST)   /ws/* (WebSocket)          │
└─────────────────────────────────────────────┘
```

### Directory Structure

```
SSD/
├── bsmart/                  # React 前端
│   ├── src/
│   │   ├── components/      # UI 元件（chat/home/layout/mode/model/settings/splash）
│   │   ├── hooks/           # useChat（WS + REST）, useClickOutside
│   │   ├── constants/       # models.ts（三個 LLM 定義）
│   │   └── types/           # Model, Mode, Message, Chat 介面
│   └── vite.config.ts       # Proxy: /api → :8081, /ws → ws://:8081
├── AISSD_MockServer/        # FastAPI Mock Server（已封裝為 .exe）
├── API_REFERENCE.md         # REST + WebSocket API 文件
└── .github/
    └── copilot-instructions.md
```

## Quick Start

```bash
# 1. 啟動 Mock Server
cd AISSD_MockServer
.\AISSD_MockServer.exe
# → http://localhost:8081

# 2. 啟動前端（另開終端）
cd bsmart
npm install
npm run dev
# → http://localhost:5173
```

## Key Conventions

1. 所有 API 呼叫透過 Vite proxy（`/api`, `/ws`），不寫死 `localhost:8081`
2. 後端失敗靜默降級 — `.catch(() => {})` 保持前端可用
3. TypeScript strict mode — 禁止 `any`，型別定義集中於 `src/types/`
4. 元件以功能模組分目錄（`components/<domain>/`）
5. WebSocket 連線由 `useChat` hook 統一管理，不在元件層持有 ref

> 詳細規範見 [.github/copilot-instructions.md](.github/copilot-instructions.md)

## References

- [API Reference](API_REFERENCE.md)
- [Copilot Instructions](.github/copilot-instructions.md)
- [Agent Behavior Boundaries](AGENTS.md)