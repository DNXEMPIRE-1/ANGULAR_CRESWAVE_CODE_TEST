export interface SelectOption<T = unknown> {
  id?: string;
  label: string;
  value: T;
}
