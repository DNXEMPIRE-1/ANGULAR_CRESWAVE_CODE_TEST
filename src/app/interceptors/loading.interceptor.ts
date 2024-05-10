import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestService, LoadingService } from '../services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private service: LoadingService, private requestService: RequestService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const [key, data] = this.service.getKeyAndLoadingByUrlFromAppRequests(request.url);
    const loadings = data?.loadings;
    if (key == null || loadings == null) return next.handle(request);

    this.service.addLoadings(key, loadings);

    return next.handle(request).pipe(
      finalize(() => {
        this.service.removeLoadingsById(key);
        this.requestService.removeRequestData(key as string);
      })
    );
  }
}
