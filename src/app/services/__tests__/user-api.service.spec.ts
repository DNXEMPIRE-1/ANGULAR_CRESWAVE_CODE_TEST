import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PaginationOptions } from '../../models/configs/pagination-options';
import { User, PaginatedResult } from 'src/app/models';
import { assertAreEqual } from './test-utils';
import { QueryUtil } from 'src/app/util';
import { UserApiService } from 'src/app/pages/user/services/user-api.service';

describe('Service: UserApi', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApiService],
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getById', () => {
    it('should return a User', () => {
      const id = 1;
      const mockUser: User = { id: 1, name: 'John Doe' };

      service.getById(id).then();
      const req = httpMock.expectOne(QueryUtil.buildODataQuery(service['url'], { filter: { id } }));
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('getPaginated', () => {
    it('should return a PaginatedResult of Users', () => {
      const mockPaginationOptions: PaginationOptions = { page: 1, itemsPerPage: 10 };
      const mockPaginatedResult: PaginatedResult<User> = {
        total: 1,
        items: [{ id: 1, name: 'John Doe' }],
      };

      service.getPaginated(mockPaginationOptions).then((result) => {
        assertAreEqual(result, mockPaginatedResult);
      });

      const req = httpMock.expectOne(
        `${QueryUtil.buildPaginatedODataQuery(service['url'], mockPaginationOptions)}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResult);
    });
  });
});
