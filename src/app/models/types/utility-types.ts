export type Nullish = null | undefined;

export type AsNonNullable<T> = {
  [TKey in keyof T]: NonNullable<T[TKey]>;
};

export type CSSProps = {
  [key in keyof CSSStyleDeclaration]?: string | number;
};
