import type { CSSProperties } from "react"

interface IconPlaceholderProps {
  size?: number
  label?: string
  style?: CSSProperties
  onClick?: () => void
}

export function IconPlaceholder({
  size = 20,
  label = "icon",
  style = {},
  onClick,
}: IconPlaceholderProps) {
  return (
    <div
      title={label}
      onClick={onClick}
      className="inline-flex items-center justify-center text-white rounded-sm cursor-pointer flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "#bbb",
        fontSize: size * 0.5,
        ...style,
      }}
    >
      ⬚
    </div>
  )
}
