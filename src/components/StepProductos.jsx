import { useState } from 'react'
import catalogo from '../data/catalogo.json'
import config from '../data/config.json'
import NavButtons from './NavButtons'
import ProductCard from './ProductCard'
import ImageModal from './ImageModal'
import { calcTotals } from '../utils/pricing'

export default function StepProductos({ order, updateOrder, onNext, onBack }) {
  const [activeModal, setActiveModal] = useState(null)

  const { subtotal, envio, total } = calcTotals(order.items)

  const updateItem = (productId, field, value) => {
    updateOrder({
      items: {
        ...order.items,
        [productId]: {
          ...order.items[productId],
          [field]: value,
        },
      },
    })
  }

  const setQty = (product, qty) => {
    if (qty <= 0) {
      const next = { ...order.items }
      delete next[product.id]
      updateOrder({ items: next })
      return
    }
    updateOrder({
      items: {
        ...order.items,
        [product.id]: {
          ...order.items[product.id],
          qty,
          nombre: product.nombre,
          precio: product.precio,
          placeholder: product.placeholder,
          arte: order.items[product.id]?.arte || product.artes[0],
        },
      },
    })
  }

  const setArte = (product, arte) => {
    updateOrder({
      items: {
        ...order.items,
        [product.id]: {
          ...order.items[product.id],
          arte,
          nombre: product.nombre,
          precio: product.precio,
          placeholder: product.placeholder,
        },
      },
    })
  }

  const totalItems = Object.values(order.items).reduce((s, i) => s + (i.qty || 0), 0)
  const allPlaceholder = Object.values(order.items).every(i => i.placeholder)

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 pb-36 step-enter">
        {catalogo.categorias.map(cat => (
          <section key={cat.id} className="mb-2">
            <div className="px-4 pt-5 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {cat.nombre}
              </h2>
            </div>
            <div className="space-y-2 px-4">
              {cat.productos.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  item={order.items[product.id]}
                  onQtyChange={(qty) => setQty(product, qty)}
                  onArteChange={(arte) => setArte(product, arte)}
                  onImageClick={() => product.imagen && setActiveModal(product)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t-2 border-gray-100 z-20">
        <div className="px-4 py-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{totalItems} artículo{totalItems !== 1 ? 's' : ''} seleccionado{totalItems !== 1 ? 's' : ''}</span>
            {allPlaceholder && totalItems > 0 && (
              <span className="text-amber-600 font-medium">Precios por confirmar</span>
            )}
          </div>
        </div>
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            {totalItems === 0 ? (
              <span className="text-xs text-gray-400">Agrega al menos un artículo</span>
            ) : (
              <span className="text-sm text-gray-500">
                {totalItems} artículo{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-2">
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
