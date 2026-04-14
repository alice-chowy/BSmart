import { useEffect, type ReactNode } from 'react'
import { useAutoScale } from '../../hooks/useAutoScale'

interface ScaleWrapperProps {
  designWidth?: number
  designHeight?: number
  children: ReactNode
}

export function ScaleWrapper({
  designWidth = 1920,
  designHeight = 1080,
  children,
}: ScaleWrapperProps) {
  const { scale, offsetX, offsetY } = useAutoScale({ designWidth, designHeight })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: designWidth,
        height: designHeight,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        translate: `${offsetX}px ${offsetY}px`,
      }}
    >
      {children}
    </div>
  )
}
