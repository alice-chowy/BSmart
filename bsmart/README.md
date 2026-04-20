# BSMART App

BSMART App 是基於 **Vite + React 19 + TypeScript + Tailwind CSS v4** 的備份助手 UI 原型。

## 技術棧

| 套件 | 版本 |
|------|------|
| React | ^19.2.4 |
| TypeScript | ~5.9.3 |
| Vite | ^8.0.1 |
| Tailwind CSS | ^4.2.2 |

## 已實作功能

- **SplashScreen（開機畫面）**：WS `/ws/boot` 推送進度條與 tier 說明；`boot.error` 非 null 時顯示錯誤框
- **HomeView（首頁）**：歡迎語、選模式後顯示 `modeDescription`、DeviceBridge 示意圖
- **TopBar**：模型下拉選單（切換後顯示 toast）、設定按鈕
- **Sidebar**：啟動時從 `GET /api/history` 載入歷史 session；顯示訊息數、最後時間、模型名稱；連線狀態指示燈；對話 CRUD
- **ModeMenu**：4 個模式（掃描 / 搜尋 / 管理 / 同步），各有圖示與 icon size 控制；呼叫 `POST /api/mode/select` 取得 suggestions / quick_actions
- **ChatView + ChatMessage**：WS `/ws/chat` streaming（3 秒最短動畫）；POST fallback；助手回覆以 `react-markdown` 渲染；歷史訊息顯示時間戳記
- **ChatInput**：Enter 送出、模式圖示切換、quick action 快捷按鈕
- **SettingsModal**：4 個分頁（一般 / 模型管理 / 資料 / 個人）
- **useChat hook**：WS 生命週期管理、session 對應、history lazy-load、newChat / renameChat / deleteChat / clearAllChats / shutdown

## 內建模型（`constants/models.ts`）

| ID | 名稱 | 適用規格 |
|----|------|---------|
| `gemma-4-standard` | Gemma 4 Standard | VRAM ≤ 8 GB |
| `llama-3.1-8b` | Llama-3.1-8B | CPU 或 GPU < 10 GB |
| `qwen-2.5-14b` | Qwen2.5-14B-Instruct | GPU 12–16 GB |
| `mistral-24b` | Mistral Small 24B Instruct | GPU ≥ 16 GB |

## 開發

```bash
cd bsmart
npm install
npm run dev
```

預設開發伺服器：`http://localhost:5173/`

## 編譯

```bash
npm run build
```

## 目錄結構

```
bsmart/
├── src/
│   ├── types/          # 共用型別（Model、Mode、Message、Chat、QuickAction）
│   ├── constants/      # models.ts（模型清單）、modes.ts（模式 + 圖示）
│   ├── hooks/          # useChat（WS + 歷史管理）、useClickOutside
│   └── components/
│       ├── splash/     # SplashScreen（WS boot 進度）
│       ├── layout/     # Sidebar、TopBar
│       ├── home/       # HomeView、DeviceBridge
│       ├── chat/       # ChatView、ChatMessage（react-markdown）、ChatInput
│       ├── mode/       # ModeMenu
│       ├── model/      # ModelSelector
│       ├── settings/   # SettingsModal
│       └── common/     # LogoPlaceholder、IconPlaceholder
```

## Logo 資源

Logo 圖片位於專案外的 `../logo/` 目錄，透過 `@logo` vite alias 引用：

| 檔案 | 說明 |
|------|------|
| `LOGO.jpg` | 完整 logo |
| `LOGO_icon.png` | Icon 版 logo |
| `LOGO_rmbg.png` | 去背版 logo |