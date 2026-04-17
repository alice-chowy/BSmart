import { useEffect, useState } from "react"
import logoIcon from "@logo/LOGO_rmbg.png"

interface TierInfo {
  tier_name: string
  engine: string[]
}

interface SplashScreenProps {
  onFinish: (tierInfo?: TierInfo) => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("準備啟動中...")
  const [tierLine1, setTierLine1] = useState("")
  const [tierLine2, setTierLine2] = useState("")

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const url = `${protocol}//${window.location.host}/ws/boot`
    let finished = false
    let ws: WebSocket
    let retryTimer: ReturnType<typeof window.setTimeout> | null = null
    let capturedTierInfo: TierInfo | undefined = undefined

    function connect() {
      ws = new WebSocket(url)

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            value: number
            message: string
            tier_line1?: string
            tier_line2?: string
            tier_name?: string
            engine?: string[]
            done: boolean
            error: string | null
          }
          const pct = Math.round(data.value * 100)
          setProgress(pct)
          if (data.message) setMessage(data.message)
          if (data.tier_line1) setTierLine1(data.tier_line1)
          if (data.tier_line2) setTierLine2(data.tier_line2)

          // 捕捉 tier_name 與 engine，等 done 時一起送出
          if (data.tier_name) {
            capturedTierInfo = {
              tier_name: data.tier_name,
              engine: data.engine ?? [],
            }
          }

          if (data.done && !finished) {
            finished = true
            ws.close()
            window.setTimeout(() => onFinish(capturedTierInfo), pct >= 100 ? 1000 : 300)
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
          className="h-auto object-contain mb-[20px]"
          style={{ maxHeight: 200, maxWidth: 400 }}
        />

        <div className="flex flex-col items-center gap-3">
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

          {/* 第一行：stage 進度訊息，隨載入更新 */}
          <div
            className="text-[#4a4a8a] text-center"
            style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px" }}
          >
            {message}
          </div>

          {/* 第二行：tier 模式描述，決定後固定 */}
          {tierLine1 && (
            <div
              className="text-[#8888b0] text-center max-w-[340px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", marginTop: "-4px" }}
            >
              {tierLine1}
            </div>
          )}

          {/* 第三行：預計響應速度，決定後固定 */}
          {tierLine2 && (
            <div
              className="text-[#8888b0] text-center"
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "12px", marginTop: "-4px" }}
            >
              {tierLine2}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
