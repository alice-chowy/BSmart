# Context Gap Report — bsmart

> 🔍 審計時間：2026-05-06
> 📁 專案：bsmart AI SSD 對話介面
> 🎯 目標標準：套用 MVP 方法論（L5）
> 🛠️  審計工具：context-auditor v1.4.2

---

## 執行摘要

| 指標 | 數值 |
|:-----|:-----|
| 目標文件數 | 8 |
| 已完全符合 | 3 |
| 存在但有問題 | 1 |
| 缺失 | 4 |
| 整體完成度 | **50%** |

**整體評估：** 核心 Copilot Context 文件（copilot-instructions.md、AGENTS.md）品質優良，
MVP 規格文件完整（Sprint 3 完成）。主要缺口為 README.md（缺失）及 MVP 任務追蹤文件。

---

## 各文件評分

| 文件 | 狀態 | 品質分數 | 主要問題 |
|:-----|:-----|:--------:|:---------|
| `README.md` | ❌ 缺失 | 0/100 | 完全缺失；copilot-instructions.md 中有斷開的參考連結 |
| `.github/copilot-instructions.md` | ⚠️ 有問題 | 88/100 | 有斷開連結（`../README.md`）；無測試框架記錄 |
| `AGENTS.md` | ✅ 優良 | 95/100 | 結構完整，行為邊界定義清晰 |
| `CONTRIBUTING.md` | ❌ 缺失 | 0/100 | PR 流程、Quality Gates 均未定義 |
| `.github/CODEOWNERS` | ❌ 缺失 | 0/100 | 責任歸屬未定義 |
| `docs/mvp-spec.md` | ✅ 優良 | 92/100 | Sprint 1-3 完整；有少數過時欄位 |
| `docs/mvp-tasks.md` | ❌ 缺失 | 0/100 | 任務追蹤文件缺失（規格文件不等於任務清單） |
| `docs/ra-scope.md` | ❌ 缺失 | 0/100 | 高階需求分析文件缺失（MVP 方法論推薦） |

---

## 詳細問題分析

### `.github/copilot-instructions.md`（88/100）

**問題 1 — 🔴 斷開的 README 連結（Section 6）：**
```markdown
# 目前（斷開連結）
- [README](../README.md) — 專案概覽與 Quick Start
```
- README.md 不存在，此連結會導致 404
- 修復方式：建立 README.md，或暫時移除此行

**問題 2 — 🟡 無測試框架記錄：**
- Section 3 提到「目前無自動化測試框架」，但缺少：
  - 手動驗證步驟的詳細說明（超出「核心路徑」的範疇）
  - 未來引入測試框架的計畫位置（建議在 Section 3 新增 TODO）

**評分細節：**
| 評分項目 | 滿分 | 實得 | 說明 |
|:---------|:----:|:----:|:-----|
| Role & Scope | 15 | 15 | 「Senior Frontend Engineer」定義清晰 |
| Tech Stack 完整性 | 20 | 20 | 版本號、AI 模型、對話模式完整 |
| Build/Run/Test 指令 | 25 | 25 | 可機械執行，涵蓋 dev/build/lint/type-check |
| Coding Standards | 25 | 23 | 5 個具名模式附有程式碼範例；缺測試規範 |
| References section | 5 | 5 | Section 6 存在，但 README 連結已斷 |
| **合計** | **90** | **88** | |

---

### `AGENTS.md`（95/100）

文件結構完整，覆蓋所有必要章節。細節建議：

**問題 1 — 🟢 Doc-Code Sync 表（Section 3.1）引用 README.md：**
```markdown
| 修改模型清單 | `README.md` Tech Stack 表格 |
| 修改 Vite proxy | `README.md` Quick Start + ... |
```
- README.md 不存在，這些同步要求目前無法執行
- 修復方式：README.md 建立後自動生效；短期可加 `（待建立）` 標註

**評分細節：**
| 評分項目 | 滿分 | 實得 | 說明 |
|:---------|:----:|:----:|:-----|
| High-Risk Directories | 25 | 25 | 5 個目錄，風險等級與要求清楚 |
| Non-Negotiable Rules | 30 | 28 | 使用 Do NOT / Do NOT unless，格式正確 |
| Security Boundaries | 30 | 28 | 4 條安全規則，具體可驗證 |
| Change Control | 15 | 14 | Section 7.1/7.2 完整；略可補充說明「通知時機」 |
| **合計** | **100** | **95** | |

