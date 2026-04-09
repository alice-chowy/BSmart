import { useRef, useState } from "react"
import { MODELS } from "../../constants/models"
import type { Model } from "../../types"
import { useClickOutside } from "../../hooks/useClickOutside"

interface ModelSelectorProps {
  selected: Model
  onSelect: (model: Model) => void
  onOpenSettings: () => void
}

export function ModelSelector({ selected, onSelect, onOpenSettings }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative z-10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-2xl bg-transparent px-4 py-2 text-sm font-medium text-[#333] hover:bg-[#D9D9D9] shadow-none"
      >
        <span className="text-xs">⌄</span>
        {selected.name}
      </button>

      {open && (
      <div className="absolute top-full left-0 mt-2 w-[300px] overflow-hidden rounded-2xl border border-[#999999] bg-white text-sm shadow-[0_4px_16px_rgba(0,0,0,0.12)]"> 
        {MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onSelect(model)
                setOpen(false)
              }}
              className={`w-full px-4 py-3 text-left ${
                model.id === selected.id ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{model.name}</span>
                {model.id === selected.id && <span className="text-[#333]">✓</span>}
              </div>
              <div className="mt-1 text-xs text-[#888]">{model.desc}</div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onOpenSettings()
            }}
            className="w-full px-4 py-3 text-left text-sm font-semibold text-[#333] border-t border-[#999999] hover:bg-[#F5F5F5]"
          >
            新增
          </button>
        </div>
      )}
    </div>
  )
}
