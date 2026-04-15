import { useEffect, useState } from "react"
import { HardDrive, Laptop, ArrowRightLeft, Search, Settings2 } from "lucide-react"
import type { Mode } from "../../types"

interface DeviceBridgeProps {
  compact?: boolean
  mode?: Mode | null
}

const BINARY_COUNT = 14

export function DeviceBridge({ compact = false, mode = null }: DeviceBridgeProps) {
  const modeKey = mode?.key ?? "scan"

  const [binaryData, setBinaryData] = useState(() =>
    Array.from({ length: BINARY_COUNT }, (_, i) => ({
      id: i,
      val: Math.round(Math.random()),
      delay: i * 0.2,
      top: Math.random() * 50 + 25,
      speed: Math.random() * 0.7 + 1.2,
    }))
  )

  useEffect(() => {
    setBinaryData(
      Array.from({ length: BINARY_COUNT }, (_, i) => ({
        id: i,
        val: Math.round(Math.random()),
        delay: i * 0.2,
        top: Math.random() * 50 + 25,
        speed: Math.random() * 0.7 + 1.2,
      }))
    )
  }, [modeKey])

  // 模式對應顏色
  const dotColor =
    modeKey === "sync"   ? "bg-purple-500" :
    modeKey === "search" ? "bg-sky-500" :
    modeKey === "manage" ? "bg-emerald-500" : "bg-indigo-500"

  const flowColor =
    modeKey === "sync"   ? "text-purple-500/40" :
    modeKey === "search" ? "text-sky-500/40" : "text-indigo-500/40"

  const flowGlow =
    modeKey === "sync"   ? "rgba(168,85,247,0.2)" :
    modeKey === "search" ? "rgba(14,165,233,0.2)" : "rgba(99,102,241,0.2)"

  const animName =
    modeKey === "sync"   ? "binaryFlowReverse" :
    modeKey === "search" ? "binaryFlowSearch"  : "binaryFlow"

  const flowStartX = modeKey === "sync" ? "62%" : "32%"

  return (
    <>
      <style>{`
        @keyframes binaryFlow {
          0%   { left: 32%; opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 62%; opacity: 0; transform: scale(1.1); }
        }
        @keyframes binaryFlowSearch {
          0%   { left: 45%; opacity: 0; transform: scale(0.5) translateY(10px); }
          50%  { opacity: 1; transform: scale(1.3) translateY(-15px); }
          100% { left: 52%; opacity: 0; transform: scale(0.5) translateY(0); }
        }
        @keyframes binaryFlowReverse {
          0%   { left: 62%; opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 32%; opacity: 0; transform: scale(1.1); }
        }
        @keyframes db-scan-line {
          0%   { top: 5%;  opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes db-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .db-animate-scan   { animation: db-scan-line 3.2s cubic-bezier(0.4,0,0.2,1) infinite; }
        .db-animate-spin-s { animation: db-spin-slow 10s linear infinite; }
      `}</style>

      {/* 外層：compact 時整體縮小，不裁切 */}
      <div className="w-full flex justify-center"
        style={{
          zoom: compact ? 0.45 : 1,
          transition: "zoom 0.7s ease-in-out",
        }}
      >
        <div
          className="relative flex items-center justify-between flex-shrink-0"
          style={{
            width: 700,
            height: 300,
          }}
        >

            {/* ── 左側：SSD ── */}
            <div className={`flex flex-col items-center gap-6 transition-all duration-500 ${modeKey === "manage" ? "opacity-40 scale-95" : ""}`}>
              <div className="relative">
                {/* search 模式：ping 圈 */}
                {modeKey === "search" && (
                  <div className="absolute inset-0 -m-4">
                    <div className="absolute inset-0 border-2 border-sky-400/30 rounded-full animate-ping" />
                    <div className="absolute inset-0 border border-sky-400/20 rounded-full animate-ping" style={{ animationDelay: "0.7s" }} />
                  </div>
                )}
                {/* scan line（非 manage 模式） */}
                {modeKey !== "manage" && (
                  <div
                    className={`db-animate-scan absolute left-0 w-full h-1.5 z-20 rounded-full shadow-[0_0_12px] transition-colors duration-500 ${
                      modeKey === "sync"   ? "bg-purple-500 shadow-purple-500" :
                      modeKey === "search" ? "bg-sky-500 shadow-sky-500" : "bg-indigo-500 shadow-indigo-500"
                    }`}
                  />
                )}
                <div className="w-32 h-44 bg-white rounded-[2rem] flex flex-col items-center justify-center border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-40 transition-colors duration-500 ${
                    modeKey === "sync" ? "from-purple-100" : modeKey === "search" ? "from-sky-100" : "from-indigo-100"
                  } to-transparent`} />
                  <HardDrive
                    size={64}
                    className={`mb-4 transition-colors duration-500 ${
                      modeKey === "sync"   ? "text-purple-600" :
                      modeKey === "search" ? "text-sky-600" : "text-slate-800"
                    }`}
                  />
                  <div className="flex gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${
                      modeKey === "manage" ? "bg-slate-300" :
                      modeKey === "sync"   ? "bg-purple-500 animate-pulse" :
                      modeKey === "search" ? "bg-sky-500 animate-pulse" : "bg-indigo-500 animate-pulse"
                    }`} />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">External SSD</span>
            </div>

            {/* ── 中間：二進位數據流 ── */}
            <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${modeKey === "manage" ? "opacity-0" : ""}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-px bg-slate-200/60" />
              {binaryData.map((d) => (
                <div
                  key={d.id}
                  className={`absolute font-mono text-[18px] font-black select-none transition-colors duration-500 ${flowColor}`}
                  style={{
                    top: `${d.top}%`,
                    left: flowStartX,
                    animationName: animName,
                    animationDuration: `${d.speed}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDelay: `${d.delay}s`,
                    opacity: 0,
                    filter: `drop-shadow(0 0 3px ${flowGlow})`,
                  }}
                >
                  {d.val}
                </div>
              ))}
            </div>

            {/* ── 右側：電腦 ── */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {/* manage 模式：旋轉圓環 */}
                {modeKey === "manage" && (
                  <div className="absolute inset-0 -m-8 flex items-center justify-center">
                    <div className="w-full h-full border-[3px] border-dashed border-emerald-500/20 rounded-full db-animate-spin-s" />
                    <div className="absolute w-[110%] h-[110%] border-t-2 border-emerald-500/40 rounded-full animate-spin" />
                  </div>
                )}
                <div className={`absolute inset-0 blur-3xl animate-pulse rounded-full transition-colors duration-500 ${
                  modeKey === "sync"   ? "bg-purple-500/5" :
                  modeKey === "search" ? "bg-sky-500/5" :
                  modeKey === "manage" ? "bg-emerald-500/10" : "bg-indigo-500/5"
                }`} />
                <div className={`w-60 h-44 bg-white border rounded-[2.5rem] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative z-10 transition-all duration-500 ${
                  modeKey === "manage" ? "border-emerald-200 shadow-emerald-100" :
                  modeKey === "search" ? "border-sky-200 shadow-sky-50" :
                  modeKey === "sync"   ? "border-purple-200 shadow-purple-50" : "border-slate-200"
                }`}>
                  <div className="w-full h-full bg-slate-50 rounded-[1.8rem] flex items-center justify-center border border-slate-100 relative overflow-hidden">
                    <Laptop size={80} className={
                      modeKey === "manage" ? "text-emerald-200" :
                      modeKey === "search" ? "text-sky-200" :
                      modeKey === "sync"   ? "text-purple-200" : "text-slate-300"
                    } />
                    <div className="absolute inset-0 grid grid-cols-5 gap-1 p-6 opacity-10">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full w-1 h-1 animate-ping ${
                            modeKey === "sync"   ? "bg-purple-600" :
                            modeKey === "search" ? "bg-sky-600" :
                            modeKey === "manage" ? "bg-emerald-600" : "bg-indigo-600"
                          }`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {modeKey === "manage" ? (
                        <Settings2 className="text-emerald-500/50 db-animate-spin-s" size={48} />
                      ) : modeKey === "search" ? (
                        <Search className="text-sky-500/40 animate-bounce" size={40} />
                      ) : (
                        <ArrowRightLeft className={`animate-pulse ${modeKey === "sync" ? "text-purple-500/30" : "text-indigo-500/30"}`} size={40} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-colors duration-500 ${
                modeKey === "manage" ? "text-emerald-600" :
                modeKey === "search" ? "text-sky-600" :
                modeKey === "sync"   ? "text-purple-600" : "text-slate-400"
              }`}>
                Local Workstation
              </span>
            </div>

        </div>
      </div>

      {/* 狀態指示點 */}
      <div className="flex justify-center -mt-2 mb-1">
        <div className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`} />
      </div>
    </>
  )
}
