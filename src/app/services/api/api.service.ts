import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mapper } from 'mapper-ts/lib-esm';
import { Observable, lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiRequest, ErrorMessages, Requests } from 'src/app/models';
import { Ctor, PaginatedResult, PostReturn } from 'src/app/models';
import { RequestService } from '../request.service';
import { QueryUtil } from 'src/app/util';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private requestService: RequestService) {}

  async get<T>(apiReq: ApiRequest<T>): Promise<T[]> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }

    const reqData = { ...apiReq };
    const req$ = this._getRequest(reqData);

    return this._returnAsync(req$, reqData) as Promise<T[]>;
  }

  async getOData<T>(apiReq: ApiRequest<T>): Promise<T[]> {
    return this.get({ ...apiReq, url: `${apiReq.url}/odata` });
  }

  async getPaginated<T>(apiReq: ApiRequest<T>): Promise<PaginatedResult<T>> {
    if (!this.isValidRequest[Requests.Get](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }

    const req$ = this._getPaginatedRequest<T>(apiReq);

    return this._returnAsync(req$, apiReq) as Promise<PaginatedResult<T>>;
  }

  async getById<T>(apiReq: ApiRequest<T>): Promise<T> {
    if (!this.isValidRequest[Requests.GetById](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }

    const url = QueryUtil.buildODataQuery(apiReq.url, { filter: { id: apiReq.id } });
    const reqData = {
      ...apiReq,
      url,
    };
    const req$ = this._getRequest<T>(reqData).pipe(map((res: T[]) => res?.[0]));

    return this._returnAsync(req$, reqData) as Promise<T>;
  }

  async insert<TBody, TReturn = PostReturn>(apiReq: ApiRequest<TBody>): Promise<TReturn> {
    if (!this.isValidRequest[Requests.Post](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }

    const req$ = this.postRequest<TBody>(apiReq);

    return this._returnAsync(req$, apiReq) as Promise<TReturn>;
  }

  async update<T>(apiReq: ApiRequest<T>): Promise<void> {
    if (!this.isValidRequest[Requests.Put](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }
    const reqData = { ...apiReq, url: this.urlWithId(apiReq) };
    const req$ = this.putRequest<T>(reqData);

    return this._returnAsync(req$, reqData) as Promise<void>;
  }

  async patch<T>(apiReq: ApiRequest<T>): Promise<void> {
    if (!this.isValidRequest[Requests.Patch](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }
    const reqData = { ...apiReq, url: this.urlWithId(apiReq) };
    const req$ = this.patchRequest<T>(reqData);

    return this._returnAsync(req$, reqData) as Promise<void>;
  }

  async remove<T>(apiReq: ApiRequest<T>): Promise<void> {
    if (!this.isValidRequest[Requests.Delete](apiReq)) {
      return this.handleInvalidServiceRequest(apiReq);
    }
    const reqData = { ...apiReq, url: this.urlWithId(apiReq) };
    const req$ = this.deleteRequest<T>(reqData);

    return this._returnAsync(req$, reqData) as Promise<void>;
  }

  private handleInvalidRequestError(apiReq: ApiRequest): void {
    console.error('Invalid request!', apiReq);
  }

  handleInvalidServiceRequest(apiReq: ApiRequest): Promise<never> {
    this.handleInvalidRequestError(apiReq);

    return Promise.reject(ErrorMessages.InvalidServiceRequest);
  }

  private _getRequest<T>({ url, itemType, params }: ApiRequest<T>): Observable<T[]> {
    return this.http.get<T[]>(url, { params }).pipe(
      map((data) => {
        return this._mapOrSelf(data, itemType as Ctor<T[]>);
      })
    ) as unknown as Observable<T[]>;
  }

  private _getPaginatedRequest<T>({
    url,
    itemType,
    params,
  }: ApiRequest): Observable<PaginatedResult<T>> {
    return this.http.get<PaginatedResult<T>>(url, { params }).pipe(
      map((data) => {
        if (!itemType) return data;

        return {
          total: data.total,
          items: new Mapper(itemType).map(data.items),
        };
      })
    ) as unknown as Observable<PaginatedResult<T>>;
  }

  private postRequest<T>({ url, item, postDto }: ApiRequest<T>): Observable<T> {
    if (!item) throw new Error(ErrorMessages.InvalidServiceRequest);

    return this.http.post<T>(url, this._mapOrSelf(item, postDto));
  }

  private putRequest<T>({ url, item, putDto }: ApiRequest<T>): Observable<T> {
    if (!item) throw new Error(ErrorMessages.InvalidServiceRequest);

    return this.http.put<T>(url, this._mapOrSelf(item, putDto));
  }

  private patchRequest<T>({ url, item, putDto }: ApiRequest<T>): Observable<T> {
    if (!item) throw new Error(ErrorMessages.InvalidServiceRequest);

    return this.http.patch<T>(url, this._mapOrSelf(item, putDto));
  }

  private deleteRequest<T>({ url }: ApiRequest<T>): Observable<T> {
    return this.http.delete<T>(url);
  }

  private _mapOrSelf<T>(item: T, itemType?: Ctor<T>): T {
    if (!item || !itemType) return item;

    return new Mapper(itemType).map(item) as unknown as T;
  }

  private async _returnAsync(req$: Observable<unknown>, apiReq: ApiRequest): Promise<unknown> {
    const { mapFn, tapFn, customData, url } = apiReq;

    this.requestService.registerRequestData(url, customData);

    const piped$ = req$.pipe(
      map((res) => (mapFn != null ? mapFn(res) : res)),
      tap((res) => (tapFn != null ? tapFn(res) : res))
    );

    return lastValueFrom(piped$);
  }

  private urlWithId = (apiReq: ApiRequest): string => `${apiReq.url}/${apiReq.id}`;

  isValidRequest = {
    [Requests.Get]: ({ url }: ApiRequest) => url,
    [Requests.GetById]: ({ url, id }: ApiRequest) => url && id,
    [Requests.Post]: ({ url, item }: ApiRequest) => url && item,
    [Requests.Put]: ({ url, id, item }: ApiRequest) => url && id && item,
    [Requests.Patch]: ({ url, id, item }: ApiRequest) => url && id && item,
    [Requests.Delete]: ({ url, id }: ApiRequest) => url && id,
  };
}
