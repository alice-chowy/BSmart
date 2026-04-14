import { useEffect, useState } from 'react'

interface AutoScaleOptions {
  designWidth?: number
  designHeight?: number
}

interface AutoScaleResult {
  scale: number
  offsetX: number
  offsetY: number
}

export function useAutoScale({
  designWidth = 1920,
  designHeight = 1080,
}: AutoScaleOptions = {}): AutoScaleResult {
  const compute = (): AutoScaleResult => {
    const scale = Math.min(
      window.innerWidth / designWidth,
      window.innerHeight / designHeight,
    )
    const offsetX = (window.innerWidth - designWidth * scale) / 2
    const offsetY = (window.innerHeight - designHeight * scale) / 2
    return { scale, offsetX, offsetY }
  }

  const [state, setState] = useState<AutoScaleResult>(compute)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setState(compute), 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designWidth, designHeight])

  return state
}
