# AI SSD Mock Backend — API 參考文件

> **版本**: 1.0.0-mock  
> **Base URL**: `http://localhost:8081`  
> **Swagger UI (互動測試)**: `http://localhost:8081/docs`  
> **ReDoc**: `http://localhost:8081/redoc`  
> **最後驗證**: 2026-04-07  
> **前端串接狀態更新**: 2026-04-07

---

## 快速啟動

```bash
# 啟動 Mock Server（直接執行打包好的可執行檔）
cd "d:\SSD\AISSD_MockServer"
.\AISSD_MockServer.exe
# → 伺服器啟動於 http://localhost:8081

# 啟動前端開發伺服器（另開終端）
cd "d:\SSD\bsmart"
npm run dev
# → 前端啟動於 http://localhost:5173（Vite 預設）
```

---

## API 總覽

| # | Method   | 路徑                          | 分類     | 說明                          | 前端串接 |
|---|----------|-------------------------------|----------|-------------------------------|----------|
| 1 | `GET`    | `/api/status`                 | 系統狀態 | 取得整體系統狀態              | ⏳ 待實作 |
| 2 | `WS`     | `/ws/boot`                    | 系統狀態 | 開機載入進度 WebSocket 推送   | ✅ 已完成 |
| 3 | `GET`    | `/api/modes`                  | 對話模式 | 取得全部四種對話模式清單      | ⏳ 待實作 |
| 4 | `POST`   | `/api/mode/select`            | 對話模式 | 選擇對話模式，回傳建議項目    | ⏳ 待實作 |
| 5 | `GET`    | `/api/mode/suggestions`       | 對話模式 | 取得當前模式的建議輸入清單    | ⏳ 待實作 |
| 6 | `GET`    | `/api/models`                 | 模型選擇 | 取得三個可用模型清單          | ⏳ 待實作 |
| 7 | `POST`   | `/api/models/select`          | 模型選擇 | 切換當前使用的模型            | ⏳ 待實作 |
| 8 | `POST`   | `/api/chat`                   | 對話     | 傳送訊息，取得 LLM 模擬回覆  | ⏳ 待實作 |
| 9 | `WS`     | `/ws/chat`                    | 對話     | Streaming 逐字 token 輸出    | ⏳ 待實作 |
| 10| `GET`    | `/api/history`                | 對話紀錄 | 取得所有 Session 摘要列表     | ⏳ 待實作 |
| 11| `GET`    | `/api/history/{session_id}`   | 對話紀錄 | 取得特定 Session 完整對話紀錄 | ⏳ 待實作 |
| 12| `DELETE` | `/api/history/{session_id}`   | 對話紀錄 | 刪除特定 Session 的紀錄       | ⏳ 待實作 |
| 13| `DELETE` | `/api/history`                | 對話紀錄 | 清除全部對話紀錄              | ⏳ 待實作 |
| 14| `GET`    | `/api/files/search`           | 工具     | 語意搜尋檔案（模擬 tools.py） | ⏳ 待實作 |
| 15| `POST`   | `/api/database/query`         | 工具     | 執行 SQL 查詢（回傳假資料）   | ⏳ 待實作 |
| 16| `POST`   | `/api/shutdown`               | 系統     | 模擬關閉指令                  | ⏳ 待實作 |

---

## 前端串接進度

### 已完成

| 項目 | 說明 | 相關檔案 |
|------|------|----------|
| `WS /ws/boot` | SplashScreen 串接開機 WebSocket，接收 `value`/`message`/`done`；`ws.onerror` 自動降回本地 interval 模擬 | `bsmart/src/components/splash/SplashScreen.tsx` |
| Vite proxy | `/api` → `http://localhost:8081`；`/ws` → `ws://localhost:8081`（`ws: true`） | `bsmart/vite.config.ts` |
| 模式 key 對齊 | `import`→`search`、`restore`→`manage`，與 API 定義一致 | `bsmart/src/constants/modes.ts` |
| 模型 ID 對齊 | `llama-3.1-8B`、`Qwen2.5-14B-Instruct`、`Mistral-Small-24B-Instruct` | `bsmart/src/constants/models.ts` |

### 待實作（依優先順序）

