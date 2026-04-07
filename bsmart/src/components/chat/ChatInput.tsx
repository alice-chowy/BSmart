import { useRef, useState } from "react"
import { ModeMenu } from "../mode/ModeMenu"
import { IconPlaceholder } from "../common/IconPlaceholder"
import { useClickOutside } from "../../hooks/useClickOutside"
import type { Mode } from "../../types"

interface ChatInputProps {
  onSend: (text: string) => void
  placeholder?: string
  disabled?: boolean
  showModeIcon?: boolean
  selectedMode: Mode | null
  onSelectMode: (mode: Mode) => void
}

export function ChatInput({
  onSend,
  placeholder = "掃描",
  disabled = false,
  showModeIcon = false,
  selectedMode,
  onSelectMode,
}: ChatInputProps) {
  const [text, setText] = useState("")
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(menuRef, () => setModeMenuOpen(false))

  const inputDisabled = disabled || (showModeIcon && !selectedMode)
  const currentPlaceholder = selectedMode?.label ?? placeholder

  const handleSubmit = () => {
    if (!text.trim() || inputDisabled) return
    onSend(text.trim())
    setText("")
  }

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <div className={`flex items-center gap-2 rounded-[18px] border border-[#999999] bg-white px-3 py-2 ${
        inputDisabled && !disabled ? "opacity-70" : "opacity-100"
      }`}>
        {showModeIcon && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setModeMenuOpen((current) => !current)}
              title="選擇功能模式"
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2d2d6b] text-white"
            >
              <IconPlaceholder size={16} label="mode" />
            </button>
            {modeMenuOpen && (
              <ModeMenu selectedMode={selectedMode} onSelect={(mode) => {
                onSelectMode(mode)
                setModeMenuOpen(false)
              }} />
            )}
          </div>
        )}

        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
          placeholder={currentPlaceholder}
          disabled={inputDisabled}
          className="flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
        />

        <div className="relative group">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || inputDisabled}
            className={`rounded-md px-3 py-2 text-lg text-[#333] transition-opacity ${
              text.trim() && !inputDisabled ? "opacity-100" : "opacity-30"
            }`}
          >
            ➤
          </button>
          {(!text.trim() || inputDisabled) && (
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-[#4D4D4D] px-2 py-1 text-xs text-white z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              {!selectedMode && showModeIcon ? "請選擇模式" : "請輸入文字"}
            </span>
          )}
        </div>
      </div>

      {showModeIcon && !selectedMode && (
        <div className="mt-2 text-center text-[11px] text-[#888]">請先點選左側圖標選擇模式</div>
      )}
    </div>
  )
}
