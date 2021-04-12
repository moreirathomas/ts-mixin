import type { Ctor, Func } from "./type"

export function composeMixin<TBase extends Ctor, TMixins extends Func[]>(Base: TBase, ...mixins: TMixins) {
  return mixins.reduce((mixin, func) => func(mixin), Base)
}
