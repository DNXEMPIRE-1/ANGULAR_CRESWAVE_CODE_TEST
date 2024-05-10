import { RequestData } from '../types';

export class ApiRequest<T = unknown> {
  itemType?: Ctor<T>;
  postDto?: Ctor<unknown>;
  putDto?: Ctor<unknown>;
  item?: T;
  id?: number;
  params?: Record<string, string>;
  mapFn?: ResCallback;
  tapFn?: ResCallback;
  customData?: RequestData;

  constructor(public url: string) {}

  static get<T>(url: string, itemType: Ctor<T>, params?: Record<string, string>): ApiRequest<T> {
    return { url, itemType, params };
  }

  static getById<T>(url: string, itemType: Ctor<T>, id: number): ApiRequest<T> {
    return { url, itemType, id };
  }

  static post<T>(url: string, item: T, postDto?: Ctor<unknown>): ApiRequest<T> {
    return { url, item, postDto };
  }

  static put<T>(url: string, id: number, item: T, putDto?: Ctor<unknown>): ApiRequest<T> {
    return { url, id, item, putDto };
  }

  static delete<T>(url: string, id: number): ApiRequest<T> {
    return { url, id };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResCallback<T = unknown> = (...args: any[]) => T;

export type Ctor<T> = new (...args: unknown[]) => T;
