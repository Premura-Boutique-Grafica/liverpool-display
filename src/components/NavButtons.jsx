export default function NavButtons({ onNext, onBack, step, nextLabel = 'Siguiente →', disabled = false }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3 z-10">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 active:bg-gray-50"
        >
          ← Atrás
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-opacity bg-liverpool-magenta text-white disabled:opacity-40 active:opacity-80"
      >
        {nextLabel}
      </button>
    </div>
  )
}
