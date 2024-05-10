import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services';
import { ApiEndpoints } from '../util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url;

    if (url.includes(ApiEndpoints.Auth)) return next.handle(request);

    const newRequest = this.cloneWithToken(request);

    return next.handle(newRequest);
  }

  cloneWithToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.tokenService.authToken;

    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
