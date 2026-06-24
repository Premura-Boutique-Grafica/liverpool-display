import { useState } from 'react'
import campanas from '../data/campanas.json'
import NavButtons from './NavButtons'

function formatFecha(iso) {
  const [y, m, d] = iso.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                  'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

export default function StepCampana({ order, updateOrder, onNext }) {
  const [error, setError] = useState(false)
  const activas = campanas.filter(c => c.activa)

  const select = (c) => {
    updateOrder({ campana: c })
    setError(false)
  }

  const handleNext = () => {
    if (!order.campana) { setError(true); return }
    onNext()
  }

  return (
    <div className="flex flex-col flex-1 step-enter">
      <div className="flex-1 px-4 pt-6 pb-4">
        <p className="text-sm text-gray-500 mb-5">
          Selecciona la campaña para la que estás levantando tu pedido de material.
        </p>

        {activas.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm">No hay campañas activas en este momento.</p>
          </div>
        )}

        <div className="space-y-3">
          {activas.map((c) => {
            const selected = order.campana?.id === c.id
            return (
              <button
                key={c.id}
                onClick={() => select(c)}
                className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-all duration-150 ${
                  selected
                    ? 'border-liverpool-black bg-liverpool-yellow/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold text-sm ${selected ? 'text-liverpool-black' : 'text-gray-900'}`}>
                      {c.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Campaña: {formatFecha(c.fecha)}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? 'border-liverpool-black bg-liverpool-black' : 'border-gray-300'
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-liverpool-yellow" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-3 font-medium">
            Selecciona una campaña para continuar.
          </p>
        )}
      </div>

      <NavButtons onNext={handleNext} step={1} />
    </div>
  )
}
