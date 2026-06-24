import { useState } from 'react'
import campanas from '../data/campanas.json'
import NavButtons from './NavButtons'
import { ARTES } from '../utils/pricing'

function formatFecha(iso) {
  const [y, m, d] = iso.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                  'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

const arteChipColor = {
  generico: 'bg-gray-100 text-gray-600',
  softline: 'bg-liverpool-rosa-light text-liverpool-morado',
  hardline: 'bg-orange-100 text-orange-700',
}

const arteDesc = {
  generico: 'Logotipo de campaña. Sin beneficio',
  softline: 'Softline: ropa, calzado, accesorios',
  hardline: 'Hardline: electrónica, hogar, deportes',
}

function CampanaPanel({ campana }) {
  if (campana.imagen) {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-liverpool-magenta/20">
        <img
          src={`/src/assets/campanas/${campana.imagen}`}
          alt={`Beneficios ${campana.nombre}`}
          className="w-full object-contain max-h-56"
        />
      </div>
    )
  }

  return (
    <div className="mt-2 bg-white border border-liverpool-magenta/20 rounded-xl p-4 space-y-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tipos de gráfico</p>
      {ARTES.map(a => (
        <div key={a.id} className="flex items-center gap-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${arteChipColor[a.id]}`}>
            {a.label}
          </span>
          <span className="text-xs text-gray-500">{arteDesc[a.id]}</span>
        </div>
      ))}
    </div>
  )
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
              <div key={c.id}>
                <button
                  onClick={() => select(c)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-all duration-150 ${
                    selected
                      ? 'border-liverpool-magenta bg-liverpool-rosa-light'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${selected ? 'text-liverpool-morado' : 'text-gray-900'}`}>
                        {c.nombre}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Campaña: {formatFecha(c.fecha)}
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? 'border-liverpool-magenta bg-liverpool-magenta' : 'border-gray-300'
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                {selected && <CampanaPanel campana={c} />}
              </div>
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
