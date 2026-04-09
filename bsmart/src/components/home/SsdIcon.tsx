interface SsdIconProps {
  size?: number
}

export function SsdIcon({ size = 120 }: SsdIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main body - top part (trapezoid shape) */}
      <path
        d="M96 80 C96 60, 116 40, 136 40 L376 40 C396 40, 416 60, 416 80 L416 280 C416 290, 410 300, 400 305 L112 305 C102 300, 96 290, 96 280 Z"
        fill="#1B2A4A"
        rx="30"
      />
      {/* Curved highlight at bottom of top section */}
      <path
        d="M90 300 Q256 340 422 300"
        stroke="#C8D0DC"
        strokeWidth="8"
        fill="none"
      />
      {/* Bottom section (rounded rectangle) */}
      <rect
        x="120"
        y="320"
        width="272"
        height="140"
        rx="70"
        ry="70"
        fill="#1B2A4A"
      />
      {/* LED dots */}
      <circle cx="210" cy="390" r="12" fill="white" />
      <circle cx="240" cy="390" r="12" fill="white" />
      <circle cx="270" cy="390" r="12" fill="white" />
      <circle cx="300" cy="390" r="12" fill="white" />
    </svg>
  )
}
