import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageData } from '../models';
import { DetailsTypes, paths } from '../util';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  goToHome = () => this.router.navigate([paths.home]);
  goToLogin = () => this.router.navigate([paths.login]);

  getParam = (param: string) => this.getUrlTree().queryParams[param];

  addParams = (activeRoute: ActivatedRoute, params: Params) => {
    this.router.navigate(['.'], {
      relativeTo: activeRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  };

  getQueryParamsObservable() {
    return this.activatedRoute.queryParams;
  }

  getQueryParamsObservableForUrl(url: string) {
    return this.getQueryParamsObservable().pipe(filter(() => this.getPathWithoutParams() === url));
  }

  getDetailsUrlParams(): PageData {
    return {
      id: this.getParam('id'),
      type: this.getParam('type') as DetailsTypes,
    };
  }

  getUrlTree = () => this.router.parseUrl(this.router.url);

  getParams = () => this.getUrlTree().queryParams;

  getUrlWithoutParams = () =>
    this.getUrlTree()
      .root.children['primary']?.segments?.map((it) => it.path)
      .join('/');

  getPathWithoutParams = () => '/' + this.getUrlWithoutParams();

  buildDetailsUrl = (url: string, id: number, type: DetailsTypes) => `${url}?id=${id}&type=${type}`;
}
