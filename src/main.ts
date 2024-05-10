import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { SharedModule } from './app/shared';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { TOKEN_DECODER_FN } from './app/services/token.service';
import { LocalStorageService } from './app/services';
import { STORE_SERVICE } from './app/services/interfaces';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { LoadingInterceptor } from './app/interceptors/loading.interceptor';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import jwtDecode from 'jwt-decode';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, SharedModule, AppRoutingModule, MatNativeDateModule),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: STORE_SERVICE, useClass: LocalStorageService },
    { provide: TOKEN_DECODER_FN, useValue: jwtDecode },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
