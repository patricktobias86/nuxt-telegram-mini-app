export type RGB = { r?: number; g?: number; b?: number }

export function toHex(value?: RGB | `#${string}` | string | null): string {
  if (!value) return '—'

  if (typeof value === 'string') {
    const v = value.trim()
    return v.startsWith('#') ? v : '—'
  }

  const { r, g, b } = value
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') return '—'
  const to = (n: number) => n.toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

export function toRgb(value?: RGB | `#${string}` | string | null): { r: number; g: number; b: number } | null {
  if (!value) return null
  if (typeof value === 'string') {
    const v = value.trim()
    if (!v.startsWith('#')) return null
    const hex = v.replace('#', '')
    const clean = hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex
    if (clean.length !== 6) return null
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return { r, g, b }
  }
  const { r, g, b } = value
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') return null
  return { r, g, b }
}

