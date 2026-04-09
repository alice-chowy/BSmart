import { SsdIcon } from "./SsdIcon"
import { LaptopIcon } from "./LaptopIcon"

interface DeviceBridgeProps {
  compact?: boolean
}

export function DeviceBridge({ compact = false }: DeviceBridgeProps) {
  const width = compact ? 280 : 440
  const iconSize = compact ? 70 : 120
  const labelClass = compact ? "text-[12px]" : "text-[15px]"

  return (
    <div className="flex items-center justify-center gap-4 mx-auto" style={{ width }}>
      <div className="text-center">
        <div className={`${labelClass} font-semibold text-[#333] mb-2`}>SSD</div>
        <SsdIcon size={iconSize} />
      </div>

      <div
        className="flex-shrink-0"
        style={{
          width: compact ? 40 : 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: compact ? 18 : 24,
        }}
      >
        <svg width={compact ? 40 : 60} height={compact ? 20 : 24} viewBox="0 0 60 24">
          <path
            d="M4 8 L20 4 L36 8 L52 4 L56 8 M4 16 L20 12 L36 16 L52 12 L56 16"
            stroke="#1B2A4A"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="text-center">
        <div className={`${labelClass} font-semibold text-[#333] mb-2`}>電腦</div>
        <LaptopIcon size={iconSize} />
      </div>
    </div>
  )
}
