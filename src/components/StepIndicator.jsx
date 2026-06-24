export default function StepIndicator({ step, steps }) {
  return (
    <div className="flex border-b border-gray-100">
      {steps.map((s) => (
        <div
          key={s.id}
          className={`flex-1 h-1 transition-colors duration-300 ${
            s.id <= step ? 'bg-liverpool-magenta' : 'bg-gray-100'
          }`}
        />
      ))}
    </div>
  )
}
