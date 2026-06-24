import { useState } from 'react'
import StepCampana from './components/StepCampana'
import StepTienda from './components/StepTienda'
import StepProductos from './components/StepProductos'
import StepResumen from './components/StepResumen'
import StepConfirmacion from './components/StepConfirmacion'
import Header from './components/Header'
import StepIndicator from './components/StepIndicator'

const STEPS = [
  { id: 1, label: 'Campaña' },
  { id: 2, label: 'Tienda' },
  { id: 3, label: 'Productos' },
  { id: 4, label: 'Resumen' },
  { id: 5, label: 'Confirmación' },
]

const initialOrder = {
  campana: null,
  tienda: null,
  contacto: '',
  items: {},
}

export default function App() {
  const [step, setStep] = useState(1)
  const [order, setOrder] = useState(initialOrder)

  const next = () => setStep(s => Math.min(s + 1, STEPS.length))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const updateOrder = (patch) => setOrder(o => ({ ...o, ...patch }))

  return (
    <div className="min-h-dvh flex flex-col items-center bg-[#F0F0F0]">
      <div className="w-full max-w-[430px] min-h-dvh flex flex-col bg-white shadow-sm">
        <Header step={step} steps={STEPS} />
        <StepIndicator step={step} steps={STEPS} />

        <main className="flex-1 flex flex-col">
          {step === 1 && (
            <StepCampana
              order={order}
              updateOrder={updateOrder}
              onNext={next}
            />
          )}
          {step === 2 && (
            <StepTienda
              order={order}
              updateOrder={updateOrder}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <StepProductos
              order={order}
              updateOrder={updateOrder}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 4 && (
            <StepResumen
              order={order}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 5 && (
            <StepConfirmacion
              order={order}
              onBack={back}
            />
          )}
        </main>
      </div>
    </div>
  )
}
