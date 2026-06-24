import { useEffect } from 'react'

export default function ImageModal({ product, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        onClick={onClose}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div onClick={e => e.stopPropagation()} className="max-w-full max-h-full flex flex-col items-center gap-3">
        <img
          src={`/src/assets/productos/${product.imagen}`}
          alt={product.nombre}
          className="max-w-[380px] max-h-[70dvh] w-full object-contain rounded-xl"
        />
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{product.nombre}</p>
          <p className="text-white/60 text-xs mt-0.5">{product.descripcion}</p>
        </div>
      </div>
    </div>
  )
}
