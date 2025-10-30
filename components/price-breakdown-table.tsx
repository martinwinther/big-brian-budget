import { IngredientCost } from '@/lib/price'

export default function PriceBreakdownTable({
  currency,
  rows,
  total,
}: { currency: string; rows: IngredientCost[]; total: number | null }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <caption className="sr-only">Ingredient cost breakdown</caption>
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Ingredient</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2 text-right">Unit price</th>
            <th className="px-3 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-t">
              <td className="px-3 py-2">
                <div className="flex flex-col">
                  <span>{r.item}</span>
                  {r.note ? (
                    <span className="text-xs text-muted-foreground">{r.note}</span>
                  ) : null}
                </div>
              </td>
              <td className="px-3 py-2 text-right">
                {r.qty} {r.unit}
              </td>
              <td className="px-3 py-2 text-right">
                {r.unit_price !== null ? `${currency} ${r.unit_price.toFixed(2)}` : '—'}
              </td>
              <td className="px-3 py-2 text-right">
                {r.subtotal !== null ? `${currency} ${r.subtotal.toFixed(2)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t bg-muted/30">
          <tr>
            <td className="px-3 py-2 font-medium" colSpan={3}>
              Total
            </td>
            <td className="px-3 py-2 text-right font-semibold">
              {total !== null ? `${currency} ${total.toFixed(2)}` : '—'}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}


