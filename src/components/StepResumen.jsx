import { calcTotals, fmtMXN, formatFecha } from '../utils/pricing'
import NavButtons from './NavButtons'
import catalogo from '../data/catalogo.json'

const ARTE_LABELS = { generico: 'Genérico', softline: 'Softline', hardline: 'Hardline' }

function getProducto(id) {
  for (const cat of catalogo.categorias) {
    const p = cat.productos.find(p => p.id === id)
    if (p) return p
  }
  return null
}

export default function StepResumen({ order, onNext, onBack }) {
  const { subtotal, envio, total } = calcTotals(order.items)
  const itemsList = Object.entries(order.items).filter(([, v]) => v.qty > 0)
  const hasPlaceholders = itemsList.some(([, v]) => v.placeholder)

  return (
    <div className="flex flex-col flex-1 step-enter">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">

        {/* Encabezado */}
        <section className="bg-gray-50 rounded-xl p-4 space-y-2.5">
          <Row label="Campaña" value={order.campana?.nombre} />
          <Divider />
          <Row label="Fecha de campaña" value={formatFecha(order.campana?.fecha)} />
          <Divider />
          <Row label="Tienda" value={order.tienda?.nombre} />
          <Divider />
          <Row label="Contacto" value={order.contacto} />
        </section>

        {/* Artículos */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Artículos ({itemsList.length})
          </h2>
          <div className="space-y-2">
            {itemsList.map(([id, item]) => {
              const product = getProducto(id)
              return (
                <div key={id} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Arte: {ARTE_LABELS[item.arte] || item.arte}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {item.placeholder ? (
                        <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                          Por confirmar
                        </span>
                      ) : (
                        <p className="text-sm font-bold text-gray-900">
                          {fmtMXN(item.qty * item.precio)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>{item.qty} pieza{item.qty !== 1 ? 's' : ''}</span>
                    <span>× {fmtMXN(item.precio)} c/u</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Totales */}
        <section className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{fmtMXN(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span className={`font-medium ${envio === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {envio === 0 ? 'Gratis' : fmtMXN(envio)}
            </span>
          </div>
          <div className="h-px bg-gray-200 my-1" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-xl text-liverpool-black">{fmtMXN(total)}</span>
          </div>
        </section>

        {hasPlaceholders && (
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <span className="text-amber-500 text-lg leading-none mt-0.5">⚠</span>
            <p className="text-xs text-amber-800 leading-relaxed">
              Algunos artículos tienen precio pendiente de confirmar. Se actualizará antes de la entrega.
            </p>
          </div>
        )}
      </div>

      <NavButtons onNext={onNext} onBack={onBack} step={4} nextLabel="Confirmar pedido →" />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-xs font-semibold text-gray-900 text-right">{value}</span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-200" />
}
