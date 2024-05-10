import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tap } from 'rxjs';
import { RequestData } from 'src/app/models';
import { RequestService, LoadingService } from 'src/app/services';
import { LoadingInterceptor } from '../loading.interceptor';

describe('Interceptor: Loading', () => {
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;
  let requestService: RequestService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
        LoadingService,
        RequestService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
    requestService = TestBed.inject(RequestService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should intercept and add loadings to loadingService', () => {
    const url = 'http://example.com/api/data';
    const expectedLoadings = LoadingService.createManyFromIds(['loading1', 'loading2']);
    const requestData: RequestData = {
      loadings: expectedLoadings,
    };
    requestService.registerRequestData(url, requestData);
    httpClient
      .get(url)
      .pipe(
        tap(() => {
          const actualLoadings =
            loadingService.getKeyAndLoadingByUrlFromAppRequests(url)[1]?.loadings;
          expect(actualLoadings).toEqual(expectedLoadings);
        })
      )
      .subscribe();

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');

    request.flush({});
  });

  it('should intercept and remove loadings from loadingService on completion', () => {
    const url = 'http://example.com/api/data';
    const requestData: RequestData = {
      loadings: LoadingService.createManyFromIds(['loading1', 'loading2']),
    };
    requestService.registerRequestData(url, requestData);
    httpClient.get(url).subscribe({
      complete: () => {
        const actualLoadings =
          loadingService.getKeyAndLoadingByUrlFromAppRequests(url)[1]?.loadings;
        expect(actualLoadings).toBeFalsy();
      },
    });

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');

    request.flush({});
  });
});
