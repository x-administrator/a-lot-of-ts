export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type FlatMap<T extends Record<string, Record<string, unknown>>> = UnionToIntersection<
  {
    [K1 in keyof T & string]: {
      [K2 in keyof T[K1] & string]: { [KF in `${K1}.${K2}`]: T[K1][K2] };
    }[keyof T[K1] & string];
  }[keyof T & string]
>;

export type AppendStringToObjectKeys<T extends Record<string, any>, P extends string, S extends string> = {
  [K in keyof T & string as `${P}${K}${S}`]: T[K];
};

export type MoveKeyToParent<T extends Record<string, any>, Key extends string, Default extends void> = {
  [K in keyof T & string]: Key extends keyof T[K] ? T[K][Key] : Default;
};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