| 優先 | API | 對應前端位置 | 備註 |
|------|-----|-------------|------|
| 🔴 高 | `POST /api/chat` 或 `WS /ws/chat` | `bsmart/src/hooks/useChat.ts` `sendMessage()` | 目前為 `setTimeout` 假回覆，為核心功能 |
| 🔴 高 | `POST /api/mode/select` | `bsmart/src/components/mode/ModeMenu.tsx` `onSelect` | 選模式後需通知後端並取得 `suggestions` |
| 🟡 中 | `GET /api/status` | `bsmart/src/App.tsx` splash → main 切換後 | 確認後端 `agent: ready` 再顯示主畫面 |
| 🟡 中 | `POST /api/models/select` | `bsmart/src/components/model/ModelSelector.tsx` `onSelect` | 切換模型需同步後端 |
| 🟡 中 | `GET /api/history` | `bsmart/src/hooks/useChat.ts` + Sidebar | 初始化載入歷史 session 列表 |
| 🟡 中 | `GET /api/history/{session_id}` | `bsmart/src/hooks/useChat.ts` `selectChat()` | 點選歷史對話時從後端載入完整訊息 |
| 🟢 低 | `GET /api/modes` | `bsmart/src/constants/modes.ts` | 目前硬編碼，可改為動態載入 |
| 🟢 低 | `GET /api/models` | `bsmart/src/constants/models.ts` | 目前硬編碼，可改為動態載入 |
| 🟢 低 | `GET /api/mode/suggestions` | `bsmart/src/components/chat/ChatInput.tsx` | 顯示建議輸入清單 |
| 🟢 低 | `DELETE /api/history/{session_id}` | 待新增刪除按鈕 | — |
| 🟢 低 | `DELETE /api/history` | 待新增清除全部按鈕 | — |
| ⚪ 選用 | `GET /api/files/search` | 搜尋模式結果展示 | — |
| ⚪ 選用 | `POST /api/database/query` | 工具面板 | — |
| ⚪ 選用 | `POST /api/shutdown` | 設定頁關機按鈕 | — |

---

## 1. 系統狀態

### `GET /api/status`

取得整體系統狀態，包含 llama-server、agent、開機進度、選定模型與對話模式。

