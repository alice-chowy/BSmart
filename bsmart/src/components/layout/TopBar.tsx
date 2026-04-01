import type { Model } from "../../types"
import { ModelSelector } from "../model/ModelSelector"

interface TopBarProps {
  model: Model
  onSelect: (model: Model) => void
  onOpenSettings: () => void
}

export function TopBar({ model, onSelect, onOpenSettings }: TopBarProps) {
  return (
    <div className="px-4 py-3 border-b border-[#ddd] bg-[#f5f6fa]">
      <ModelSelector selected={model} onSelect={onSelect} onOpenSettings={onOpenSettings} />
    </div>
  )
}
