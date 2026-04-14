import logoIcon from '@logo/LOGO_icon.png'

interface LogoPlaceholderProps {
  size?: number
}

export function LogoPlaceholder({ size = 48 }: LogoPlaceholderProps) {
  return (
    <img
      src={logoIcon}
      alt="Logo"
      className="rounded-lg flex-shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  )
}
