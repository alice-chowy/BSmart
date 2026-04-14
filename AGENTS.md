# Agent Behavior Boundaries — bsmart

> **版本化行為邊界：** 本文件定義 AI Agent 在 bsmart 專案中不可妥協的行為規則。
> 優先級高於 `.github/copilot-instructions.md`。

---

## 1. High-Risk Directories

以下目錄任何變更都需要額外審核：

| 目錄 / 檔案 | 風險等級 | 變更要求 |
|:------------|:---------|:---------|
| `bsmart/vite.config.ts` | 🔴 高 | Proxy 設定影響所有 API 路由；變更前說明理由 |
| `bsmart/src/types/` | 🟡 中 | 共用型別；修改須確認所有使用處不破壞相容性 |
| `bsmart/src/constants/models.ts` | 🟡 中 | 模型清單；新增/刪除需同步更新 UI 說明文字 |
| `bsmart/src/hooks/useChat.ts` | 🟡 中 | 核心狀態管理；改動需驗證 WS 連線生命週期 |
| `AISSD_MockServer/` | 🔴 高 | 封裝執行檔，不可修改或替換（由後端團隊維護） |

---

## 2. Non-Negotiable Rules

### 2.1 絕對禁止 (Do NOT)

- ❌ **絕對禁止** 在前端程式碼中 hardcode `localhost:8081` 或任何後端 IP/Port
- ❌ **絕對禁止** 引入 `any` 型別；所有 API 回應必須有具名 interface
- ❌ **絕對禁止** 在元件層（`.tsx`）持有 WebSocket reference（統一由 `useChat` 管理）
- ❌ **絕對禁止** 在 PR 中留下未清除的 `console.log`（debug 用途除外需加 comment）
- ❌ **絕對禁止** 修改或刪除 `AISSD_MockServer/` 目錄下任何檔案

### 2.2 條件禁止 (Do NOT ... unless ...)

- ❌ 不可新增第三方 npm dependency，**除非** 已說明：用途、bundle size 影響、替代方案評估
- ❌ 不可修改 `vite.config.ts` 的 proxy 設定，**除非** 後端 port 或路由有正式變更
- ❌ 不可移除 `.catch(() => {})` 降級，**除非** 有明確的 UI 錯誤處理取代之

---

## 3. Mandatory Requirements

任何前端程式碼變更必須滿足：

- ✅ TypeScript strict mode 通過（`npx tsc --noEmit` 無錯誤）
- ✅ ESLint 通過（`npm run lint` 無 error）
- ✅ Vite build 通過（`npm run build` 無錯誤）
- ✅ 核心互動路徑手動驗證：SplashScreen → 主畫面 → 選模式 → 送訊息 → 收回覆

### 3.1 文件同步要求 (Doc-Code Sync)

| 代碼變更 | 必須更新 |
|:---------|:---------|
| 新增 API 端點串接 | `API_REFERENCE.md` 的「前端串接」欄位 |
| 修改模型清單 | `README.md` Tech Stack 表格 |
| 修改 Vite proxy | `README.md` Quick Start + `copilot-instructions.md` |
| 新增對話模式 | `src/constants/` + `src/types/` + `API_REFERENCE.md` |
| 修改 Build/Run 指令 | `README.md` + `copilot-instructions.md` Section 3 |

---

## 4. Security Boundaries

- ❌ **絕對禁止** 在前端儲存或傳送任何 credentials、API keys、secrets
- ❌ **絕對禁止** 將使用者輸入未經處理直接傳遞給 `eval()` 或動態執行
- ❌ **絕對禁止** 在錯誤訊息的 UI 中暴露後端 stack trace
- ✅ 所有 `fetch` 回應必須用具名 interface 解析，避免隱式 `any` 帶入不可信資料
- ✅ WebSocket 訊息處理必須驗證 `event.data` 格式，不假設後端回傳結構

---

## 5. Agent Working Protocol

### 5.1 Bug Fixing Protocol

- 識別 root cause 再修，禁止只貼症狀補丁
- WebSocket 相關 bug 一律先檢查 `useChat.ts` 連線生命週期
- 修完後自問：同樣的 bug 是否存在於其他 fetch/WS 呼叫？若有則標記

### 5.2 Planning & Reasoning Protocol

- 非平凡任務（3+ 步驟或影響共用型別）：先說明方案再改程式碼
- 複雜 UI 狀態問題拆解為：state 流向 → event handler → hook → API

### 5.3 Testing & Verification Protocol

- 任務未驗證核心路徑前不視為完成
- API 串接變更需驗證 Mock Server 已啟動時的實際回應

---

## 6. Architecture Integrity

### 6.1 分層邊界

```
元件層（.tsx）    — 只讀 props，呼叫 callback，不直接 fetch/WebSocket
Hook 層           — 狀態管理、API 呼叫、WS 連線（useChat）
Constants / Types — 靜態資料、型別定義（不含 side effects）
```

### 6.2 依賴方向

```
元件 → Hooks → Types/Constants
元件 ❌→ 直接 WebSocket
元件 ❌→ 直接 fetch（除 App.tsx 的頂層協調呼叫）
```

---

## 7. Change Control

### 7.1 需要人工審核的變更

以下變更類型 Agent 僅能「建議」不可直接執行：

- `bsmart/vite.config.ts` proxy 路由變更
- `src/types/index.ts` 刪除或重命名現有欄位
- 新增第三方 npm 套件
- `API_REFERENCE.md` 端點簽名變更

### 7.2 變更通知要求

當 Agent 執行以下操作時，必須明確告知使用者：

- 新增 `.tsx` 元件檔案
- 修改共用 Hook interface
- 新增 `src/types/` 型別定義
- 修改 `vite.config.ts`

---

## References

- [copilot-instructions](.github/copilot-instructions.md) — 編碼標準
- [README](README.md) — 專案概覽
- [API Reference](API_REFERENCE.md) — 後端 API 文件
