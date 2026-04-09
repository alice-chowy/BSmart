import { MODE_OPTIONS } from "../../constants/modes"
import type { Mode } from "../../types"

interface ModeMenuProps {
  selectedMode: Mode | null
  onSelect: (mode: Mode) => void
}

export function ModeMenu({ selectedMode, onSelect }: ModeMenuProps) {
  return (
    <div className="absolute bottom-full left-0 mb-2 min-w-[120px] rounded-2xl border border-[#ddd] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-30">
      {MODE_OPTIONS.map((opt) => (
        <button
          type="button"
          key={opt.key}
          onClick={() => onSelect(opt)}
          className={`flex items-center gap-2 px-4 py-2 w-full text-left text-sm ${
            selectedMode?.key === opt.key ? "bg-[#eef0f8]" : "hover:bg-[#f5f5f8]"
          }`}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm border border-[#ccc] text-[12px] font-semibold text-[#555]">
            {opt.number}
          </span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
