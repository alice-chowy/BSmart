interface LogoPlaceholderProps {
  size?: number
  label?: string
}

export function LogoPlaceholder({ size = 48, label = "Logo" }: LogoPlaceholderProps) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #c850c0 0%, #4158d0 100%)",
        fontSize: size * 0.3,
      }}
    >
      {label[0] ?? "B"}
    </div>
  )
}
