import { calcTotals, fmtMXN, formatFecha } from '../utils/pricing'
import NavButtons from './NavButtons'

const ARTE_LABELS = { generico: 'Genérico', softline: 'Softline', hardline: 'Hardline' }

export default function StepResumen({ order, onNext, onBack }) {
  const itemsList = Object.entries(order.items).filter(([, v]) => v.qty > 0)

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
            {itemsList.map(([id, item]) => (
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
                  <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0">
                    Por confirmar
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {item.qty} pieza{item.qty !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nota precios */}
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <span className="text-amber-500 text-base leading-none mt-0.5">⚠</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Los precios de todos los artículos están pendientes de confirmación. Premura te enviará la cotización formal antes de procesar el pedido.
          </p>
        </div>
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
