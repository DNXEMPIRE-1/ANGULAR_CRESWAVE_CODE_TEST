import { RouterTestingModule } from '@angular/router/testing';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthResponse, Login, Signup } from 'src/app/models';
import { Pages, StoreKeys } from 'src/app/util';
import { AuthService } from '../auth.service';
import { STORE_SERVICE } from '../interfaces';
import { LocalStorageService } from '../local-storage.service';
import { TOKEN_DECODER_FN } from '../token.service';
import { assertAreEqual } from './test-utils';
import { AuthApiService } from '../api/auth-api.service';
import { PageService } from '../page.service';
import { ToastService } from '../toast.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { noop } from 'rxjs';

describe('Service: Auth', () => {
  let service: AuthService;
  let api: AuthApiService;
  let httpMock: HttpTestingController;
  let toastService: jasmine.SpyObj<ToastService>;

  let url: string;
  const mockLogin: Login = { email: 'email', password: 'password' };
  const mockSignup: Signup = {
    email: 'email',
    password: 'password',
    name: 'name',
    userName: 'name123',
  };
  const mockToken = 'token';
  const mockResponse: AuthResponse = {
    user: { ...mockSignup, id: 1, userRoles: [] },
    token: mockToken,
  };

  beforeEach(() => {
    toastService = jasmine.createSpyObj('ToastService', ['info', 'error', 'success', 'warning']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: Pages.Home, component: class {} },
          { path: `${Pages.Auth}/${Pages.Login}`, component: class {} },
          { path: `${Pages.Auth}/${Pages.Signup}`, component: class {} },
        ]),
      ],
      providers: [
        AuthService,
        AuthApiService,
        PageService,
        {
          provide: ProfileService,
          useValue: {
            reloadUserProfiles: () => noop(),
          },
        },
        { provide: ToastService, useValue: toastService },
        { provide: STORE_SERVICE, useClass: LocalStorageService },
        { provide: TOKEN_DECODER_FN, useValue: (token: string, _: unknown) => token },
      ],
    });
    service = TestBed.inject(AuthService);
    api = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);

    url = api['url'];
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should return the access token object', (done) => {
      service.login(mockLogin).then((response) => {
        assertAreEqual(response, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should store the access tokens in local storage', (done) => {
      const expectedAccessToken = mockToken;

      service.login(mockLogin).then(() => {
        const accessToken = localStorage.getItem(StoreKeys.AccessToken);

        expect(accessToken).toBe(expectedAccessToken);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should return an error if the login fails', (done) => {
      const mockResponse = { message: 'error' };

      service.login(mockLogin).catch((error: HttpErrorResponse) => {
        assertAreEqual(error.status, 401);
        assertAreEqual(error.statusText, 'Unauthorized');
        assertAreEqual(error.error, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('signup', () => {
    it('should return the access token object', (done) => {
      service.signup(mockSignup).then((response) => {
        assertAreEqual(response, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should store the access tokens in local storage', (done) => {
      const expectedAccessToken = mockToken;

      service.signup(mockSignup).then(() => {
        const accessToken = localStorage.getItem(StoreKeys.AccessToken);

        expect(accessToken).toBe(expectedAccessToken);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should return an error if the signup fails', (done) => {
      const mockResponse = { message: 'error' };

      service.signup(mockSignup).catch((error: HttpErrorResponse) => {
        assertAreEqual(error.status, 401);
        assertAreEqual(error.statusText, 'Unauthorized');
        assertAreEqual(error.error, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove the access tokens from local storage', (done) => {
      localStorage.setItem(StoreKeys.AccessToken, 'token');
      service.logout();

      expect(localStorage.getItem(StoreKeys.AccessToken)).toBeNull();
      done();
    });
  });
});
