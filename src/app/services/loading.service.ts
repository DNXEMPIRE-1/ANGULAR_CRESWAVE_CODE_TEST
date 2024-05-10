import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppRequestData, Loading } from 'src/app/models';
import { StringUtil } from '../util';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadings$ = new BehaviorSubject<Loading[]>([]);

  constructor(private requestService: RequestService) {}

  addLoading(id: string, loading: Loading): void {
    this.loadings$.next([...this.loadings$.getValue(), { ...loading, id }]);
  }

  addLoadings(id: string, loadings: Loading[]): void {
    const loadingsToAdd = loadings.map((x) => ({ ...x, id }));

    this.loadings$.next([...this.loadings$.getValue(), ...loadingsToAdd]);
  }

  shouldBeLoading(targetElId: string | undefined): boolean {
    if (!StringUtil.notEmpty(targetElId)) return false;

    return this.getLoadingByElId(targetElId) != null;
  }

  getLoadingByElId(targetElId: string | undefined): Loading | undefined {
    if (!StringUtil.notEmpty(targetElId)) return;

    return this.loadings$.getValue().find((x) => x.targetElId === targetElId);
  }

  removeLoading(loading: Loading | undefined): void {
    if (loading == null) return;

    this.removeLoadingsById(loading.id);
  }

  removeLoadings(loadings: (Loading | undefined)[]): void {
    if (!StringUtil.notEmpty(loadings)) return;

    this.loadings$.next(
      this.loadings$.getValue().filter((x) => !loadings.some((y) => y?.id === x.id))
    );
  }

  removeLoadingsById(id: string | undefined): void {
    this.loadings$.next(this.loadings$.getValue().filter((x) => x.id !== id));
  }

  removeAllLoadings(): void {
    this.loadings$.next([]);
  }

  private getCurrentDataFromAppRequests(url: string): [string, AppRequestData] | null {
    const datas = this.requestService.getManyByUrl(url);
    return datas?.[0];
  }

  getKeyAndLoadingByUrlFromAppRequests(url: string): [string, AppRequestData] | [null, null] {
    const currentData = this.getCurrentDataFromAppRequests(url);
    if (currentData?.length !== 2) return [null, null];
    return currentData;
  }

  isLoadingById$(elId: string): Observable<boolean> {
    return this.loadings$.asObservable().pipe(map(() => this.shouldBeLoading(elId)));
  }

  isLoadingByIds$(elIds: string[]): Observable<boolean> {
    return this.loadings$
      .asObservable()
      .pipe(map(() => elIds.some(this.shouldBeLoading.bind(this))));
  }

  static createFromId(targetElId: string, size = 100): Loading {
    return {
      targetElId: targetElId,
      size,
    };
  }

  static createManyFromId(targetElId: string, size = 100): Loading[] {
    return [this.createFromId(targetElId, size)];
  }

  static createManyFromIds(targetElIds: string[], size = 100): Loading[] {
    return targetElIds.map((id) => LoadingService.createFromId(id, size));
  }
}
