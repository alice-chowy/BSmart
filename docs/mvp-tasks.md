# MVP Tasks — bsmart 前端介面

> **關聯規格：** [docs/mvp-spec.md](mvp-spec.md)  
> **最後更新：** 2026-05-06  
> **狀態：** Sprint 3 完成，待規劃 Sprint 4

---

## 已完成任務（Sprint 1–3）

> 從 mvp-spec.md 逆推，記錄各 Sprint 完成的可驗證任務單元。

### Sprint 1：核心畫面與對話基礎

| # | 任務 | 元件 / 檔案 | 狀態 |
|:--|:-----|:-----------|:----:|
| S1-01 | SplashScreen：WS `/ws/boot` 推送進度條 | `splash/` | ✅ |
| S1-02 | SplashScreen：boot 完成後自動跳轉主畫面 | `splash/` | ✅ |
| S1-03 | SplashScreen：`boot.error` 顯示紅色錯誤框 | `splash/` | ✅ |
| S1-04 | 主畫面佈局：Sidebar + TopBar + 主區（HomeView / ChatView） | `App.tsx` | ✅ |
| S1-05 | HomeView：ModeMenu 四個模式磁貼 | `home/` | ✅ |
| S1-06 | ChatView：送訊息 + 接收助手回覆（REST fallback） | `chat/` | ✅ |
| S1-07 | ChatMessage：Markdown 渲染（react-markdown） | `chat/ChatMessage.tsx` | ✅ |

### Sprint 2：WebSocket + 歷史管理

| # | 任務 | 元件 / 檔案 | 狀態 |
|:--|:-----|:-----------|:----:|
| S2-01 | WS `/ws/chat` streaming，失敗 fallback 至 POST | `hooks/useChat.ts` | ✅ |
| S2-02 | Loading 動畫最短顯示 3 秒（MIN_LOADING_MS） | `hooks/useChat.ts` | ✅ |
| S2-03 | Sidebar：`GET /api/history` 載入歷史列表 | `layout/Sidebar` | ✅ |
| S2-04 | Sidebar：點選歷史 `GET /api/history/{id}` lazy-load | `hooks/useChat.ts` | ✅ |
| S2-05 | Sidebar：刪除對話 `DELETE /api/history/{id}` | `hooks/useChat.ts` | ✅ |
| S2-06 | Sidebar：新對話按鈕（清除 activeChatId） | `hooks/useChat.ts` | ✅ |
| S2-07 | ChatMessage：歷史訊息顯示時間戳記（新對話不顯示） | `chat/ChatMessage.tsx` | ✅ |
| S2-08 | Sidebar：llama / agent 狀態指示燈 | `layout/Sidebar` | ✅ |

### Sprint 3：API 全串接 + 功能驗證

| # | 任務 | 元件 / 檔案 | 狀態 |
|:--|:-----|:-----------|:----:|
| S3-01 | TopBar：模型下拉選單 + `POST /api/models/select` | `layout/TopBar` | ✅ |
| S3-02 | 切換模型顯示 Toast（2500ms 自動消失） | `App.tsx` | ✅ |
| S3-03 | Splash 完成後 `GET /api/status` 取 tier，自動套用推薦模型 | `hooks/useChat.ts` | ✅ |
| S3-04 | 模式切換：`POST /api/mode/select` 取得 modeDescription + quick_actions | `hooks/useChat.ts` | ✅ |
| S3-05 | HomeView：顯示 modeDescription | `home/HomeView` | ✅ |
| S3-06 | ChatView：顯示 Quick Actions 按鈕 | `chat/ChatView` | ✅ |
| S3-07 | SettingsModal：3 分頁（一般 / 資料 / 個人化） | `settings/` | ✅ |
| S3-08 | SettingsModal：`clearAllChats` / `POST /api/shutdown` | `hooks/useChat.ts` | ✅ |
| S3-09 | DisconnectedScreen：關機後靜態畫面 + beforeunload 提示 | `App.tsx` | ✅ |
| S3-10 | HomeView：DeviceBridge SSD ↔ 電腦連接示意 | `home/` | ✅ |
| S3-11 | ChatInput：Enter 送出 / Shift+Enter 換行 / 模式圖示 | `chat/ChatInput` | ✅ |
| S3-12 | WS 斷線自動每秒 retry（SplashScreen） | `splash/` | ✅ |

---

## 技術債

| # | 項目 | 影響範圍 | 優先級 |
|:--|:-----|:---------|:------:|
| TD-01 | **模式靜態 hardcode** — `constants/modes.ts` 尚未接 `GET /api/modes` | 新增模式需改程式碼 | 🟡 中 |
| TD-02 | **模型靜態 hardcode** — `constants/models.ts` 尚未接 `GET /api/models` | 新增模型需改程式碼 | 🟡 中 |
| TD-03 | **無自動化測試框架** — 核心路徑依賴手動驗證 | PR Gate 效率低 | 🟡 中 |
| TD-04 | **SettingsModal 其他設定 UI mockup** — 語言、效能、RAG清除、備份策略尚無後端串接 | 功能無法運作 | 🟢 低 |
| TD-05 | **新對話訊息無時間戳** — sendMessage 時未加 `timestamp` | 歷史 / 新對話顯示不一致 | ⚪ 選用 |
| TD-06 | **搜尋模式結果展示** — `GET /api/files/search` 尚未實作前端 UI | search 模式功能不完整 | ⚪ 選用 |

---

## Sprint 4 待辦（未排程）

> 以下項目為 mvp-spec.md Section 5 待辦，尚未正式排入 Sprint。
> 排程前請評估優先級與依賴關係。

| # | 任務 | 依賴 | 優先級 |
|:--|:-----|:-----|:------:|
| S4-01 | 模式動態載入：`GET /api/modes` 取代 `constants/modes.ts` | 後端 API 確認 | 🟡 中 |
| S4-02 | 模型動態載入：`GET /api/models` 取代 `constants/models.ts` | 後端 API 確認 | 🟡 中 |
| S4-03 | 搜尋結果 UI：接 `GET /api/files/search` 展示結果列表 | S4-01（search 模式） | ⚪ 選用 |
| S4-04 | 引入測試框架（Vitest + Testing Library） | — | 🟢 低 |
| S4-05 | SettingsModal 語言 / 效能 / 備份策略接後端 | 後端 API 確認 | 🟢 低 |
| S4-06 | 新對話訊息加入 timestamp | — | ⚪ 選用 |

---

## 驗收條件（每個 Task 完成標準）

完成任何功能任務前，必須通過以下核心路徑驗證：

```
SplashScreen 開機
  → Boot WS 推送進度到 100%
  → 進入主畫面
  → 選擇對話模式
  → 在 ChatView 送出訊息
  → 收到 AI 串流回覆
```

API 串接任務額外需驗證：
- AISSD_MockServer 已啟動（`localhost:8081`）
- Network tab 確認 Request / Response 格式正確
- TypeScript strict mode 無錯誤（`npx tsc --noEmit`）
- ESLint 無 error（`npm run lint`）
