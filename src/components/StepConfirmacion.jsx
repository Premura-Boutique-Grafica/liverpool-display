import { useMemo, useState } from 'react'
import { formatFecha, generateOrderId } from '../utils/pricing'
import config from '../data/config.json'

// TODO (Fase 2): Integración con Twist API
// Al confirmar el pedido, además de generar el mensaje de texto, crear un proyecto
// en Twist con los datos del pedido. Implementar aquí como hook post-confirmación:
//   createTwistProject({ orderId, campana, tienda, contacto, items })
// Ver documentación de la API de Twist: https://developer.twist.com/

const ARTE_LABELS = { generico: 'Genérico', softline: 'Softline', hardline: 'Hardline' }

function buildMessage(order, orderId) {
  const itemsList = Object.entries(order.items).filter(([, v]) => v.qty > 0)

  const lines = [
    `📦 PEDIDO DE MATERIAL DISPLAY`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `ID: ${orderId}`,
    ``,
    `📅 CAMPAÑA`,
    `${order.campana?.nombre} — ${formatFecha(order.campana?.fecha)}`,
    ``,
    `🏪 TIENDA`,
    `${order.tienda?.nombre}`,
    `Contacto: ${order.contacto}`,
    ``,
    `📋 ARTÍCULOS`,
    `──────────────────────`,
  ]

  for (const [, item] of itemsList) {
    lines.push(`• ${item.nombre}`)
    lines.push(`  Arte: ${ARTE_LABELS[item.arte] || item.arte}`)
    lines.push(`  Cantidad: ${item.qty} pz`)
    lines.push(`  Precio: Por confirmar`)
    lines.push(``)
  }

  lines.push(`──────────────────────`)
  lines.push(`⚠ Los precios serán confirmados por ${config.nombre_empresa} antes de procesar.`)
  lines.push(``)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`${config.nombre_empresa} × ${config.cliente}`)

  return lines.join('\n')
}

export default function StepConfirmacion({ order, onBack }) {
  const [copied, setCopied] = useState(false)
  const itemsList = Object.entries(order.items).filter(([, v]) => v.qty > 0)

  const orderId = useMemo(() => generateOrderId(order.tienda), [order.tienda])
  const message = useMemo(() => buildMessage(order, orderId), [order, orderId])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement('textarea')
      el.value = message
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const sendWhatsApp = () => {
    const encoded = encodeURIComponent(message)
    const num = config.whatsapp_numero.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${encoded}`, '_blank', 'noopener')
  }

  return (
    <div className="flex flex-col flex-1 step-enter">
      <div className="flex-1 px-4 pt-6 pb-4 space-y-5">

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 bg-liverpool-magenta rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">¡Pedido listo!</h2>
          <p className="text-sm text-gray-500">Envía o copia el pedido para que Premura lo procese</p>
        </div>

        {/* Order ID */}
        <div className="bg-liverpool-morado text-white rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-1">ID de pedido</p>
          <p className="font-mono font-bold text-sm tracking-wide">{orderId}</p>
        </div>

        {/* Receipt */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Campaña</span>
              <span className="font-semibold text-gray-900">{order.campana?.nombre}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Tienda</span>
              <span className="font-semibold text-gray-900">{order.tienda?.nombre}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Contacto</span>
              <span className="font-semibold text-gray-900">{order.contacto}</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {itemsList.map(([id, item]) => (
              <div key={id} className="px-4 py-2.5 flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 leading-snug">{item.nombre}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.qty} pz · {ARTE_LABELS[item.arte] || item.arte}
                  </p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                  Por confirmar
                </span>
              </div>
            ))}
          </div>

          <div className="bg-liverpool-rosa-light border-t border-liverpool-rosa px-4 py-3">
            <p className="text-xs text-liverpool-morado font-medium text-center">
              Premura enviará cotización formal antes de procesar
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={sendWhatsApp}
            className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2.5 active:opacity-80"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar por WhatsApp
          </button>

          <button
            onClick={copyToClipboard}
            className={`w-full py-3.5 rounded-xl border-2 font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:opacity-80 ${
              copied
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-700'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ¡Pedido copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Copiar pedido
              </>
            )}
          </button>
        </div>

        <div className="text-center pb-2">
          <button
            onClick={onBack}
            className="text-xs text-gray-400 underline underline-offset-2"
          >
            ← Volver al resumen
          </button>
        </div>
      </div>
    </div>
  )
}
