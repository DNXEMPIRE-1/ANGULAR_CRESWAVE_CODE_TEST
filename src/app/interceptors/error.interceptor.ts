import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private toaster = inject(ToastService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(this.handleHttpError.bind(this)));
  }

  handleHttpError(err: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    const code = err.status;

    this.logErrors(err);
    this.notifyErrorByCode(code);

    return throwError(() => err);
  }

  notifyErrorByCode(code: number): void {
    const errorMessages: { [key: number]: string; default: string } = {
      401: 'Unauthorized access, please login or request access for this resource',
      404: 'The resource you are looking for does not exist',
      409: 'The resource you are trying to create already exists',
      400: 'Bad request, please check your input',
      default: 'Internal server error, please try again later',
    };

    this.toaster.error(errorMessages[code] || errorMessages.default);
  }

  logErrors(err: HttpErrorResponse): void {
    if (environment.production) return;

    console.table(err?.error?.errors);
  }
}
