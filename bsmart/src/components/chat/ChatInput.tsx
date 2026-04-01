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
      <div className={`flex items-center gap-2 rounded-[18px] border border-[#222] bg-white px-3 py-2 ${
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
              ⊞
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

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || inputDisabled}
          title={!selectedMode && showModeIcon ? "請選擇模式" : "送出"}
          className={`rounded-md px-3 py-2 text-lg text-[#333] transition-opacity ${
            text.trim() && !inputDisabled ? "opacity-100" : "opacity-30"
          }`}
        >
          ➤
        </button>
      </div>

      {showModeIcon && !selectedMode && (
        <div className="mt-2 text-center text-[11px] text-[#888]">請先點選左側圖標選擇模式</div>
      )}
    </div>
  )
}
