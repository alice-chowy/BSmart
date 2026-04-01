import { useEffect, useState } from "react"
import logoIcon from "@logo/LOGO_rmbg.png"

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(interval)
          window.setTimeout(onFinish, 300)
          return 100
        }
        return value + 2
      })
    }, 40)

    return () => window.clearInterval(interval)
  }, [onFinish])

  return (
    <div className="w-screen h-screen bg-[#dde1ec] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src={logoIcon}
          alt="BSMART Logo"
          className="h-auto object-contain"
          style={{ maxHeight: 200, maxWidth: 400 }}
        />

        <div className="w-[360px] h-1 rounded-full bg-[#c0c4d4] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4158d0] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="font-black text-[#2c2c67] tracking-[0.2em]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px" }}
        >
          {progress.toString().padStart(3, "0")}
        </div>

        <div
          className="text-[#6b6b9b]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px" }}
        >
          {progress < 20 ? "開啟中" : progress < 100 ? "載入中" : "LLM模型啟動中"}
        </div>
      </div>
    </div>
  )
}
