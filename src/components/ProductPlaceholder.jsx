const icons = {
  piso: (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 text-gray-400">
      <rect x="8" y="6" width="24" height="4" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="8" y="14" width="24" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="22" width="24" height="4" rx="1" fill="currentColor" opacity="0.25"/>
      <rect x="17" y="30" width="6" height="4" rx="1" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  mueble: (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 text-gray-400">
      <rect x="6" y="10" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <rect x="6" y="10" width="28" height="5" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="10" y="28" width="4" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="26" y="28" width="4" height="4" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  barra: (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 text-gray-400">
      <rect x="5" y="22" width="30" height="6" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="5" y="16" width="30" height="6" rx="0" fill="currentColor" opacity="0.25"/>
      <rect x="9" y="28" width="3" height="6" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="28" y="28" width="3" height="6" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  colgante: (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 text-gray-400">
      <line x1="20" y1="4" x2="20" y2="12" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <rect x="10" y="12" width="20" height="22" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <line x1="13" y1="19" x2="27" y2="19" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="13" y1="24" x2="27" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
    </svg>
  ),
}

export default function ProductPlaceholder({ tipo }) {
  const icon = icons[tipo] || icons.piso

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      {icon}
    </div>
  )
}
