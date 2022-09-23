
type PlainObject = Record<string, any>
type ReturnTypePromiseFunc<T> = T extends (...args: any) => Promise<infer V> ? V : T


