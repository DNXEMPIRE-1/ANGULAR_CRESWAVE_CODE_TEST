import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProfilePutDto, Profile, PaginatedResult } from 'src/app/models';
import { PaginationOptions } from '../../../../models/configs/pagination-options';
import { assertAreEqual } from '../../../../services/__tests__/test-utils';
import { QueryUtil } from 'src/app/util';
import { ProfileApiService } from '../profile-api.service';

describe('Service: ProfileApi', () => {
  let service: ProfileApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileApiService],
    });
    service = TestBed.inject(ProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getById', () => {
    it('should return a Profile', () => {
      const id = 1;
      const mockProfile: Profile = { id: 1, name: 'John Doe', userId: 1, timeTarget: '10:00' };

      service.getById(id).then();
      const req = httpMock.expectOne(QueryUtil.buildODataQuery(service['url'], { filter: { id } }));
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });
  });

  describe('getPaginated', () => {
    it('should return a PaginatedResult of Profiles', () => {
      const mockPaginationOptions: PaginationOptions = { page: 1, itemsPerPage: 10 };
      const mockPaginatedResult: PaginatedResult<Profile> = {
        total: 1,
        items: [{ id: 1, name: 'John Doe', userId: 1, timeTarget: '10:00' }],
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

  describe('insert', () => {
    it('should insert a new Profile', () => {
      const mockProfile: Profile = { name: 'John Doe', timeTarget: '10:00' };
      const mockPostReturn = { id: 1 };
      service.insert(mockProfile).then((result) => {
        assertAreEqual(result, mockPostReturn);
      });

      const req = httpMock.expectOne(service['url']);
      expect(req.request.method).toBe('POST');
      expect(JSON.stringify(req.request.body)).toEqual(JSON.stringify(mockProfile));
      req.flush(mockPostReturn);
    });
  });

  describe('duplicate', () => {
    it('should duplicate an existing Profile', () => {
      const mockProfile: Profile = { id: 1, name: 'John Doe', userId: 1, timeTarget: '10:00' };
      const mockPostReturn = { id: 2 };
      service.duplicate(mockProfile).then((result) => {
        assertAreEqual(result, mockPostReturn);
      });

      const req = httpMock.expectOne(service['url']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBeUndefined();
      req.flush(mockPostReturn);
    });
  });

  describe('update', () => {
    it('should send a PUT request to the API with the updated profile', () => {
      const updatedProfile: Profile = { id: 1, name: 'Updated Profile' };
      const expectedBody: ProfilePutDto = { id: 1, name: 'Updated Profile' };

      service.update(updatedProfile).then(() => {
        expect().nothing();
      });

      const request = httpMock.expectOne(`${service['url']}/${updatedProfile.id}`);
      expect(request.request.method).toBe('PUT');
      expect(JSON.stringify(request.request.body)).toEqual(JSON.stringify(expectedBody));
      request.flush(null);
    });
  });

  describe('remove', () => {
    it('should send a DELETE request to the API with the profile ID', () => {
      const profileId = 1;

      service.remove(profileId).then(() => {
        expect().nothing();
      });

      const request = httpMock.expectOne(`${service['url']}/${profileId}`);
      expect(request.request.method).toBe('DELETE');
      request.flush(null);
    });
  });
});
