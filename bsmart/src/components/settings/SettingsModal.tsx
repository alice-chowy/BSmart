import { useState } from "react"
import type { Model } from "../../types"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  models: Model[]
  customModels: Model[]
  onAddCustom: (name: string) => void
  onShutdown?: () => void
}

export function SettingsModal({
  open,
  onClose,
  models,
  customModels,
  onAddCustom,
  onShutdown,
}: SettingsModalProps) {
  const [tab, setTab] = useState<"general" | "models">("models")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="relative flex w-[min(600px,100%)] max-h-[70vh] overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <nav className="w-36 bg-[#D4E1F5] border-r border-[#999999] px-4 py-6">
          <div className="mb-0.5 block w-full px-3 py-1.5 text-left text-xs font-semibold text-[#444] select-none">
            一般
          </div>
          <button
            type="button"
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#F5F5F5] ${
              tab === "models" ? "font-semibold text-[#222]" : "text-[#666]"
            }`}
            onClick={() => setTab("models")}>
            模型管理
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto p-7">
          {tab === "general" ? (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#333]">一般設定</h3>
              <p className="text-sm text-[#888] mb-6">（一般設定內容佔位）</p>
              {onShutdown && (
                <div className="border-t border-[#e0e0e0] pt-5">
                  <div className="mb-2 text-sm font-semibold text-[#333]">系統</div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("確定要關閉 AI SSD？")) {
                        onShutdown()
                        onClose()
                      }
                    }}
                    className="rounded-xl border border-[#E53E3E] px-4 py-2 text-sm font-semibold text-[#E53E3E] hover:bg-[#FFF0F0] transition-colors"
                  >
                    關閉 AI SSD
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-[#555]">模型管理</h3>
              <div className="border-t border-[#999999] mb-4" />
              <div className="mb-5">
                <div className="mb-2 text-sm font-semibold text-[#333]">預設模型</div>
                <div className="space-y-3">
                  {models.map((model) => (
                    <div key={model.id} className="cursor-default rounded-2xl p-3 hover:bg-[#F5F5F5]">
                      <div className="font-semibold text-sm">{model.name}</div>
                      <div className="mt-1 text-[11px] text-[#888]">{model.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#999999] pt-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#333]">
                  自訂模型
                  <button
                    type="button"
                    onClick={() => {
                      const name = window.prompt("輸入自訂模型名稱：")
                      if (name?.trim()) onAddCustom(name.trim())
                    }}
                    className="text-[18px] font-black leading-none text-[#4158d0]"
                  >
                    +
                  </button>
                </div>
                {customModels.length === 0 ? (
                  <p className="text-xs text-[#aaa]">尚未新增自訂模型</p>
                ) : (
                  <div className="space-y-3">
                    {customModels.map((model, index) => (
                      <div key={index} className="rounded-2xl border border-[#999999] p-3">
                        <div className="font-semibold text-sm">{model.name}</div>
                        <div className="mt-1 text-[11px] text-[#888]">自訂模型</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-xl text-[#999] hover:text-[#4D4D4D]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}