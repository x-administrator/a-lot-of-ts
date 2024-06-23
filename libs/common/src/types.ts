// Helper type to expand nested types
export type Expand<T> = T extends object ? (T extends infer O ? { [K in keyof O]: O[K] } : never) : T;

export type ExpandDeep<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandDeep<O[K]> } : never) : T;

export type RedisConnectionOptions = {
  url: string;
  host: string;
  port: number;
  passphrase: string;
};
