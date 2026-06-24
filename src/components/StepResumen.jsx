import { formatFecha, flattenItems } from '../utils/pricing'
import NavButtons from './NavButtons'

const arteColor = {
  'Genérico': 'bg-gray-100 text-gray-600',
  'Soft':     'bg-liverpool-rosa-light text-liverpool-morado',
  'Hard':     'bg-orange-100 text-orange-700',
}

export default function StepResumen({ order, onNext, onBack }) {
  const lines = flattenItems(order.items)

  return (
    <div className="flex flex-col flex-1 step-enter">
      <div className="flex-1 px-4 pt-5 pb-4 space-y-5">

        {/* Encabezado */}
        <section className="bg-gray-50 rounded-xl p-4 space-y-2.5">
          <Row label="Campaña" value={order.campana?.nombre} />
          <Divider />
          <Row label="Fecha" value={formatFecha(order.campana?.fecha)} />
          <Divider />
          <Row label="Tienda" value={`${order.tienda?.nombre} (#${order.tienda?.numero})`} />
          <Divider />
          <Row label="Zona" value={order.tienda?.zona} />
          <Divider />
          <Row label="Contacto" value={order.contacto} />
        </section>

        {/* Artículos */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Artículos ({lines.length} línea{lines.length !== 1 ? 's' : ''})
          </h2>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{line.nombre}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${arteColor[line.arte] || 'bg-gray-100 text-gray-600'}`}>
                      {line.arte}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{line.qty} pz</p>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                    Por confirmar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <span className="text-amber-500 text-base leading-none mt-0.5">⚠</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Los precios están pendientes de confirmación. Premura te enviará la cotización antes de procesar el pedido.
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
