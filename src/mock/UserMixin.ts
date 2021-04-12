import type { Ctor, Mixin } from "../type"

export class User {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

export type WithTimestamped = Mixin<typeof Timestamped>
export function Timestamped<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now()
  }
}

export type WithTagged = Mixin<typeof Tagged>
export function Tagged<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    tag: string | null
    constructor(...args: any[]) {
      super(...args)
      this.tag = null
    }
  }
}

export type WithActivatable = Mixin<typeof Activatable>
export function Activatable<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    isActivated = false
    toggleOnOff() {
      this.isActivated = !this.isActivated
    }
  }
}

export type WithSpecial = Mixin<typeof Special>
export function Special<TBase extends Ctor>(Base: TBase) {
  return Activatable(Tagged(Timestamped(Base)))
}

export type WithIncrementallySpecial = Mixin<typeof IncrementalSpecial>
export function IncrementalSpecial<TBase extends Ctor<WithTagged & WithTimestamped>>(Base: TBase) {
  return Activatable(Base)
}
