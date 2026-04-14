# MVP 規格 - bsmart 前端介面優化

> **目標：** 優化 bsmart AI SSD 對話介面的前端使用體驗  
> **建立日期：** 2026-04-10  
> **版本：** Sprint 1

---

## 1. 專案概述（What & Why）

**一句話描述：** 微調 bsmart 前端 UI，修正側邊欄顯示問題，確保一般使用者能舒適操作 AI SSD 對話介面。

**解決的問題：** 左側邊欄展開後，歷史對話紀錄的字型過小、按鈕高度不足，影響可讀性與操作舒適度。

**目標用戶：** 一般使用者（不熟悉技術），需要清楚可讀的 UI。

---

## 2. 核心功能 (Must Have)

| # | 功能 | 用戶故事 | 驗收標準 |
|---|------|---------|---------|
| 1 | 側邊欄歷史對話按鈕高度修正 | 作為一般使用者，我想要歷史對話按鈕有足夠的高度，以便容易點擊 | 展開側邊欄後，每個對話 item 高度 ≥ 60px（`min-h-[60px]`） |
| 2 | 側邊欄對話標題字型調整 | 作為一般使用者，我想要歷史對話的文字清楚可讀，以便快速辨識對話內容 | 字型大小從 `text-sm`（14px）調整至 `text-[15px]` |

**明確不做（本次）：**
- ❌ 後端 API 串接變更
- ❌ 新增功能（模式動態載入、模型動態載入等）
- ❌ RWD / 行動端適配

---

## 3. 設計決策（How）

### 架構選擇

| 類別 | 選擇 | 理由 |
|------|------|------|
| **架構類型** | 前端元件修改 | 僅調整 `bsmart/src/components/layout/Sidebar.tsx` 中的 Tailwind class |
| 框架 | React + Tailwind CSS | 沿用現有技術棧 |

### 修改範圍

**檔案：** `bsmart/src/components/layout/Sidebar.tsx`  
**元件：** `ChatItem` 內的 `<button>` 元素

| 屬性 | 現況 | 修正後 |
|------|------|--------|
| 字型大小 | `text-sm` (14px) | `text-[15px]` |
| 按鈕高度 | `py-2` (~36px) | `py-2` + `min-h-[60px]` (60px) |
| 垂直對齊 | - | `items-center`（已有，確認） |

---

## 4. 成功標準

**MVP 完成定義：**
- [x] 展開側邊欄後，每個歷史對話 item 高度 ≥ 60px
- [x] 文字大小為 15px，清楚可讀  
- [x] `tsc --noEmit` 和 `npm run lint` 無錯誤
- [ ] 手動驗證：啟動 `npm run dev`，展開側邊欄，確認歷史對話列表外觀

**上線檢查清單：**
- [ ] 核心互動路徑正常（Splash → Main → 新對話 → 歷史點選）
- [ ] 收起/展開側邊欄動畫正常
- [ ] 沒有 blocking bugs

---

## 5. 後續 Sprint（Nice to Have）

| 優先 | 功能 | 說明 |
|------|------|------|
| 🟡 中 | `GET /api/modes` 動態載入 | 取代 hardcode `constants/modes.ts`，可顯示 description/icon |
| 🟡 中 | `GET /api/models` 動態載入 | 取代 hardcode `constants/models.ts`，可顯示 size/speed |
| 🟢 低 | `clearAllChats` 接 SettingsModal | hook 已實作，UI 按鈕未接 |
| 🟢 低 | `shutdown` 接 SettingsModal | hook 已實作，UI 按鈕未接 |
| ⚪ 選用 | `GET /api/files/search` | 搜尋模式結果展示 |

---

*文件由 context-auditor + mvp-require v1.2.1 產生*
