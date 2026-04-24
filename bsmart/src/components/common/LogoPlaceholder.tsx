import logoIcon from '@logo/LOGO_icon.png'

interface LogoPlaceholderProps {
  size?: number
  loading?: boolean
}

export function LogoPlaceholder({ size = 48, loading = false }: LogoPlaceholderProps) {
  if (!loading) {
    return (
      <img
        src={logoIcon}
        alt="Logo"
        className="rounded-lg flex-shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    )
  }

  const innerSize = size * 0.9

  return (
    <div
      className="bsmart-logo-ring"
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.9)', transformOrigin: 'center' }}
    >
      <img
        src={logoIcon}
        alt="Logo"
        className="object-contain"
        style={{ width: innerSize, height: innerSize, borderRadius: 8 }}
      />
      <div className="ring-thin">
        <div className="ring-orbit-dot" />
      </div>
      <div className="ring-thick" />
    </div>
  )
}