---

### `docs/mvp-spec.md`（92/100）

**優點：** Sprint 1-3 功能完整文件化，包含 API 串接狀態、元件規格。

**問題 1 — 🟢 缺少「下一步 / Sprint 4 規劃」章節：**
- 現有文件記錄「已完成」，但缺乏下一階段的規劃
- 建議新增 Section 7：Next Sprint 規劃（即使是空白待填）

**問題 2 — 🟡 缺少 mvp-tasks.md 對應的任務拆解：**
- 規格文件≠任務清單；任務追蹤應由獨立的 `docs/mvp-tasks.md` 承擔
- 可從規格反推已完成任務，並記錄技術債

---

## 補全計畫（按優先級）

### 🔴 Priority 1（Critical — 影響 Copilot 理解脈絡）

| # | 動作 | 受影響範圍 | 建議產出方式 |
|:--|:-----|:---------|:------------|
| 1 | **建立 `README.md`** | copilot-instructions 斷連、AGENTS.md 同步要求失效、新進成員無從了解專案 | 從 mvp-spec.md + copilot-instructions 的 Tech Stack 逆向產出 |

**建議 README.md 章節結構：**
```markdown
# bsmart — AI SSD 對話介面

## Purpose（一句話）
## Scope（In / Out）
## Tech Stack（從 copilot-instructions 移植）
## Architecture Overview（三層：元件 → Hook → Backend）
## Quick Start（從 copilot-instructions 移植）
## Project Structure（從現有 bsmart/src/ 推斷）
## References（API_REFERENCE.md, AGENTS.md）
```

---

### 🟡 Priority 2（High — 影響 MVP 方法論完整性）

| # | 動作 | 受影響範圍 | 建議產出方式 |
|:--|:-----|:---------|:------------|
| 2 | **建立 `docs/mvp-tasks.md`** | 任務進度追蹤缺失，無法驗證哪些任務已完成 / 積壓 | 從 mvp-spec.md 已完成功能逆推，記錄技術債與下一步 |
| 3 | **修復 copilot-instructions 的 README 連結** | Section 6 斷連；修復優先級可在 README.md 建立後自動解決 | README.md 建立後連結自動生效 |

---

### 🟢 Priority 3（Medium — 完善協作規範）

| # | 動作 | 受影響範圍 | 建議產出方式 |
|:--|:-----|:---------|:------------|
| 4 | **建立 `CONTRIBUTING.md`** | PR 流程、Quality Gates、依賴政策未定義 | 從 AGENTS.md 的 Section 3 Mandatory Requirements 擴展 |
| 5 | **建立 `docs/ra-scope.md`** | 高階需求分析文件缺失，影響 MVP 方法論追溯性 | 從 mvp-spec.md Section 1 + 已知 Personas 逆向產出 |
| 6 | **建立 `.skills-config.json`** | Skills 工具路徑無法自動解析 | 由 context-initializer 自動生成 |

---

### ➖ 不在範圍（已評估、跳過）

| 文件 | 原因 |
|:-----|:-----|
| `.github/CODEOWNERS` | 小型專案（1 人開發），不需要自動指派 reviewer |
| `.github/agents/*.agent.md` | 未使用多 Agent 模式 |
| `docs/memory/constitution.md` | MVP 方法論中此文件由 mvp-design Phase 產出，非初始化範疇 |

---

## 修復優先矩陣

```
          影響程度
高 │  🔴 README.md         🟡 mvp-tasks.md
   │                        🟡 修復斷連連結
中 │  🟢 CONTRIBUTING.md   🟢 ra-scope.md
低 │  🟢 .skills-config    ➖ CODEOWNERS
   └─────────────────────────────────────
      高           低      修復難度
```

---

## 後續行動建議

```
短期（本 Sprint）：
✅ 建立 README.md（Priority 1）
✅ 建立 docs/mvp-tasks.md（Priority 2）

中期（下 Sprint 前）：
🔲 建立 CONTRIBUTING.md
🔲 建立 docs/ra-scope.md

不急：
🔲 建立 .skills-config.json（執行 context-initializer 時自動生成）
```

---

## 重新審計方式

修復後，重新觸發 `context-auditor` 或 `copilot-context-initializer` 來驗證改善成果。
預期達到：**整體完成度 80%+**（Priority 1+2 修復後）。
