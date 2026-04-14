import { useRef, useState } from "react"
import { ModeMenu } from "../mode/ModeMenu"
import { useClickOutside } from "../../hooks/useClickOutside"
import type { Mode } from "../../types"

interface ChatInputProps {
  onSend: (text: string) => void
  placeholder?: string
  disabled?: boolean
  showModeIcon?: boolean
  selectedMode: Mode | null
  onSelectMode: (mode: Mode) => void
  suggestions?: string[]
}

export function ChatInput({
  onSend,
  placeholder = "先點選左側圖標選擇模式",
  disabled = false,
  showModeIcon = false,
  selectedMode,
  onSelectMode,
  suggestions = [],
}: ChatInputProps) {
  const [text, setText] = useState("")
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(menuRef, () => setModeMenuOpen(false))

  const inputDisabled = disabled || (showModeIcon && !selectedMode)
  const currentPlaceholder = selectedMode?.label ?? placeholder

  const handleSubmit = (msg?: string) => {
    const value = (msg ?? text).trim()
    if (!value || inputDisabled) return
    onSend(value)
    setText("")
  }

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      {/* 建議清單 chips */}
      {suggestions.length > 0 && selectedMode && (
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSubmit(s)}
              className="rounded-full border border-[#999999] bg-white px-3 py-1 text-[10px] text-[#444] hover:bg-[#E9EEF6] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={`flex items-center gap-2 rounded-[18px] border border-[#999999] bg-white px-3 py-2 ${
        inputDisabled && !disabled ? "opacity-70" : "opacity-100"
      }`}>
        {showModeIcon && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setModeMenuOpen((current) => !current)}
              title="選擇功能模式"
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#E9EEF6] bg-transparent"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <rect x="0" y="0" width="8" height="8" rx={selectedMode ? 3 : 1} fill="#1a1a4e" />
                <rect x="10" y="0" width="8" height="8" rx={selectedMode ? 3 : 1} fill="#1a1a4e" />
                <rect x="0" y="10" width="8" height="8" rx={selectedMode ? 3 : 1} fill="#1a1a4e" />
                <rect x="10" y="10" width="8" height="8" rx={selectedMode ? 3 : 1} fill="#1a1a4e" />
              </svg>
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
          className="flex-1 bg-transparent text-xs outline-none disabled:cursor-not-allowed"
        />

        <div className="relative group">
          <button
            type="button"
            onClick={() => handleSubmit()}
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
    </div>
  )
}