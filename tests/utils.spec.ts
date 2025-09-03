import { describe, it, expect } from 'vitest'
import { toHex } from '../app/utils/color'

describe('Color Utils', () => {
  it('should convert valid hex colors', () => {
    expect(toHex('#ff0000')).toBe('#ff0000')
    expect(toHex('#FF0000')).toBe('#ff0000')
  })

  it('should handle RGB colors', () => {
    expect(toHex('rgb(255, 0, 0)')).toBe('#ff0000')
    expect(toHex('rgb(0, 255, 0)')).toBe('#00ff00')
    expect(toHex('rgb(0, 0, 255)')).toBe('#0000ff')
  })

  it('should handle named colors', () => {
    expect(toHex('red')).toBe('#ff0000')
    expect(toHex('blue')).toBe('#0000ff')
    expect(toHex('green')).toBe('#008000')
  })

  it('should return fallback for invalid colors', () => {
    expect(toHex('invalid-color')).toBe('—')
    expect(toHex('')).toBe('—')
    expect(toHex(null as any)).toBe('—')
    expect(toHex(undefined as any)).toBe('—')
  })

  it('should handle special Telegram theme values', () => {
    expect(toHex('bg_color')).toBe('—') // Should be handled by theme system
    expect(toHex('text_color')).toBe('—') // Should be handled by theme system
  })
})

describe('Basic Functionality', () => {
  it('should handle basic JavaScript operations', () => {
    expect(1 + 1).toBe(2)
    expect('hello'.toUpperCase()).toBe('HELLO')
    expect([1, 2, 3].length).toBe(3)
  })

  it('should handle async operations', async () => {
    const promise = new Promise(resolve => setTimeout(() => resolve('done'), 10))
    const result = await promise
    expect(result).toBe('done')
  })
})
