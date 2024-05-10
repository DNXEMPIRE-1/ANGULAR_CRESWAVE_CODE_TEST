import { Injectable } from '@angular/core';
import { ApiEndpoints, Constants } from '../util';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import {
  ODataBuilder,
  ODataFilter,
  ODataOperators,
  ODataOptions,
  ODataOrderBy,
} from 'src/app/helpers/odata';
import { OrderByConfig, TableKey } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QueryUtil {
  static buildApiUrl = (endpoint: ApiEndpoints): string => {
    const url = environment.apiUrl;

    return `${url}${endpoint}`;
  };

  static buildODataQuery = (url: string, options?: ODataOptions): string => {
    return new ODataBuilder(url).buildUrl(options);
  };

  static buildPaginatedODataQuery = (
    url: string,
    { page, itemsPerPage, options }: PaginationOptions
  ): string => {
    page ??= 1;
    itemsPerPage ??= Constants.DefaultItemsPerPage;

    const skip = (page - 1) * itemsPerPage;
    const top = itemsPerPage;

    return QueryUtil.buildODataQuery(url, { count: true, skip, top, ...options });
  };

  static orderByToOData<T>(orderBy: OrderByConfig<T> | null): ODataOrderBy | undefined {
    if (!orderBy) return undefined;

    const { key, direction } = orderBy;

    if (!Array.isArray(key)) return [String(key), direction];

    return [key as [string, string], direction];
  }

  static keyToOData<T>(key: TableKey<T>): string {
    if (!Array.isArray(key)) return String(key);

    return key.join('/');
  }

  static getDateRangeFilter = (propKey: string, from: Date, to: Date): ODataFilter => {
    return {
      [propKey]: [
        [ODataOperators.GreaterThanOrEqualTo, from],
        [ODataOperators.LessThanOrEqualTo, to],
      ],
    };
  };
}
