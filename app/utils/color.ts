export type RGB = { r?: number; g?: number; b?: number }

const namedColors: Record<string, string> = {
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff'
}

function componentToHex(value: number): string | null {
  if (!Number.isInteger(value) || value < 0 || value > 255) return null
  return value.toString(16).padStart(2, '0')
}

export function toHex(value?: RGB | `#${string}` | string | null): string {
  if (!value) return '—'

  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    if (/^#[0-9a-f]{6}$/.test(v)) return v
    if (/^#[0-9a-f]{3}$/.test(v)) {
      return `#${v.slice(1).split('').map(c => c + c).join('')}`
    }

    const rgb = v.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)
    if (rgb) {
      const parts = rgb.slice(1).map(part => componentToHex(Number(part)))
      if (parts.every(Boolean)) return `#${parts.join('')}`
    }

    return namedColors[v] || '—'
  }

  const { r, g, b } = value
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') return '—'
  const red = componentToHex(r)
  const green = componentToHex(g)
  const blue = componentToHex(b)
  if (!red || !green || !blue) return '—'
  return `#${red}${green}${blue}`
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
