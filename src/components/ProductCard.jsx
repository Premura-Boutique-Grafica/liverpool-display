import { useRef } from 'react'
import ProductPlaceholder from './ProductPlaceholder'
import { ARTES, totalQtyItem } from '../utils/pricing'

// Chip color classes per arte
const chipStyle = {
  generico: {
    active:   'bg-gray-700   text-white  border-gray-700',
    inactive: 'bg-white      text-gray-500 border-gray-300',
    num:      'text-white',
  },
  softline: {
    active:   'bg-liverpool-morado text-white border-liverpool-morado',
    inactive: 'bg-white text-gray-500 border-gray-300',
    num:      'text-white',
  },
  hardline: {
    active:   'bg-liverpool-naranja text-white border-liverpool-naranja',
    inactive: 'bg-white text-gray-500 border-gray-300',
    num:      'text-white',
  },
}

function ArteChip({ arte, qty, onChange }) {
  const inputRef = useRef(null)
  const isActive = qty > 0
  const styles = chipStyle[arte.id]

  const setQty = (val) => {
    const n = Math.max(0, parseInt(val) || 0)
    onChange(n)
  }

  return (
    <div className={`flex items-center rounded-full border-2 transition-all duration-150 overflow-hidden ${
      isActive ? styles.active : styles.inactive
    }`}>
      {/* Label — tap to add 1 if inactive */}
      <button
        type="button"
        onClick={() => { if (!isActive) { onChange(1); setTimeout(() => inputRef.current?.select(), 50) } }}
        className="pl-3 pr-1.5 py-1.5 text-xs font-semibold leading-none select-none"
      >
        {arte.label}
      </button>

      {isActive && (
        <>
          <button
            type="button"
            onClick={() => setQty(qty - 1)}
            className="w-6 h-6 flex items-center justify-center text-base font-light leading-none opacity-80 hover:opacity-100"
            aria-label={`Quitar ${arte.label}`}
          >
            −
          </button>

          <input
            ref={inputRef}
            type="number"
            min="0"
            value={qty}
            onChange={e => setQty(e.target.value)}
            onFocus={e => e.target.select()}
            className={`w-7 text-center text-xs font-bold bg-transparent outline-none ${styles.num}`}
            aria-label={`Cantidad ${arte.label}`}
          />

          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="w-6 h-6 flex items-center justify-center text-base font-light leading-none opacity-80 hover:opacity-100 pr-1"
            aria-label={`Agregar ${arte.label}`}
          >
            +
          </button>
        </>
      )}

      {!isActive && (
        <span className="pr-3 text-xs leading-none opacity-40">+</span>
      )}
    </div>
  )
}

export default function ProductCard({ product, item, onItemChange, onImageClick }) {
  const totalQty = totalQtyItem(item)
  const isExpanded = totalQty > 0

  const getQty = (arteId) => item?.qtys?.[arteId] || 0

  const setArteQty = (arteId, qty) => {
    const newQtys = {
      generico: getQty('generico'),
      softline: getQty('softline'),
      hardline: getQty('hardline'),
      [arteId]: Math.max(0, qty),
    }
    const anyActive = Object.values(newQtys).some(q => q > 0)
    if (anyActive) {
      onItemChange({
        qtys: newQtys,
        nombre: product.nombre,
        precio: product.precio,
        placeholder: product.placeholder,
      })
    } else {
      onItemChange(null) // remove from items entirely
    }
  }

  const handleExpand = () => {
    // Open card with qty 0 showing chips — user picks which arte
    onItemChange({
      qtys: { generico: 0, softline: 0, hardline: 0 },
      nombre: product.nombre,
      precio: product.precio,
      placeholder: product.placeholder,
      _expanded: true,
    })
  }

  // "expanded but all 0" = user opened but hasn't picked yet
  const isOpenEmpty = item?._expanded && totalQty === 0

  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-150 overflow-hidden ${
      isExpanded ? 'border-liverpool-magenta' : 'border-gray-200'
    }`}>
      {/* Header row */}
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <button
          type="button"
          onClick={onImageClick}
          className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 active:opacity-80"
          aria-label={product.imagen ? `Ver imagen de ${product.nombre}` : product.nombre}
        >
          {product.imagen
            ? <img src={`/src/assets/productos/${product.imagen}`} alt={product.nombre} className="w-full h-full object-cover" />
            : <ProductPlaceholder tipo={product.tipo} />
          }
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.nombre}</h3>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {product.descripcion}
                {product.medida && <span> · {product.medida}</span>}
              </p>
            </div>

            {/* Action: expand or show total */}
            <div className="flex-shrink-0">
              {!isExpanded && !isOpenEmpty ? (
                <button
                  type="button"
                  onClick={handleExpand}
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-liverpool-magenta hover:text-liverpool-magenta transition-colors text-xl font-light"
                  aria-label={`Agregar ${product.nombre}`}
                >
                  +
                </button>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-bold text-liverpool-magenta leading-none">{totalQty}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">piezas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arte chips — visible when expanded or open-empty */}
      {(isExpanded || isOpenEmpty) && (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {ARTES.map(arte => (
              <ArteChip
                key={arte.id}
                arte={arte}
                qty={getQty(arte.id)}
                onChange={(qty) => setArteQty(arte.id, qty)}
              />
            ))}

            {/* Collapse button */}
            <button
              type="button"
              onClick={() => onItemChange(null)}
              className="text-[10px] text-gray-400 underline underline-offset-2 self-center ml-1"
            >
              quitar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
