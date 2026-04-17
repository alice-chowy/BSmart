import { useEffect } from "react"
import type { RefObject } from "react"

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
) {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!ref.current) return
      const target = event.target
      if (target instanceof Node && !ref.current.contains(target)) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [callback, ref])
}
