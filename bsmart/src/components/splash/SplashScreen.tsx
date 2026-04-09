import { useEffect, useState } from "react"
import logoIcon from "@logo/LOGO_rmbg.png"

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("準備啟動中...")

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const url = `${protocol}//${window.location.host}/ws/boot`
    let finished = false
    let ws: WebSocket
    let retryTimer: ReturnType<typeof window.setTimeout> | null = null

    function connect() {
      ws = new WebSocket(url)

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            value: number
            message: string
            done: boolean
            error: string | null
          }
          const pct = Math.round(data.value * 100)
          setProgress(pct)
          if (data.message) setMessage(data.message)
          if (data.done && !finished) {
            finished = true
            ws.close()
            // 若後端已跑完才連上（pct 直接就是 100），給進度條 900ms 動畫跑完再離開
            window.setTimeout(onFinish, pct >= 100 ? 1000 : 300)
          }
        } catch {
          // ignore malformed frames
        }
      }

      // 後端尚未啟動或連線中斷，1 秒後重試
      ws.onerror = () => ws.close()
      ws.onclose = () => {
        if (!finished) {
          setMessage("等待後端啟動...")
          retryTimer = window.setTimeout(connect, 1000)
        }
      }
    }

    connect()

    return () => {
      finished = true
      if (retryTimer !== null) window.clearTimeout(retryTimer)
      ws.close()
    }
  }, [onFinish])

  return (
    <div className="w-screen h-screen bg-[#D4E1F5] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          src={logoIcon}
          alt="BSMART Logo"
          className="h-auto object-contain mb-[20px]"
          style={{ maxHeight: 200, maxWidth: 400 }}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`w-[288px] h-1 rounded-full overflow-hidden relative${progress === 0 ? " animate-pulse" : ""}`}>
            <div
              className="absolute top-0 h-full rounded-full transition-[width,left] duration-[900ms] ease-out"
              style={{
                left: `${(100 - progress) / 2}%`,
                width: `${progress}%`,
                backgroundImage: "linear-gradient(90deg, #513DF7, #B63EF8, #513DF7)",
              }}
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
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}
