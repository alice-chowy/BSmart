import logoIcon from "@logo/LOGO_icon.png"
import { ChatInput } from "../chat/ChatInput"
import { DeviceBridge } from "./DeviceBridge"
import type { Mode, QuickAction } from "../../types"

interface HomeViewProps {
  onSend: (text: string) => void
  selectedMode: Mode | null
  onSelectMode: (mode: Mode) => void
  suggestions?: string[]
  quickActions?: QuickAction[]
  modeDescription?: string | null
}

export function HomeView({ onSend, selectedMode, onSelectMode, suggestions = [], quickActions = [], modeDescription }: HomeViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
      <div className="w-full max-w-[560px]">
        <DeviceBridge mode={selectedMode} />
        <div className="mt-8 flex items-center gap-3 text-[#222]">
          <img src={logoIcon} alt="BSMART Icon" className="h-10 w-10 rounded-2xl object-cover" />
          <div>
            <span className="text-2xl font-bold">你好，備份助手已上線</span>
            {modeDescription && (
              <p className="text-sm text-[#888] mt-0.5">{modeDescription}</p>
            )}
          </div>
        </div>
        <div className="mt-10">
          <ChatInput
            onSend={onSend}
            showModeIcon
            selectedMode={selectedMode}
            onSelectMode={onSelectMode}
            suggestions={suggestions}
            quickActions={quickActions}
          />
        </div>
      </div>
    </div>
  )
}
