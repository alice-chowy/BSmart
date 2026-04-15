# BSMART Mock Backend — API 參考文件

> **版本**: 2.0.0-mock  
> **Base URL**: `http://localhost:8081`  
> **Swagger UI (互動測試)**: `http://localhost:8081/docs`  
> **最後更新**: 2026-04-15

---

## 快速啟動

```bash
cd "d:\AI SSD\mock_backend"

# 安裝依賴（僅需 FastAPI + uvicorn）
pip install -r requirements.txt

# 啟動（hot-reload 模式，前端開發推薦）
uvicorn main_mock:app --host 0.0.0.0 --port 8081 --reload
```

前端 dev server (Vite :5173) 設定代理至 `:8081` 即可直接使用。

---

## API 總覽

| # | Method   | 路徑                        | 說明                              |
|---|----------|-----------------------------|-----------------------------------|
| 1 | `GET`    | `/api/status`               | 系統狀態（llama / agent / boot / hardware） |
| 2 | `WS`     | `/ws/boot`                  | 開機載入進度三行版推送             |
| 3 | `POST`   | `/api/mode/select`          | 選擇對話模式，回傳 suggestions    |
| 4 | `POST`   | `/api/models/select`        | 切換模型                          |
| 5 | `POST`   | `/api/chat`                 | 同步聊天（備援用）                 |
| 6 | `WS`     | `/ws/chat`                  | Streaming 逐 token 輸出           |
| 7 | `GET`    | `/api/history`              | 所有 Session 摘要列表             |
| 8 | `GET`    | `/api/history/{session_id}` | 特定 Session 完整對話             |
| 9 | `DELETE` | `/api/history/{session_id}` | 刪除特定 Session                  |
| 10| `DELETE` | `/api/history`              | 清除全部紀錄                      |
| 11| `POST`   | `/api/shutdown`             | 關閉指令（mock 不終止程序）        |

---

## 1. 系統狀態

### `GET /api/status`

**回傳範例**
```json
{
  "llama":   "running",
  "agent":   "ready",
  "boot": {
    "value":    1.0,
    "message":  "✅ BSMART 已就緒。",
    "tier_line1": "BSMART智慧啟動平衡模式：當前設備支援高效能推理引擎",
    "tier_line2": "預計響應速度：快速",
    "done":  true,
    "error": null
  },
  "hardware": {
    "source":   "gpu",
    "name":     "NVIDIA GeForce RTX 4070 Laptop GPU",
    "total_mb": 8187,
    "free_mb":  6944
  },
  "tier":  "Standard",
  "model": "Gemma 4 4B (Standard — VRAM ≤ 8 GB)"
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| `llama` | string | `"loading"` / `"running"` / `"stopped"` |
| `agent` | string | `"initializing"` / `"ready"` |
| `boot.value` | float | 0.0 ~ 1.0 |
| `boot.message` | string | 當前 stage 進度訊息（隨載入變化） |
| `boot.tier_line1` | string | 模式描述（決定後固定） |
| `boot.tier_line2` | string | 預計速度（決定後固定） |
| `boot.done` | bool | `true` = LLM 就緒 |
| `tier` | string | `Ultra` / `Advance` / `Standard` / `Lite` |

---

## 2. 開機進度 WebSocket

### `WS /ws/boot`

伺服器每 0.8 秒推送一次 `boot_state`，直到 `done: true`。

**訊息格式（Server → Client）**
```json
{
  "value":    0.45,
  "message":  "正在喚醒 BSMART 大腦權重...",
  "tier_line1": "BSMART智慧啟動平衡模式：當前設備支援高效能推理引擎",
  "tier_line2": "預計響應速度：快速",
  "done":  false,
  "error": null
}
```

> **前端三行顯示規則**：
> - 第一行：`message`（隨載入改變）
> - 第二行：`tier_line1`（決定後固定）
> - 第三行：`tier_line2`（決定後固定）

**開機階段列表（與 ssd/main.py 對齊）**

| 進度 | 訊息 |
|------|------|
| 2% | 🔍 偵測硬體資源... |
| 4% | 📊 等級：Standard — Gemma 4 4B |
| 5% | 正在喚醒 llama-server... |
| 20% | 正在讀取模型權重... |
| 45% | 正在喚醒 BSMART 大腦權重... |
| 65% | 初始化 KV 記憶體快取... |
| 80% | 暖機中，請稍候... |
| 88% | 初始化推論槽位... |
| 93% | 模型載入完成，同步神經網路... |
| 95% | 大腦已就緒！ |
| 100% | ✅ BSMART 已就緒。（`done: true`） |

---

## 3. 對話模式選擇

### `POST /api/mode/select`

**請求 Body**
```json
{ "mode": "search" }
```

> `mode` 可選值：`scan` | `search` | `manage` | `sync`

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
    { "id": "search_recent", "label": "最近文件", "icon": "🕒" },
    { "id": "search_docs",   "label": "文件搜尋", "icon": "📋" },
    { "id": "search_images", "label": "圖片搜尋", "icon": "🖼️" },
    { "id": "search_video",  "label": "影片搜尋", "icon": "🎥" }
  ]
}
```

