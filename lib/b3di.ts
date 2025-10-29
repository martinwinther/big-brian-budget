export type B3DIFlags = {
  evoo?: boolean
  nuts?: boolean
  berries?: boolean
  legumes?: boolean
  leafy_greens?: boolean
  whole_grains?: boolean
  oily_fish?: boolean
}

export function computeB3DI(flags: B3DIFlags | undefined): number {
  if (!flags) return 0

  return (
    (flags.evoo ? 1 : 0) +
    (flags.nuts ? 1 : 0) +
    (flags.berries ? 1 : 0) +
    (flags.legumes ? 1 : 0) +
    (flags.leafy_greens ? 1 : 0) +
    (flags.whole_grains ? 1 : 0) +
    (flags.oily_fish ? 1 : 0)
  )
}