**回傳範例**
```json
{
  "llama": "running",
  "agent": "ready",
  "boot": {
    "value": 1.0,
    "message": "✅ AI SSD 已就緒。",
    "done": true,
    "error": null
  },
  "model": {
    "id": "llama-3.1-8B",
    "name": "Llama 3.1 8B",
    "status": "loaded"
  },
  "mode": "search"
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| `llama` | string | `"loading"` / `"running"` |
| `agent` | string | `"initializing"` / `"ready"` |
| `boot.value` | float | 0.0 ~ 1.0 載入進度 |
| `boot.done` | bool | `true` 表示 LLM 載入完成 |
| `boot.error` | string\|null | 錯誤訊息，正常為 `null` |

---

## 2. 開機進度 WebSocket

### `WS /ws/boot`

開機時連線，伺服器會持續推送 `boot_state`，直到 `done: true`。
與 `ssd/main.py` 的介面**完全相同**，前端可直接切換使用。

**訊息格式（Server → Client）**
```json
{ "value": 0.45, "message": "正在喚醒 AI SSD 大腦權重...", "done": false, "error": null }
```

**開機 8 個階段**

| 進度 | 訊息 |
|------|------|
| 0% | 準備啟動中... |
| 5% | 正在喚醒 llama-server... |
| 20% | 正在讀取模型權重... |
| 45% | 正在喚醒 AI SSD 大腦權重... |
| 70% | 初始化 KV 記憶體快取... |
| 82% | 暖機中，請稍候... |
| 88% | 初始化推論槽位... |
| 95% | 大腦已就緒！同步神經網路... |
| 100% | ✅ AI SSD 已就緒。（`done: true`） |

---

## 3. 對話模式

### `GET /api/modes`

取得全部四種對話模式的說明。

**回傳範例**
```json
{
  "modes": [
    { "id": "scan",   "name": "掃描模式", "description": "掃描 SSD 上的所有檔案並建立索引", "icon": "🔍" },
    { "id": "search", "name": "搜尋模式", "description": "語意搜尋 SSD 上的檔案與內容",     "icon": "🔎" },
    { "id": "manage", "name": "管理模式", "description": "整理、重新命名或移動 SSD 上的檔案","icon": "🗂️" },
    { "id": "sync",   "name": "同步模式", "description": "同步、備份或比較 SSD 資料夾",     "icon": "🔄" }
  ]
}
```

---

### `POST /api/mode/select`

選擇對話模式，回傳對應的建議項目與快速動作按鈕。

**請求 Body**
```json
{ "mode": "search" }
```

> `mode` 可選值: `scan` | `search` | `manage` | `sync`

**回傳範例**
```json
{
  "status": "ok",
  "selected": "search",
  "name": "搜尋模式",
  "description": "語意搜尋 SSD 上的檔案與內容",
  "suggestions": [
    "找去年簽的合約",
    "搜尋包含『預算』的報告",
    "找 2024 年的照片",
    "搜尋 Python 相關筆記",
    "找最近修改的文件"
  ],
  "quick_actions": [
    { "id": "search_recent",  "label": "最近文件", "icon": "🕒" },
    { "id": "search_docs",    "label": "文件搜尋", "icon": "📋" },
    { "id": "search_images",  "label": "圖片搜尋", "icon": "🖼️" },
    { "id": "search_video",   "label": "影片搜尋", "icon": "🎥" }
  ]
}
```

---

### `GET /api/mode/suggestions`

取得目前選定模式的建議輸入與快速動作（不重新選擇模式）。

**回傳範例**
```json
{
  "mode": "search",
  "suggestions": ["找去年簽的合約", "..."],
  "quick_actions": [{ "id": "search_recent", "label": "最近文件", "icon": "🕒" }]
}
```

---

## 4. 模型選擇

### `GET /api/models`

取得三個可用模型的完整資訊與當前選定模型。

**回傳範例**
```json
{
  "models": [
    {
      "id": "llama-3.1-8B",
      "name": "Llama 3.1 8B",
      "description": "Meta 開源模型，適合一般對話與文件摘要",
      "size": "4.7 GB",
      "speed": "44 tokens/s",
      "context": "4096",
      "language": "中英文",
      "status": "available"
    },
    {
      "id": "Qwen2.5-14B-Instruct",
      "name": "Qwen 2.5 14B Instruct",
      "description": "阿里巴巴 Qwen2.5，中文能力強，適合中文文件處理",
      "size": "8.9 GB",
      "speed": "22 tokens/s",
      "context": "8192",
      "language": "中文優先",
      "status": "available"
    },
    {
      "id": "Mistral-Small-24B-Instruct",
      "name": "Mistral Small 24B Instruct",
      "description": "Mistral 中型模型，平衡速度與品質，推理能力強",
      "size": "14.3 GB",
      "speed": "14 tokens/s",
      "context": "32768",
      "language": "多語言",
      "status": "available"
    }
  ],
  "current": { "id": "llama-3.1-8B", "name": "Llama 3.1 8B", "status": "loaded" }
}
```

---

### `POST /api/models/select`

切換當前使用的模型（模擬切換，無實際載入）。

**請求 Body**
```json
{ "model_id": "Qwen2.5-14B-Instruct" }
```

> `model_id` 可選值: `llama-3.1-8B` | `Qwen2.5-14B-Instruct` | `Mistral-Small-24B-Instruct`

**回傳範例**
```json
{
  "status": "ok",
  "message": "✅ 已切換至 Qwen 2.5 14B Instruct",
  "model": { "id": "Qwen2.5-14B-Instruct", "name": "Qwen 2.5 14B Instruct", "status": "loaded" }
}
```

---

## 5. 對話 (Chat)

### `POST /api/chat`

四種模式的統一對話入口。所有輸入皆回傳模擬的 LLM 假回覆。

**請求 Body**
```json
{
  "message": "幫我找去年的合約",
  "mode": "search",
  "session_id": "my_session_01",
  "model_id": "llama-3.1-8B"
}
```

| 欄位 | 必填 | 說明 |
|------|------|------|
| `message` | ✅ | 使用者輸入的訊息 |
| `mode` | ❌ | 對話模式，不傳則使用全局選定模式 |
| `session_id` | ❌ | Session ID，用於分組紀錄，預設為 `{mode}_001` |
| `model_id` | ❌ | 指定模型，不傳則使用全局選定模型 |

**回傳範例**
```json
{
  "response": "LLM回復：🔎 找到 5 個相關結果：\n  1. 合約書_2024_Q1.pdf (98% 相似)\n  2. 合約草稿_v3.docx (87% 相似)",
  "mode": "search",
  "model": "llama-3.1-8B",
  "session_id": "search_001",
  "timestamp": "2026-04-07T10:00:00"
}
```

**各模式模擬回覆範例**

| 模式 | 範例回覆 |
|------|---------|
| `scan` | 掃描完成！已索引 1,247 個檔案，新增 23 個... |
| `search` | 找到 5 個相關結果：1. 合約書_2024_Q1.pdf... |
| `manage` | 已將桌面 15 個文件移至 D:/Documents/桌面整理/... |
| `sync` | 同步完成！新增 12 個，更新 3 個，刪除 0 個... |

---

### `WS /ws/chat`

Streaming 對話，模擬逐字 token 輸出（類似 ChatGPT 打字效果）。

**上行訊息（Client → Server）**
```json
{ "message": "整理桌面文件", "mode": "manage" }
```

**下行訊息（Server → Client，逐 token 推送）**
```json
{ "token": "L", "done": false }
{ "token": "L", "done": false }
{ "token": "M", "done": false }
...
{
  "token": "",
  "done": true,
  "mode": "manage",
  "model": "llama-3.1-8B",
  "timestamp": "2026-04-07T10:00:00"
}
```

> `done: true` 表示該輪回覆完整輸出完畢，可繼續送下一則訊息。

---

## 6. 對話紀錄

### `GET /api/history`

取得所有 Session 的摘要清單（按時間降序）。

**回傳範例**
```json
{
  "sessions": [
    {
      "session_id": "search_001",
      "mode": "search",
      "message_count": 4,
      "preview": "幫我找去年的合約",
      "last_timestamp": "2026-04-06T10:02:00",
      "model": "llama-3.1-8B"
    }
  ],
  "total": 4
}
```

---

### `GET /api/history/{session_id}`

取得指定 Session 的完整對話訊息列表。

**預設 Session ID**

| session_id | 對應模式 |
|------------|--------|
| `scan_001` | 掃描模式 |
| `search_001` | 搜尋模式 |
| `manage_001` | 管理模式 |
| `sync_001` | 同步模式 |

**回傳範例**
```json
{
  "session_id": "search_001",
  "messages": [
    { "role": "user",      "content": "幫我找去年的合約", "timestamp": "2026-04-06T10:00:00", "mode": "search" },
    { "role": "assistant", "content": "LLM回復：找到 5 個相關結果...", "timestamp": "2026-04-06T10:00:00", "model": "llama-3.1-8B" }
  ],
  "count": 2
}
```

---

### `DELETE /api/history/{session_id}`

清除指定 Session 的所有訊息（保留 session_id，訊息清空）。

**回傳範例**
```json
{ "status": "ok", "message": "Session search_001 已清除" }
```

---

### `DELETE /api/history`

清除**所有** Session 的對話紀錄。

**回傳範例**
```json
{ "status": "ok", "message": "所有對話紀錄已清除" }
```

---

## 7. 工具 API（模擬 tools.py）

### `GET /api/files/search`

語意搜尋檔案，以 `pattern` 篩選假資料集（8 筆預設檔案）。

**Query 參數**

| 參數 | 必填 | 預設 | 說明 |
|------|------|------|------|
| `pattern` | ❌ | `""` | 搜尋關鍵字（檔名 / 路徑含此字串即回傳） |
| `limit` | ❌ | `10` | 最多回傳筆數 |

**範例**
```
GET /api/files/search?pattern=合約&limit=5
```

**回傳範例**
```json
{
  "status": "success",
  "files": [
    {
      "path": "D:/Documents/合約書_2024_Q1.pdf",
      "name": "合約書_2024_Q1.pdf",
      "size": 245760,
      "modified": "2024-01-15"
    },
    {
      "path": "D:/Documents/合約草稿_v3.docx",
      "name": "合約草稿_v3.docx",
      "size": 102400,
      "modified": "2024-02-20"
    }
  ],
  "count": 2,
  "total": 2
}
```

---

### `POST /api/database/query`

模擬 SQLite 查詢，固定回傳假資料（不執行真實 SQL）。

**請求 Body**
```json
{ "sql": "SELECT * FROM files WHERE filename LIKE '%合約%'" }
```

**回傳範例**
```json
{
  "status": "success",
  "sql": "SELECT * FROM files WHERE filename LIKE '%合約%'",
  "results": [
    ["D:/Documents/合約書_2024_Q1.pdf", "合約書_2024_Q1.pdf", 245760, "2024-01-15"],
    ["D:/Documents/合約草稿_v3.docx",    "合約草稿_v3.docx",   102400, "2024-02-20"]
  ],
  "count": 2,
  "mock": true
}
```

---

## 8. 關閉系統

### `POST /api/shutdown`

模擬關閉指令。Mock Server **不會**真的終止，方便前端持續開發。

**回傳範例**
```json
{ "status": "shutting down", "mock": true }
```

---

## 與真實後端的差異

| 功能 | Mock Backend | 真實後端（ssd/main.py） |
|------|-------------|------------------------|
| LLM 推論 | 隨機假資料 | llama.cpp 推論 |
| 開機流程 | 定時模擬（~10 秒） | 讀取 llama_boot.log |
| 檔案索引 | 8 筆硬編碼假資料 | SQLite + FAISS 向量搜尋 |
| RAG | 不實作 | SentenceTransformer + FAISS |
| 關閉服務 | 不終止程序（`mock: true`） | `os._exit(0)` |
| 前端靜態服務 | 不提供（由 Vite dev server 代理） | 服務 `frontend/dist/` |
| 依賴 | `fastapi` + `uvicorn` | `fastapi` + `smolagents` + `llama.cpp` |

> **API 介面（路徑、請求格式、回傳欄位名稱）完全與真實後端一致**，前端無需修改即可切換。
