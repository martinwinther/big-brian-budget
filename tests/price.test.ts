import { describe, it, expect } from 'vitest'
import { loadPriceBook, estimatePrice, computeBpk, bpkTier } from '@/lib/price'
import { computeB3DI } from '@/lib/b3di'

describe('B3DI', () => {
  it('computes 7/7 when all flags true', () => {
    expect(
      computeB3DI({
        evoo: true,
        nuts: true,
        berries: true,
        legumes: true,
        leafy_greens: true,
        whole_grains: true,
        oily_fish: true,
      })
    ).toBe(7)
  })
})

describe('Price & conversions', () => {
  const pb = loadPriceBook('dk')

  it('handles kg↔g and pc correctly', () => {
    const res = estimatePrice(
      {
        currency: 'DKK',
        pricebook_region: 'dk',
        ingredients: [
          { item: 'Whole-wheat spaghetti', unit: 'g', qty: 500 }, // 0.5 kg * 15 = 7.5
          { item: 'Garlic', unit: 'pc', qty: 2 }, // 2 * 1 = 2
        ],
      },
      2,
      pb
    )
    expect(res.total).toBeCloseTo(9.5, 2)
    expect(res.per_serving).toBeCloseTo(4.75, 2)
  })

  it('converts EVOO g→l via density', () => {
    const res = estimatePrice(
      {
        currency: 'DKK',
        pricebook_region: 'dk',
        ingredients: [{ item: 'EVOO', unit: 'g', qty: 20 }],
      },
      1,
      pb
    )
    // 20 g / 0.91 ≈ 21.98 ml = 0.02198 l * 90 ≈ 1.98
    expect(res.total!).toBeGreaterThan(1.9)
    expect(res.total!).toBeLessThan(2.1)
  })
})

describe('BPK', () => {
  it('computes and tiers correctly', () => {
    expect(computeBpk(6, 10)).toBe(0.6)
    expect(bpkTier(0.6)).toBe('excellent')
    expect(bpkTier(0.46)).toBe('great')
    expect(bpkTier(0.31)).toBe('good')
    expect(bpkTier(0.21)).toBe('fair')
    expect(bpkTier(0.19)).toBe('low')
  })
})


