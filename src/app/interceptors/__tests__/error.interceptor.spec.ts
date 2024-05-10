import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { ErrorInterceptor } from 'src/app/interceptors';
import { ToastService } from 'src/app/services/toast.service';

describe('Interceptor: Error', () => {
  let mockToastService: ToastService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    mockToastService = {
      error: jasmine.createSpy('error'),
    } as unknown as ToastService;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should notify user and log errors if HTTP request returns an error', () => {
    const url = 'https://api.example.com/data';
    const mockErrorResponse = new HttpErrorResponse({
      error: { message: 'test error' },
      status: 500,
      statusText: 'Internal Server Error',
    });

    httpClient
      .get(url)
      .pipe(
        map(() => {
          throw mockErrorResponse;
        })
      )
      .subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
        },
      });

    const httpRequest = httpMock.expectOne(url);

    httpRequest.flush(mockErrorResponse);
  });

  it('should rethrow HTTP error if throwError method is used', () => {
    const url = 'https://api.example.com/data';
    const mockErrorResponse = new HttpErrorResponse({
      error: { message: 'test error' },
      status: 500,
      statusText: 'Internal Server Error',
    });

    httpClient
      .get(url)
      .pipe(
        map(() => {
          throw mockErrorResponse;
        })
      )
      .subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
        },
      });

    const httpRequest = httpMock.expectOne(url);

    httpRequest.flush(mockErrorResponse);
  });
});
