import config from '../data/config.json'

export default function Header({ step, steps }) {
  const currentStep = steps.find(s => s.id === step)

  return (
    <header className="bg-liverpool-morado sticky top-0 z-30">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-liverpool-magenta rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs leading-none">L</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            {config.cliente}
          </span>
        </div>
        <span className="text-white/30 text-xs">·</span>
        <span className="text-white/60 text-xs">
          {config.nombre_empresa}
        </span>
      </div>
      <div className="px-4 pb-3 flex items-center justify-between">
        <h1 className="text-white font-semibold text-base leading-tight">
          {currentStep?.label}
        </h1>
        <span className="text-white/40 text-xs font-medium">
          {step} / {steps.length}
        </span>
      </div>
    </header>
  )
}
