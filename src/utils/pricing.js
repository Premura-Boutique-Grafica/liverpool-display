import config from '../data/config.json'

export const ARTES = [
  { id: 'generico', label: 'Genérico', color: 'gray' },
  { id: 'softline', label: 'Soft',     color: 'rosa' },
  { id: 'hardline', label: 'Hard',     color: 'naranja' },
]

export function totalQtyItem(item) {
  if (!item?.qtys) return 0
  return Object.values(item.qtys).reduce((s, q) => s + (q || 0), 0)
}

export function calcTotals(items) {
  // Prices are all placeholder (0) until confirmed — shipping logic dormant
  const subtotal = Object.values(items).reduce((sum, item) => {
    const qty = totalQtyItem(item)
    return sum + qty * (item.precio || 0)
  }, 0)

  const threshold = config.envio?.threshold_waiver ?? 5000
  const costoEnvio = config.envio?.costo ?? 350
  const envio = subtotal >= threshold ? 0 : (subtotal > 0 ? costoEnvio : 0)

  return { subtotal, envio, total: subtotal + envio }
}

export function fmtMXN(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(n)
}

export function formatFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const months = ['enero','febrero','marzo','abril','mayo','junio',
                  'julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}`
}

export function generateOrderId(tienda) {
  const now = new Date()
  const id = tienda?.id?.toUpperCase().replace(/-/g, '').slice(0, 8) || 'LIV'
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('')
  return `LIV-${id}-${date}-${time}`
}

// Returns flat list of {nombre, arte, qty, precio, placeholder} for summary/message
export function flattenItems(items) {
  const arteLabel = Object.fromEntries(ARTES.map(a => [a.id, a.label]))
  const lines = []
  for (const item of Object.values(items)) {
    if (!item?.qtys) continue
    for (const [arteId, qty] of Object.entries(item.qtys)) {
      if (qty > 0) {
        lines.push({
          nombre: item.nombre,
          arte: arteLabel[arteId] || arteId,
          qty,
          precio: item.precio || 0,
          placeholder: item.placeholder,
        })
      }
    }
  }
  return lines
}
