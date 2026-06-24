import { useState } from 'react'
import catalogo from '../data/catalogo.json'
import ProductCard from './ProductCard'
import ImageModal from './ImageModal'
import { totalQtyItem, calcTotals, fmtMXN } from '../utils/pricing'

export default function StepProductos({ order, updateOrder, onNext, onBack }) {
  const [openCats, setOpenCats] = useState({ [catalogo.categorias[0]?.id]: true })
  const [activeModal, setActiveModal] = useState(null)

  const toggleCat = (id) => setOpenCats(o => ({ ...o, [id]: !o[id] }))

  const setItem = (productId, productData) => {
    if (productData === null) {
      const next = { ...order.items }
      delete next[productId]
      updateOrder({ items: next })
    } else {
      updateOrder({ items: { ...order.items, [productId]: productData } })
    }
  }

  const totalItems = Object.values(order.items).reduce((s, i) => s + totalQtyItem(i), 0)
  const { subtotal, envio, total } = calcTotals(order.items)

  // Count active items per category for badge
  const countByCat = {}
  for (const cat of catalogo.categorias) {
    countByCat[cat.id] = cat.productos.reduce((s, p) => {
      return s + totalQtyItem(order.items[p.id])
    }, 0)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 pb-28 step-enter">
        {catalogo.categorias.map(cat => {
          const isOpen = !!openCats[cat.id]
          const catQty = countByCat[cat.id]

          return (
            <section key={cat.id} className="border-b border-gray-100 last:border-b-0">
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{cat.nombre}</span>
                  {catQty > 0 && (
                    <span className="bg-liverpool-magenta text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {catQty}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Products */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                  {cat.productos.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      item={order.items[product.id]}
                      onItemChange={(data) => setItem(product.id, data)}
                      onImageClick={() => product.imagen && setActiveModal(product)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t-2 border-gray-100 z-20">
        {totalItems > 0 && (
          <div className="px-4 pt-3 pb-1 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{totalItems} pieza{totalItems !== 1 ? 's' : ''}</span>
              <span>Subtotal: <span className="font-semibold text-gray-800">{fmtMXN(subtotal)}</span></span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Envío</span>
              <span className={envio === 0 ? 'text-green-600 font-semibold' : 'font-semibold text-gray-800'}>
                {envio === 0 ? 'Gratis' : fmtMXN(envio)}
              </span>
            </div>
          </div>
        )}
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div>
            {totalItems === 0
              ? <p className="text-sm text-gray-400">Agrega al menos un artículo</p>
              : <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="text-lg font-bold text-liverpool-magenta">{fmtMXN(total)}</span>
                </div>
            }
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 active:bg-gray-50"
            >
              Atrás
            </button>
            <button
              onClick={onNext}
              disabled={totalItems === 0}
              className="px-5 py-2.5 rounded-xl bg-liverpool-magenta text-white font-bold text-sm disabled:opacity-40 active:opacity-80"
            >
              Revisar →
            </button>
          </div>
        </div>
      </div>

      {activeModal && (
        <ImageModal product={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  )
}
