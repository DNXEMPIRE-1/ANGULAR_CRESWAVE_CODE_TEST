import { StoreKeys } from 'src/app/util';

export interface StoreData<T = string> {
  key: StoreKeys;
  value: T;
}

export type StoreDataTypes = 'number' | 'object' | 'array' | 'boolean';
