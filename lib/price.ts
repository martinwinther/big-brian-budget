import fs from 'fs'
import path from 'path'

export type PriceBook = {
  meta: { currency: string; updated: string }
  units: {
    g_per_pc?: Record<string, number>
    g_per_ml?: Record<string, number>
  }
  items: Record<string, { unit: 'g'|'kg'|'ml'|'l'|'pc'; price: number }>
}

export type PriceInput = {
  currency: 'DKK'
  pricebook_region: 'dk'
  ingredients: Array<{ item: string; unit: string; qty: number }>
}

export type IngredientCost = {
  item: string
  qty: number
  unit: string
  unit_price: number | null
  subtotal: number | null
  note?: string
}

export type PriceResult = {
  currency: string
  total: number | null
  per_serving: number | null
  breakdown: IngredientCost[]
  warnings: string[]
}

export function loadPriceBook(region = 'dk'): PriceBook {
  const file = path.join(process.cwd(), 'data', `pricebook.${region}.json`)
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw) as PriceBook
}

function normUnit(u: string): 'g'|'kg'|'ml'|'l'|'pc' {
  const s = u.toLowerCase()
  if (['g','gram','grams'].includes(s)) return 'g'
  if (['kg','kilogram','kilograms'].includes(s)) return 'kg'
  if (['ml','milliliter','milliliters'].includes(s)) return 'ml'
  if (['l','liter','liters'].includes(s)) return 'l'
  if (['pc','pcs','piece','pieces','clove','cloves'].includes(s)) return 'pc'
  return s as any
}

function qtyToPriceUnit(
  item: string,
  qty: number,
  fromUnit: 'g'|'kg'|'ml'|'l'|'pc',
  priceUnit: 'g'|'kg'|'ml'|'l'|'pc',
  pb: PriceBook
): { qtyInPriceUnit: number, note?: string } | null {
  if (fromUnit === priceUnit) return { qtyInPriceUnit: qty }

  if (fromUnit === 'g' && priceUnit === 'kg') return { qtyInPriceUnit: qty / 1000 }
  if (fromUnit === 'kg' && priceUnit === 'g') return { qtyInPriceUnit: qty * 1000 }

  if (fromUnit === 'ml' && priceUnit === 'l') return { qtyInPriceUnit: qty / 1000 }
  if (fromUnit === 'l' && priceUnit === 'ml') return { qtyInPriceUnit: qty * 1000 }

  const gPerPc = pb.units.g_per_pc?.[item]
  if (gPerPc) {
    if (fromUnit === 'pc' && priceUnit === 'g') return { qtyInPriceUnit: qty * gPerPc, note: `~${gPerPc} g/pc` }
    if (fromUnit === 'g' && priceUnit === 'pc') return { qtyInPriceUnit: qty / gPerPc, note: `~${gPerPc} g/pc` }
  }

  const gPerMl = pb.units.g_per_ml?.[item]
  if (item === 'EVOO' && gPerMl) {
    if (fromUnit === 'g' && priceUnit === 'l') {
      const ml = qty / gPerMl
      return { qtyInPriceUnit: ml / 1000, note: `~${gPerMl} g/ml` }
    }
    if (fromUnit === 'ml' && priceUnit === 'l') return { qtyInPriceUnit: qty / 1000 }
  }

  if (item === 'Garlic' && fromUnit === 'pc' && priceUnit === 'pc') return { qtyInPriceUnit: qty }

  return null
}

export function estimatePrice(priceInputs: PriceInput, servings: number, pb: PriceBook): PriceResult {
  const breakdown: IngredientCost[] = []
  const warnings: string[] = []
  let total = 0
  let missing = false

  for (const ing of priceInputs.ingredients) {
    const item = ing.item
    const pbItem = pb.items[item]
    if (!pbItem) {
      breakdown.push({ item, qty: ing.qty, unit: ing.unit, unit_price: null, subtotal: null, note: 'Not in PriceBook' })
      missing = true
      warnings.push(`Missing price for “${item}”`)
      continue
    }

    const fromUnit = normUnit(ing.unit)
    const priceUnit = pbItem.unit
    const converted = qtyToPriceUnit(item, ing.qty, fromUnit, priceUnit, pb)

    if (!converted) {
      breakdown.push({ item, qty: ing.qty, unit: ing.unit, unit_price: pbItem.price, subtotal: null, note: `Unit conversion not supported (${ing.unit}→${priceUnit})` })
      missing = true
      warnings.push(`No conversion: ${item} ${ing.qty}${ing.unit} to ${priceUnit}`)
      continue
    }

    const qtyInPriceUnit = converted.qtyInPriceUnit
    const subtotal = qtyInPriceUnit * pbItem.price
    total += subtotal
    breakdown.push({
      item,
      qty: ing.qty,
      unit: ing.unit,
      unit_price: pbItem.price,
      subtotal,
      note: converted.note
    })
  }

  const per_serving = missing ? null : (servings > 0 ? total / servings : null)
  return {
    currency: pb.meta.currency,
    total: missing ? null : round2(total),
    per_serving: missing ? null : round2(per_serving ?? 0),
    breakdown,
    warnings
  }
}

export function computeBpk(b3diScore: number, pricePerServing: number | null): number | null {
  if (!pricePerServing || pricePerServing <= 0) return null
  return Math.round((b3diScore / pricePerServing) * 1000) / 1000
}

export type BpkTier = 'excellent'|'great'|'good'|'fair'|'low'
export function bpkTier(val: number | null): BpkTier {
  if (val === null || val < 0.2) return 'low'
  if (val < 0.3) return 'fair'
  if (val < 0.45) return 'good'
  if (val < 0.6) return 'great'
  return 'excellent'
}

function round2(n: number) { return Math.round(n * 100) / 100 }


