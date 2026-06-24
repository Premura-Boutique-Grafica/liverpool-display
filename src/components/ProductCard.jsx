import { useState } from 'react'
import ProductPlaceholder from './ProductPlaceholder'

const ARTE_LABELS = {
  generico: 'Genérico',
  softline: 'Softline',
  hardline: 'Hardline',
}

// Dynamic import for product images
function ProductImage({ product, onClick }) {
  const [imgError, setImgError] = useState(false)

  if (!product.imagen || imgError) {
    return (
      <button
        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50"
        onClick={onClick}
        type="button"
        aria-label={`Ver ${product.nombre}`}
      >
        <ProductPlaceholder tipo={product.tipo} />
      </button>
    )
  }

  return (
    <button
      className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 active:opacity-80"
      onClick={onClick}
      type="button"
      aria-label={`Ver imagen de ${product.nombre}`}
    >
      <img
        src={`/src/assets/productos/${product.imagen}`}
        alt={product.nombre}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </button>
  )
}

export default function ProductCard({ product, item, onQtyChange, onArteChange, onImageClick }) {
  const qty = item?.qty || 0
  const arte = item?.arte || product.artes[0]
  const hasQty = qty > 0

  return (
    <div className={`bg-white rounded-xl border-2 transition-colors duration-150 overflow-hidden ${
      hasQty ? 'border-liverpool-black' : 'border-gray-200'
    }`}>
      <div className="flex gap-3 p-3">
        <ProductImage product={product} onClick={onImageClick} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                {product.nombre}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                {product.descripcion}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {product.placeholder ? (
                <div>
                  <p className="text-xs text-gray-400 line-through">{fmtMXN(product.precio)}</p>
                  <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    Por confirmar
                  </span>
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-900">{fmtMXN(product.precio)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 pb-3 flex items-center justify-between gap-3">
        {/* Arte selector */}
        {product.artes.length > 1 ? (
          <div className="flex gap-1.5 flex-wrap">
            {product.artes.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => onArteChange(a)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  arte === a && hasQty
                    ? 'bg-liverpool-black text-liverpool-yellow border-liverpool-black'
                    : arte === a
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {ARTE_LABELS[a] || a}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">
            {ARTE_LABELS[product.artes[0]] || product.artes[0]}
          </span>
        )}

        {/* Stepper */}
        <div className="flex items-center gap-0 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={() => onQtyChange(qty - 1)}
            disabled={qty === 0}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors text-lg font-light"
            aria-label="Quitar uno"
          >
            −
          </button>
          <div className={`w-8 text-center text-sm font-bold leading-none py-2 ${
            hasQty ? 'text-liverpool-black' : 'text-gray-400'
          }`}>
            {qty}
          </div>
          <button
            type="button"
            onClick={() => onQtyChange(qty + 1)}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-light"
            aria-label="Agregar uno"
          >
            +
          </button>
        </div>
      </div>

      {hasQty && (
        <div className="px-3 pb-2.5">
          <div className="flex justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
            <span>{qty} × {fmtMXN(product.precio)}</span>
            <span className="font-semibold text-gray-800">{fmtMXN(qty * product.precio)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function fmtMXN(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(n)
}
