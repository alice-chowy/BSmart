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
          <div className="w-full px-4 py-3 text-left">
            <div className="font-semibold text-[#333] mb-2">{selected.name}</div>
            <div className="p-3 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
              <div className="font-semibold text-[#333]">{selected.model_name || "目前模型"}</div>
              <div className="mt-1 text-xs text-[#888]">{selected.desc}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
