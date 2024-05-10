import { Injectable } from '@angular/core';
import { get } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class ObjectUtil {
  static deepClone<T>(obj: T): T {
    if (obj == null || obj instanceof Function) return obj;

    return JSON.parse(JSON.stringify(obj));
  }

  static isFromEnum<T extends object>(enumType: T, value: unknown): boolean {
    if (value == null) return false;

    return Object.values(enumType).includes(value);
  }

  static shouldParseJson(value: string | null | undefined): boolean {
    if (value == null) return false;
    return RegExp(/^\{.*\}$/).test(value) || RegExp(/^\[.*\]$/).test(value);
  }

  static getPropValue = (obj: object, prop: string, defaultsTo: unknown = null): unknown => {
    return get(obj, prop, defaultsTo);
  };

  static keyToProp = (key: [unknown, string]): string => {
    return key.join('.');
  };
}
