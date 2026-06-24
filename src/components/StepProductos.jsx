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
    updateItem(product.id, 'qty', qty)
    // Set default arte if not set
    if (!order.items[product.id]?.arte) {
      updateItem(product.id, 'arte', product.artes[0])
      updateItem(product.id, 'nombre', product.nombre)
      updateItem(product.id, 'precio', product.precio)
      updateItem(product.id, 'placeholder', product.placeholder)
    }
    // Store product meta alongside qty
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
            <span>{totalItems} artículo{totalItems !== 1 ? 's' : ''}</span>
            <span>Subtotal: <span className="text-gray-800 font-medium">{fmtMXN(subtotal)}</span></span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Envío</span>
            <span className={envio === 0 ? 'text-green-600 font-medium' : 'text-gray-800 font-medium'}>
              {envio === 0 ? 'Gratis' : fmtMXN(envio)}
            </span>
          </div>
          {envio > 0 && subtotal > 0 && (
            <p className="text-xs text-gray-400">
              Envío gratis a partir de {fmtMXN(config.envio.threshold_waiver)}
            </p>
          )}
        </div>
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-xl font-bold text-liverpool-black">{fmtMXN(total)}</span>
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
              className="px-5 py-2.5 rounded-xl bg-liverpool-black text-liverpool-yellow font-bold text-sm disabled:opacity-40 active:opacity-80"
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

function fmtMXN(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(n)
}
