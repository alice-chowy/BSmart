# MVP 規格 - bsmart 前端介面

> **目標：** 完成 bsmart AI SSD 對話介面前端，串接 Mock 後端所有 API  
> **建立日期：** 2026-04-10  
> **最後更新：** 2026-04-20  
> **版本：** Sprint 3 完成（API 全串接 + 功能驗證）

---

## 1. 專案概述（What & Why）

**一句話描述：** bsmart 是 AI SSD 備份助手的前端原型，使用者透過自然語言對話與 SSD 裝置互動，執行掃描、搜尋、管理、同步等操作。

**目標用戶：** 一般使用者（不熟悉技術），需要清楚可讀的 UI 與流暢的 AI 對話體驗。

**技術棧：** Vite 8 + React 19 + TypeScript + Tailwind CSS v4 + react-markdown

---

## 2. 已完成功能（Sprint 1～3）

### 2.1 SplashScreen（開機載入畫面）
| 項目 | 說明 |
|------|------|
| 啟動方式 | WS `/ws/boot` 推送進度（0.0 → 1.0）與狀態訊息；WS 斷線自動每秒 retry |
| 顯示內容 | LOGO、進度條、`tier_line1` / `tier_line2`（裝置規格描述）、boot 訊息 |
| 錯誤處理 | 若 `boot.error` 非 null，顯示紅色錯誤框（不進主畫面） |
| 跳轉條件 | `boot.done === true` 時自動進入主畫面，同時呼叫 `GET /api/status` 取得 `tier`，自動套用對應模型 |

### 2.2 主畫面佈局（App.tsx）
| 項目 | 說明 |
|------|------|
| 左欄 | Sidebar（可展開/收合） |
| 主區 | `activeChatId` 為 null → HomeView；有值 → ChatView |
| 頂欄 | TopBar（模型選擇 + 設定按鈕） |
| Toast | 切換模型時底部顯示確認 toast（2500ms 自動消失） |
| SettingsModal | 3 個分頁：一般 / 資料 / 個人化（模型選擇已移至 TopBar，不在 Modal 內） |
| DisconnectedScreen | 關機後顯示「BSMART 已關閉」靜態畫面（含 logo）；離開頁面前有 `beforeunload` 提示 |

### 2.3 HomeView（首頁）
| 項目 | 說明 |
|------|------|
| 歡迎語 | 動態顯示 `你好，備份助手已上線` |
| 模式描述 | 選擇模式後顯示 `modeDescription`（從 `POST /api/mode/select` 取得） |
| DeviceBridge | 中央 SSD ↔ 電腦連接示意（含裝置名稱） |
| ModeMenu | 4 個模式磁貼（圖示 + 標籤）：掃描、搜尋、管理、同步 |

### 2.4 Sidebar（左側欄）
| 項目 | 說明 |
|------|------|
| 歷史載入 | 啟動時呼叫 `GET /api/history`，填入 session 列表 |
| 每個項目 | 顯示標題、訊息數、最後時間（`lastTimestamp`）、模型名稱 |
| 點選載入 | 點擊歷史項目 → `GET /api/history/{session_id}` 載入完整訊息 |
| 連線狀態 | 頂部顯示 llama / agent 狀態指示燈（綠 / 灰） |
| 刪除對話 | 每個項目 hover 顯示刪除按鈕，呼叫 `DELETE /api/history/{session_id}` |
| 新對話 | 按鈕呼叫 `newChat()`，清除 activeChatId 與 modeDescription |

### 2.5 ChatView + ChatMessage（對話畫面）
| 項目 | 說明 |
|------|------|
| 訊息傳送 | 透過 WS `/ws/chat` streaming；WS 失敗時 fallback 至 `POST /api/chat` |
| 最短動畫 | Loading 動畫至少顯示 3 秒（`MIN_LOADING_MS = 3000`） |
| Markdown | 助手回覆以 `react-markdown` 渲染 |
| 時間戳記 | **只在載入歷史訊息時顯示**（後端 `ApiMessage.timestamp` 有值才出現）；新對話訊息無時間戳 |
| 氣泡寬度 | 使用者：`max-w-[60%]`；助手：`max-w-[75%]` |
| Quick Actions | 選模式後顯示快捷按鈕（來自 `POST /api/mode/select` 回傳的 `quick_actions`） |

### 2.6 ChatInput（輸入框）
| 項目 | 說明 |
|------|------|
| 模式圖示 | 顯示目前選擇的模式圖示 |
| 發送 | Enter 送出，Shift+Enter 換行 |
| 模式切換 | 點擊圖示可呼叫 ModeMenu 切換 |

### 2.7 TopBar（頂部導覽列）
| 項目 | 說明 |
|------|------|
| 模型選擇 | 下拉選單切換模型，選後呼叫 `POST /api/models/select` 並顯示 toast |
| 設定 | 開啟 SettingsModal |

### 2.8 useChat（核心狀態管理）
| 項目 | 說明 |
|------|------|
| WS 管理 | 建立 / 關閉 WebSocket，每次 sendMessage 重建 |
| sessionMap | `Map<chatId, session_id>`，與後端保持對應 |
| history | 啟動載入 + 點選時 lazy-load |
| CRUD | `newChat` / `selectChat` / `renameChat` / `deleteChat` / `clearAllChats` |
| shutdown | `POST /api/shutdown` |

---

## 3. 型別架構（`src/types/index.ts`）

```ts
Message   { role, content, timestamp? }
Chat      { id, title, messages, messageCount?, lastTimestamp?, model? }
Mode      { key, number, label, icon?, iconSize? }
Model     { id, name, desc }
QuickAction { id, label, icon }
```

---

## 4. 重要設計決策

| 決策 | 說明 |
|------|------|
| Logo 位置 | 在 `../logo/`（bsmart 外），透過 `@logo` vite alias 引用 |
| 模式靜態 | `constants/modes.ts` hardcode，尚未接 `GET /api/modes` 動態 API |
| 模型靜態 | `constants/models.ts` hardcode，尚未接 `GET /api/models` 動態 API；Splash 完成後從 `GET /api/status` 的 `tier` 欄位自動套用推薦模型 |
| Proxy | Vite dev server 代理 `/api` 與 `/ws` 至 `http://localhost:8081` |
| WS proxy target | `http://localhost:8081`（非 `ws://`），配合 vite-plugin-proxy 機制 |

---

## 5. 待辦 / 後續 Sprint

| 優先 | 項目 | 說明 |
|------|------|------|
| 🟡 中 | 模式動態載入 | `GET /api/modes` 取代 `constants/modes.ts` |
| 🟡 中 | 模型動態載入 | `GET /api/models` 取代 `constants/models.ts` |
| ✅ 完成 | SettingsModal 接功能 | `clearAllChats` / `shutdown` 按鈕已接 hook（`onClearAllChats` / `onShutdown`） |
| ⚠️ UI mockup | SettingsModal 其他設定 | 語言、效能、RAG清除、備份策略等 UI 控制尚無後端串接 |
| ⚪ 選用 | 訊息時間戳（新對話） | sendMessage 時加入 `timestamp: new Date().toISOString()` |
| ⚪ 選用 | 搜尋模式結果展示 | `GET /api/files/search` |

---

*文件由 mvp-require v1.2.1 建立，context-auditor + 人工維護更新至 Sprint 3*
