import { useEffect, useState } from "react"
import logoIcon from "@logo/LOGO_rmbg.png"

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("準備啟動中...")
  const [tierLine1, setTierLine1] = useState("")
  const [tierLine2, setTierLine2] = useState("")
  const [bootError, setBootError] = useState<string | null>(null)

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
            tier_line1?: string
            tier_line2?: string
            done: boolean
            error: string | null
          }
          const pct = Math.round(data.value * 100)
          setProgress(pct)
          if (data.error) {
            setBootError(data.error)
            return
          }
          if (data.message) setMessage(data.message)
          if (data.tier_line1) setTierLine1(data.tier_line1)
          if (data.tier_line2) setTierLine2(data.tier_line2)
          if (data.done && !finished) {
            finished = true
            ws.close()
            window.setTimeout(onFinish, pct >= 100 ? 1000 : 300)
          }
        } catch {
          // ignore malformed frames
        }
      }

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
          className="h-auto object-contain"
          style={{ maxHeight: 200, maxWidth: 300 }}
        />

        <div
          className="text-[#6b6b9b] text-center max-w-[320px] transition-opacity duration-500"
          style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", opacity: tierLine1 ? 1 : 0 }}
        >
          {tierLine1 || "\u00a0"}
        </div>
        <div
          className="text-[#9b9bc0] text-center transition-opacity duration-500 mb-4"
          style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", opacity: tierLine2 ? 1 : 0 }}
        >
          {tierLine2 || "\u00a0"}
        </div>

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

          {bootError && (
            <div
              className="mt-2 max-w-[288px] rounded-lg bg-[#fdecea] border border-[#f5c6c2] px-4 py-2 text-center text-[#c0392b]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px" }}
            >
              ⚠️ {bootError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}