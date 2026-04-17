import { useState } from "react"
import type { Model } from "../../types"

interface HardwareInfo {
  source: string
  name: string
  total_mb: number
  free_mb: number
}

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  models: Model[]
  customModels: Model[]
  onAddCustom: (name: string) => void
  onClearAllChats?: () => void
  onShutdown?: () => void
  hardware?: HardwareInfo | null
}

export function SettingsModal({
  open,
  onClose,
  models,
  customModels,
  onAddCustom,
  onClearAllChats,
  onShutdown,
  hardware,
}: SettingsModalProps) {
  const [tab, setTab] = useState<"general" | "models">("models")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="relative flex w-[min(700px,90%)] max-h-[85vh] overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <nav className="w-40 bg-[#D4E1F5] border-r border-[#999999] px-4 py-6 shrink-0">
          <div className="mb-1 block w-full px-3 py-1.5 text-left text-xs font-semibold text-[#444] select-none">
            設定選單
          </div>
          <button
            type="button"
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#c1d3ef] transition-colors ${
              tab === "general" ? "font-semibold text-[#222] bg-[#c1d3ef]" : "text-[#555]"
            }`}
            onClick={() => setTab("general")}>
            一般設定
          </button>
          <button
            type="button"
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#c1d3ef] transition-colors mt-2 ${
              tab === "data" ? "font-semibold text-[#222] bg-[#c1d3ef]" : "text-[#555]"
            }`}
            onClick={() => setTab("data")}>
            資料管理
          </button>
          <button
            type="button"
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#c1d3ef] transition-colors mt-2 ${
              tab === "personal" ? "font-semibold text-[#222] bg-[#c1d3ef]" : "text-[#555]"
            }`}
            onClick={() => setTab("personal")}>
            個人化管理
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto p-8 relative styled-scrollbar">
          {tab === "general" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-[#333]">一般設定</h3>

              {/* 效能 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">效能</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-2">最大記憶體使用限制</label>
                    <input type="range" className="w-full md:w-3/4 accent-[#4158d0]" defaultValue={50} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-2">背景執行模式</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="bg_mode" defaultChecked className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        低功耗 <span className="text-xs text-[#888] bg-[#F0F0F0] px-1.5 py-0.5 rounded">預設</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="bg_mode" className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        高效能
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 介面 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">介面</h4>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">語言（多語系）</label>
                  <select className="w-full md:w-1/2 rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white">
                    <option value="zh">繁體中文 (預設)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* 通知與互動 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">通知與互動</h4>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">AI建議提示</label>
                  <select className="w-full md:w-1/2 rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white">
                    <option value="on">開啟 (預設)</option>
                    <option value="off">關閉</option>
                  </select>
                </div>
              </div>

              {/* 系統 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">系統</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB]">
                    <span className="text-sm text-[#555] font-medium">裝置型號</span>
                    <span className="text-sm font-semibold text-[#333]">AI SSD V1</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB]">
                    <span className="text-sm text-[#555] font-medium">裝置綁定狀態</span>
                    <span className="text-sm font-semibold text-[#4CAF50] bg-[#E8F5E9] px-2.5 py-1 rounded-full text-xs">已綁定</span>
                  </div>
                  
                  {/* Keep Shutdown Option */}
                  <div className="flex justify-between items-center bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB] mt-2">
                    <div>
                      <div className="text-sm font-semibold text-[#333]">關機</div>
                      <div className="text-xs text-[#888] mt-0.5">傳送關機指令給 AI SSD 後端</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("確定要關閉 AI SSD 嗎？")) {
                          onShutdown?.()
                          onClose()
                        }
                      }}
                      className="rounded-lg border border-[#999999] px-4 py-1.5 text-sm text-[#555] hover:bg-[#F5F5F5] hover:text-[#333] transition-colors whitespace-nowrap"
                    >
                      關閉 AI SSD
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
          
          {tab === "data" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-[#333]">資料管理</h3>

              {/* 清理與保留 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">清理與保留</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB]">
                    <div>
                      <div className="text-sm font-semibold text-[#333]">對話紀錄清除</div>
                      <div className="text-xs text-[#888] mt-0.5">清除所有歷史對話紀錄，此操作無法復原。</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("確定要清除所有對話紀錄嗎？")) {
                          onClearAllChats?.()
                          onClose()
                        }
                      }}
                      className="rounded-lg border border-[#E53E3E] bg-white px-4 py-1.5 text-sm text-[#E53E3E] hover:bg-[#FFF0F0] transition-colors whitespace-nowrap"
                    >
                      清除
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB]">
                    <div>
                      <div className="text-sm font-semibold text-[#333]">RAG紀錄清除</div>
                      <div className="text-xs text-[#888] mt-0.5">清除知識庫索引與快取資料。</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.confirm("確定要清除 RAG 紀錄嗎？")}
                      className="rounded-lg border border-[#E53E3E] bg-white px-4 py-1.5 text-sm text-[#E53E3E] hover:bg-[#FFF0F0] transition-colors whitespace-nowrap"
                    >
                      清除
                    </button>
                  </div>
                  
                  <div className="bg-[#F9F9F9] p-3.5 rounded-xl border border-[#EBEBEB]">
                    <label className="block text-sm font-semibold text-[#333] mb-2">快取清除</label>
                    <select className="w-full md:w-1/2 rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white">
                      <option value="auto">自動</option>
                      <option value="manual">手動</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 備份策略 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">備份策略</h4>
                <div className="space-y-5 bg-[#F9F9F9] p-4 rounded-xl border border-[#EBEBEB]">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-3">備份時機設定</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4158d0] rounded border-[#999999] focus:ring-[#4158d0]" />
                        載入時
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4158d0] rounded border-[#999999] focus:ring-[#4158d0]" />
                        離開時
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">備份路徑</label>
                    <input type="text" defaultValue="D:\Backups\AI_SSD" className="w-full rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {tab === "personal" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-[#333]">個人化管理</h3>

              {/* 個人設定 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">個人設定</h4>
                <div className="space-y-4">
                  <div className="bg-[#F9F9F9] p-4 rounded-xl border border-[#EBEBEB]">
                    <label className="block text-sm font-semibold text-[#333] mb-2">使用者稱呼</label>
                    <input type="text" placeholder="輸入稱呼" className="w-full rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white" />
                  </div>
                  <div className="bg-[#F9F9F9] p-4 rounded-xl border border-[#EBEBEB]">
                    <label className="block text-sm font-semibold text-[#333] mb-2">工作角色</label>
                    <input type="text" placeholder="例如：工程師、設計師" className="w-full rounded-xl border border-[#CCC] px-3 py-2 text-sm text-[#333] focus:border-[#4158d0] focus:ring-1 focus:ring-[#4158d0] focus:outline-none bg-white" />
                  </div>
                </div>
              </div>

              {/* AI個人化 */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-[#555] border-b border-[#E0E0E0] pb-2">AI個人化</h4>
                <div className="space-y-4">
                  <div className="bg-[#F9F9F9] p-4 rounded-xl border border-[#EBEBEB]">
                    <label className="block text-sm font-semibold text-[#333] mb-3">偏好分類方式</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="preference_category" defaultChecked className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        工作
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="preference_category" className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        私人
                      </label>
                    </div>
                  </div>
                  <div className="bg-[#F9F9F9] p-4 rounded-xl border border-[#EBEBEB]">
                    <label className="block text-sm font-semibold text-[#333] mb-3">回答風格</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="response_style" defaultChecked className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        精簡
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
                        <input type="radio" name="response_style" className="w-4 h-4 text-[#4158d0] focus:ring-[#4158d0]" />
                        專業
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-xl text-[#999] hover:bg-[#F0F0F0] hover:text-[#555] transition-colors"
          title="關閉"
        >
          ✕
        </button>
      </div>
    </div>
  )
}