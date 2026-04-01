import { useState } from "react"
import type { Model } from "../../types"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  models: Model[]
  customModels: Model[]
  onAddCustom: (name: string) => void
}

export function SettingsModal({
  open,
  onClose,
  models,
  customModels,
  onAddCustom,
}: SettingsModalProps) {
  const [tab, setTab] = useState<"general" | "models">("models")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="relative flex w-[min(600px,100%)] max-h-[70vh] overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <nav className="w-36 bg-[#f8f9fc] border-r border-[#eee] px-4 py-6">
          <button
            type="button"
            className={`mb-2 block w-full rounded-xl px-3 py-3 text-left text-sm ${
              tab === "general" ? "font-semibold text-[#222]" : "text-[#666]"
            }`}
            onClick={() => setTab("general")}
          >
            一般
          </button>
          <button
            type="button"
            className={`block w-full rounded-xl px-3 py-3 text-left text-sm ${
              tab === "models" ? "font-semibold text-[#222]" : "text-[#666]"
            }`}
            onClick={() => setTab("models")}
          >
            模型管理
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto p-7">
          {tab === "general" ? (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#333]">一般設定</h3>
              <p className="text-sm text-[#888]">（一般設定內容佔位）</p>
            </div>
          ) : (
            <div>
              <h3 className="mb-5 text-lg font-semibold text-[#555]">模型管理</h3>
              <div className="mb-5">
                <div className="mb-2 text-sm font-semibold text-[#333]">預設模型</div>
                <div className="space-y-3">
                  {models.map((model) => (
                    <div key={model.id} className="rounded-2xl border border-[#f0f0f0] p-3">
                      <div className="font-semibold text-sm">{model.name}</div>
                      <div className="mt-1 text-[11px] text-[#888]">{model.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#eee] pt-4">
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
                      <div key={index} className="rounded-2xl border border-[#f0f0f0] p-3">
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
          className="absolute right-4 top-4 rounded-full p-1.5 text-xl text-[#999] hover:text-[#555]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
