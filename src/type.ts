export type Func<T = any> = (...args: any[]) => T

export type Ctor<T = {}> = new (...args: any[]) => T

export type Mixin<T extends Func> = InstanceType<ReturnType<T>>

export type MixinClass<T, Base> = Ctor<T> & Base
