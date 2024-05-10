import { Inject, Injectable, InjectionToken } from '@angular/core';
import { InvalidStoreError } from '../helpers/errors';
import { StoreData, StoreDataTypes } from 'src/app/models';
import { ObjectUtil, StoreKeys } from '../util';
import { StoreService } from './interfaces';

export const LOCAL_STORAGE = new InjectionToken<Storage>('localStorage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable()
export class LocalStorageService implements StoreService {
  constructor(@Inject(LOCAL_STORAGE) private _localStorage: Storage) {}

  getMany<T = unknown>(
    keyDatas: { key: StoreKeys; type?: StoreDataTypes }[]
  ): Record<StoreKeys, T | null> {
    const values: Record<string, T | null> = {};
    keyDatas.forEach(({ key, type }) => {
      values[key] = this.get<T>(key, type);
    });
    return values;
  }

  get<T = unknown>(key: StoreKeys, type?: StoreDataTypes): T | null {
    this.validate(key);

    const value = this._localStorage.getItem(key);

    return this.parseValue(value, type);
  }

  store<T>(data: StoreData<T>) {
    const { key, value } = this.retrieveFromData(data);

    this._localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
  }

  remove(key: StoreKeys): void {
    this.validate(key);

    this._localStorage.removeItem(key);
  }

  clear(): void {
    this._localStorage.clear();
  }

  private parseValue(value: string | null, type?: StoreDataTypes) {
    if (value == null) return value;

    const typeParsers = {
      number: (value: string) => Number(value),
      boolean: (value: string) => value === 'true',
      array: (value: string) => JSON.parse(value),
      object: (value: string) => typeParsers.array(value),
      default: (value: string) => value,
    };

    return typeParsers[type ?? 'default'](value);
  }

  private retrieveFromData<T>(data: StoreData<T>): StoreData<T> | never {
    const key = data?.key;
    const value = data?.value;

    this.validate(key, value);
    return { key, value };
  }

  private validate(key: unknown, value?: unknown): void | never {
    const isValidKey = this.isValidKey(key);
    if (isValidKey) return;

    const reason = this.getErrorReason(key, isValidKey);

    throw new InvalidStoreError(key, value, reason);
  }

  private isValidKey(key: unknown): boolean {
    return ObjectUtil.isFromEnum(StoreKeys, key);
  }

  private getErrorReason(key: unknown, isValidKey: boolean) {
    return isValidKey ? '' : `${key} is not a valid key, it must be registered in StoreKeys`;
  }
}
