import logoIcon from "@logo/LOGO_icon.png"
import { ChatInput } from "../chat/ChatInput"
import { DeviceBridge } from "./DeviceBridge"
import type { Mode } from "../../types"

interface HomeViewProps {
  onSend: (text: string) => void
  selectedMode: Mode | null
  onSelectMode: (mode: Mode) => void
}

export function HomeView({ onSend, selectedMode, onSelectMode }: HomeViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
      <div className="w-full max-w-[560px]">
        <DeviceBridge mode={selectedMode} />
        <div className="mt-8 flex items-center gap-3 text-[#222]">
          <img src={logoIcon} alt="BSMART Icon" className="h-10 w-10 rounded-2xl object-cover" />
          <span className="text-2xl font-bold">你好，備份助手已上線</span>
        </div>
        <div className="mt-10">
          <ChatInput
            onSend={onSend}
            placeholder="掃描"
            showModeIcon
            selectedMode={selectedMode}
            onSelectMode={onSelectMode}
          />
        </div>
      </div>
    </div>
  )
}
