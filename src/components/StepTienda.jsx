import { useState } from 'react'
import tiendas from '../data/tiendas.json'
import NavButtons from './NavButtons'

export default function StepTienda({ order, updateOrder, onNext, onBack }) {
  const [errors, setErrors] = useState({})
  const [search, setSearch] = useState('')

  const filtered = tiendas.filter(t =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const selectTienda = (t) => {
    updateOrder({ tienda: t })
    setErrors(e => ({ ...e, tienda: false }))
  }

  const handleContacto = (e) => {
    updateOrder({ contacto: e.target.value })
    if (e.target.value.trim()) setErrors(err => ({ ...err, contacto: false }))
  }

  const handleNext = () => {
    const errs = {}
    if (!order.tienda) errs.tienda = true
    if (!order.contacto?.trim()) errs.contacto = true
    if (Object.keys(errs).length) { setErrors(errs); return }
    onNext()
  }

  return (
    <div className="flex flex-col flex-1 step-enter">
      <div className="flex-1 px-4 pt-6 pb-4 space-y-5">

        {/* Nombre contacto */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
            Tu nombre
          </label>
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={order.contacto}
            onChange={handleContacto}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
              errors.contacto
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-liverpool-magenta'
            }`}
          />
          {errors.contacto && (
            <p className="text-red-500 text-xs mt-1">Ingresa tu nombre.</p>
          )}
        </div>

        {/* Selector tienda */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
            Tienda
          </label>

          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar tienda..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-liverpool-magenta"
            />
          </div>

          {errors.tienda && (
            <p className="text-red-500 text-xs mb-2">Selecciona tu tienda.</p>
          )}

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {filtered.map((t) => {
              const selected = order.tienda?.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => selectTienda(t)}
                  className={`text-left rounded-xl border-2 px-3 py-3 transition-all duration-150 ${
                    selected
                      ? 'border-liverpool-magenta bg-liverpool-rosa-light'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className={`text-xs font-medium leading-tight ${selected ? 'text-liverpool-morado' : 'text-gray-800'}`}>
                      {t.nombre}
                    </span>
                    {selected && (
                      <div className="w-4 h-4 rounded-full bg-liverpool-magenta flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-6 text-gray-400 text-sm">
                No se encontraron tiendas.
              </div>
            )}
          </div>
        </div>
      </div>

      <NavButtons onNext={handleNext} onBack={onBack} step={2} />
    </div>
  )
}
