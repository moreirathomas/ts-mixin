import type { Ctor, Mixin } from "../type"

export function Equality<T extends Ctor<object>>(Base: T) {
  return class Equality extends Base {
    equal(another: this): boolean {
      return !this.notEqual(another)
    }

    notEqual(another: this): boolean {
      return !this.equal(another)
    }
  }
}

type Equality = Mixin<typeof Equality>

export enum Comparison {
  LT,
  EQ,
  GT,
}

export function Ordering<T extends Ctor<Equality>>(Base: T) {
  return class Ordering extends Base {
    lessOrEqual(another: this): boolean {
      if (this.equal(another) || this.compare(another) === Comparison.LT) return true

      return false
    }

    compare(another: this): Comparison {
      if (this.equal(another)) return Comparison.EQ

      if (this.lessOrEqual(another)) return Comparison.LT
      else return Comparison.GT
    }
  }
}

type Ordering = Mixin<typeof Ordering>

export const sort = (array: Ordering[]): Ordering[] => {
  return array.slice().sort((a, b) => {
    switch (a.compare(b)) {
      case Comparison.LT:
        return -1
      case Comparison.EQ:
        return 0
      case Comparison.GT:
        return 1
    }
  })
}

export class Num extends Ordering(Equality(Object)) {
  value: number

  constructor(value: number) {
    super(...arguments)

    this.value = value
  }

  equal(another: this) {
    return this.value === another.value
  }

  lessOrEqual(another: this): boolean {
    return this.value <= another.value
  }
}
