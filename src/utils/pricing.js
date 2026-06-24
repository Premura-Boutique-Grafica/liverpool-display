import config from '../data/config.json'

export function calcTotals(items) {
  const subtotal = Object.values(items).reduce((sum, item) => {
    return sum + (item.qty || 0) * (item.precio || 0)
  }, 0)

  const threshold = config.envio?.threshold_waiver ?? 5000
  const costoEnvio = config.envio?.costo ?? 350
  const envio = subtotal >= threshold ? 0 : (subtotal > 0 ? costoEnvio : 0)
  const total = subtotal + envio

  return { subtotal, envio, total }
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
