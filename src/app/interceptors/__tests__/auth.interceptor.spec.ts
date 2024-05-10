/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/interceptors';
import { ApiEndpoints } from 'src/app/util';
import { TOKEN_DECODER_FN, TokenService } from 'src/app/services/token.service';

describe('Interceptor: Auth', () => {
  let mockTokenService: TokenService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    mockTokenService = {
      get authToken() {
        return undefined;
      },
    } as unknown as TokenService;
    spyOnProperty(mockTokenService, 'authToken', 'get').and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: TOKEN_DECODER_FN, useValue: (token: string, _: unknown) => token },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorization token to headers if URL is not for authentication', () => {
    const url = baseUrl + '/data';
    const mockResponse = { data: 'test' };

    httpClient.get(url).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const httpRequest = httpMock.expectOne(url);

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toEqual('Bearer test-token');

    httpRequest.flush(mockResponse);
  });

  it('should not add authorization token to headers if URL is for authentication', () => {
    const url = baseUrl + ApiEndpoints.Auth;
    const mockResponse = { token: 'test-token' };

    httpClient.post(url, {}).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const httpRequest = httpMock.expectOne(url);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();

    httpRequest.flush(mockResponse);
  });

  it('should not modify the original request response', () => {
    const authUrl = baseUrl + ApiEndpoints.Auth;
    const url = baseUrl + '/data';
    const mockResponse = { data: 'value' };
    const mockAuthResponse = { token: 'test-token' };

    httpClient.post(url, {}).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    httpClient.post(authUrl, {}).subscribe((response) => {
      expect(response).toEqual(mockAuthResponse);
    });

    const httpRequest = httpMock.expectOne(url);
    const httpAuthRequest = httpMock.expectOne(authUrl);

    httpRequest.flush(mockResponse);
    httpAuthRequest.flush(mockAuthResponse);
  });
});
