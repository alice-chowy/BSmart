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

- **Splash 載入畫面**：應用程式啟動過渡動畫
- **首頁（HomeView）**：歡迎頁面，含裝置橋接示意圖（SSD ↔ 電腦）
- **頂部選單列（TopBar）**：模型下拉選單、設定按鈕
- **左側欄（Sidebar）**：對話歷史清單、展開 / 收合、新增對話、裝置名稱顯示（SE880）
- **功能模式選單（ModeMenu）**：掃描、匯入、還原、同步（可搭配訊息送出）
- **對話頁面（ChatView）**：訊息顯示、輸入框、模擬非同步回覆（1.5 秒延遲）
- **設定浮窗（SettingsModal）**：分頁式（一般 / 模型管理），支援新增自訂模型
- **多對話管理（useChat）**：多對話切換、新增對話、訊息追加

## 內建模型

| ID | 名稱 | 適用規格 |
|----|------|---------|
| `llama-3.1-8b` | Llama-3.1-8B | CPU 或 GPU 記憶體 < 10 GB |
| `qwen-2.5-14b` | Qwen2.5-14B-Instruct | GPU 記憶體約 12–16 GB |
| `mistral-24b` | Mistral Small 24B Instruct | GPU 記憶體 16 GB 以上 |

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
├── public/             # 靜態資源（LOGO.jpg、LOGO_icon.png、LOGO_rmbg.png、icons.svg、favicon.svg）
├── src/
│   ├── types/          # 共用 TypeScript 型別（Model、Mode、Message、Chat）
│   ├── constants/      # 模型清單（models.ts）與模式清單（modes.ts）
│   ├── hooks/          # useChat（對話狀態管理）、useClickOutside
│   └── components/
│       ├── splash/     # SplashScreen
│       ├── layout/     # Sidebar、TopBar
│       ├── home/       # HomeView、DeviceBridge
│       ├── chat/       # ChatView、ChatMessage、ChatInput
│       ├── mode/       # ModeMenu
│       ├── model/      # ModelSelector
│       ├── settings/   # SettingsModal
│       └── common/     # IconPlaceholder、LogoPlaceholder
```

## Logo 資源

logo 圖片位於 `public/` 資料夾，可直接以根路徑引用（例如 `/LOGO_icon.png`）：

| 檔案 | 說明 |
|------|------|
| `LOGO.jpg` | 完整 logo |
| `LOGO_icon.png` | Icon 版 logo |
| `LOGO_rmbg.png` | 去背版 logo |
| `icons.svg` | UI 圖示集 |
| `favicon.svg` | 瀏覽器分頁圖示 |