---

## 4. 模型選擇

### `POST /api/models/select`

**請求 Body**
```json
{ "model_id": "Gemma-4-Standard" }
```

> `model_id` 可選值（對應真實後端 tier）：

| model_id | 對應 tier | 說明 |
|----------|-----------|------|
| `Gemma-4-Ultra` | Ultra | Gemma 4 26B，VRAM > 16 GB |
| `Llama-3.1-8B-Advance` | Advance | Llama 3.1 8B，VRAM 8–16 GB |
| `Gemma-4-Standard` | Standard | Gemma 4 4B，VRAM ≤ 8 GB |
| `Gemma-4-Lite` | Lite | Gemma 4 2B，CPU only |

**回傳範例**
```json
{ "status": "ok", "message": "選用模型 Gemma-4-Standard" }
```

---

## 5. 對話（Chat）

### `POST /api/chat` — 同步版（備援）

**請求 Body**
```json
{
  "message":    "幫我找去年的合約",
  "mode":       "search",
  "session_id": "my_session_01",
  "model_id":   "Gemma-4-Standard"
}
```

**回傳範例**
```json
{
  "response":   "根據您的查詢，找到 **5 個相關結果**：...",
  "session_id": "search_1744700400",
  "timestamp":  "2026-04-15T10:00:00"
}
```

---

### `WS /ws/chat` — Streaming（主要）

**上行（Client → Server）**
```json
{
  "message":    "整理桌面文件",
  "mode":       "manage",
  "session_id": "manage_1744700400",
  "model_id":   "Gemma-4-Standard"
}
```

**下行（Server → Client，逐 token）**
```json
{ "token": "✅", "done": false }
{ "token": " ",  "done": false }
...
{ "token": "",   "done": true }
```

> `done: true` 時 token 為空字串，表示本輪回覆結束，可繼續送下一則。

**Mock 回覆含 Markdown**（前端應以 `react-markdown` 渲染）：
- 粗體 `**text**`
- 清單 `- item`
- 程式碼 `` `code` ``

---

## 6. 對話紀錄

### `GET /api/history`

**回傳範例**
```json
{
  "sessions": [
    {
      "session_id":     "search_001",
      "mode":           "search",
      "model":          "Gemma-4-Standard",
      "preview":        "幫我找去年的合約",
      "last_timestamp": "2026-04-06T10:00:00",
      "message_count":  2
    }
  ],
  "total": 3
}
```

---

### `GET /api/history/{session_id}`

**回傳範例**
```json
{
  "session_id": "search_001",
  "messages": [
    { "role": "user",      "content": "幫我找去年的合約", "timestamp": "...", "mode": "search" },
    { "role": "assistant", "content": "根據您的查詢...",   "timestamp": "..." }
  ]
}
```

---

### `DELETE /api/history/{session_id}`

```json
{ "status": "ok" }
```

### `DELETE /api/history`

```json
{ "status": "ok", "message": "所有對話紀錄已清除" }
```

---

## 7. 關閉系統

### `POST /api/shutdown`

```json
{ "status": "shutting down" }
```

> Mock 版不會真的終止程序，方便前端持續開發。

---

## 與真實後端的差異

| 功能 | Mock Backend | 真實後端（ssd/main.py）|
|------|-------------|------------------------|
| LLM 推論 | 隨機假資料（含 Markdown）| llama.cpp 串流推論 |
| 開機流程 | 定時模擬（~15 秒）| 讀取 `logs/llama_boot_*.log` |
| 硬體偵測 | 硬編碼 RTX 4070 Laptop | pynvml 真實偵測 |
| boot_state 欄位 | `message` + `tier_line1` + `tier_line2` | 同左（完全一致） |
| 對話紀錄 | In-memory dict | SQLite `Database/history.db` |
| 關閉服務 | 不終止程序 | `os._exit(0)` |
| 前端靜態服務 | 不提供（由 Vite dev server 代理）| 服務 `frontend_v2/dist/` |
| 依賴 | `fastapi` + `uvicorn` | `fastapi` + `llama.cpp` + `AI_Agent.py` |

> **API 介面（路徑、請求格式、回傳欄位名稱）完全與真實後端一致**，前端無需修改即可切換。
