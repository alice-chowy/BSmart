interface LaptopIconProps {
  size?: number
}

export function LaptopIcon({ size = 120 }: LaptopIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Laptop screen - back panel */}
      <g transform="translate(256, 256) rotate(0) translate(-256, -256)">
        {/* Screen body - isometric style */}
        <path
          d="M100 100 L420 140 L420 340 L100 300 Z"
          fill="#A0A8B4"
          stroke="#888"
          strokeWidth="2"
        />
        {/* Screen display area */}
        <path
          d="M120 120 L400 156 L400 320 L120 284 Z"
          fill="#2A2A2A"
        />
        {/* Keyboard base */}
        <path
          d="M80 310 L440 350 L480 440 L40 400 Z"
          fill="#B8BCC4"
          stroke="#999"
          strokeWidth="2"
        />
        {/* Keyboard keys area */}
        <path
          d="M100 320 L420 356 L454 430 L66 394 Z"
          fill="#444"
        />
        {/* Key rows */}
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row}>
            {Array.from({ length: 10 }, (_, col) => (
              <rect
                key={col}
                x={110 + col * 32 + row * 2}
                y={325 + row * 20 + (col * 0.3)}
                width="26"
                height="14"
                rx="2"
                fill="#333"
                stroke="#555"
                strokeWidth="0.5"
                transform={`skewY(${2})`}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}
