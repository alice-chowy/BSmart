interface DeviceBridgeProps {
  compact?: boolean
}

export function DeviceBridge({ compact = false }: DeviceBridgeProps) {
  const height = compact ? 80 : 140
  const width = compact ? 280 : 440
  const deviceWidth = compact ? 100 : 160
  const iconSize = compact ? 28 : 42
  const labelClass = compact ? "text-[12px]" : "text-[15px]"

  return (
    <div className="flex items-center justify-center gap-0 mx-auto" style={{ width }}>
      <div className="text-center">
        <div className={`${labelClass} font-semibold text-[#333] mb-1.5`}>SSD</div>
        <div
          className="bg-white rounded-[14px] border border-[#d0d0d0] flex items-center justify-center"
          style={{ width: deviceWidth, height }}
        >
          <div className="w-7 h-7 rounded-md bg-[#e0e0e0]" />
        </div>
      </div>

      <div
        className="flex-shrink-0 rounded-full"
        style={{
          width: compact ? 30 : 50,
          height: compact ? 50 : 80,
          background:
            "radial-gradient(ellipse at center, #222 0%, #888 40%, transparent 70%)",
        }}
      />

      <div className="text-center">
        <div className={`${labelClass} font-semibold text-[#333] mb-1.5`}>電腦</div>
        <div
          className="bg-white rounded-[14px] border border-[#d0d0d0] flex items-center justify-center"
          style={{ width: deviceWidth, height }}
        >
          <div style={{ fontSize: iconSize, color: "#e8a820" }}>💡</div>
        </div>
      </div>
    </div>
  )
}
