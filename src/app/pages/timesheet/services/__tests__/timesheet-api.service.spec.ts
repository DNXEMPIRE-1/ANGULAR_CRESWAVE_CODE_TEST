import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TimesheetPutDto, Timesheet, PaginatedResult, PaginationOptions } from 'src/app/models';

import { Mapper } from 'mapper-ts/lib-esm';
import { QueryUtil } from 'src/app/util';
import { assertAreEqual } from 'src/app/services/__tests__/test-utils';
import { TimesheetApiService } from '../timesheet-api.service';

describe('Service: TimesheetApi', () => {
  let service: TimesheetApiService;
  let httpMock: HttpTestingController;

  function mapItem(item: object): Timesheet {
    return new Mapper(Timesheet).map(item) as Timesheet;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimesheetApiService],
    });
    service = TestBed.inject(TimesheetApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getById', () => {
    it('should return a Timesheet', () => {
      const id = 1;
      const mockTimesheet: Timesheet = mapItem({ id: 1, date: '2023-05-10' });

      service.getById(id).then();
      const req = httpMock.expectOne(QueryUtil.buildODataQuery(service['url'], { filter: { id } }));
      expect(req.request.method).toBe('GET');
      req.flush(mockTimesheet);
    });
  });

  describe('getPaginated', () => {
    it('should return a PaginatedResult of Timesheets', () => {
      const mockPaginationOptions: PaginationOptions = { page: 1, itemsPerPage: 10 };
      const mockPaginatedResult: PaginatedResult<Timesheet> = {
        total: 1,
        items: [mapItem({ id: 1, date: '2023-05-10' })],
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
    it('should insert a new Timesheet', () => {
      const mockTimesheet: Timesheet = mapItem({ date: '2023-05-10' });
      const mockPostReturn = { id: 1 };
      service.insert(mockTimesheet).then((result) => {
        assertAreEqual(result, mockPostReturn);
      });

      const req = httpMock.expectOne(service['url']);
      expect(req.request.method).toBe('POST');
      expect(JSON.stringify(req.request.body)).toEqual(JSON.stringify(mockTimesheet));
      req.flush(mockPostReturn);
    });
  });

  describe('duplicate', () => {
    it('should duplicate an existing Timesheet', () => {
      const mockTimesheet: Timesheet = mapItem({ id: 1, date: '2023-05-10' });
      const mockPostReturn = { id: 2 };
      service.duplicate(mockTimesheet).then((result) => {
        assertAreEqual(result, mockPostReturn);
      });

      const req = httpMock.expectOne(service['url']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBeUndefined();
      req.flush(mockPostReturn);
    });
  });

  describe('update', () => {
    it('should send a PUT request to the API with the updated Timesheet', () => {
      const updatedTimesheet: Timesheet = mapItem({ id: 1, date: '2023-05-10' });
      const expectedBody: TimesheetPutDto = { id: 1, date: '2023-05-10' };

      service.update(updatedTimesheet).then(() => {
        expect().nothing();
      });

      const request = httpMock.expectOne(`${service['url']}/${updatedTimesheet.id}`);
      expect(request.request.method).toBe('PUT');
      expect(JSON.stringify(request.request.body)).toEqual(JSON.stringify(expectedBody));
      request.flush(null);
    });
  });

  describe('remove', () => {
    it('should send a DELETE request to the API with the Timesheet ID', () => {
      const id = 1;

      service.remove(id).then(() => {
        expect().nothing();
      });

      const request = httpMock.expectOne(`${service['url']}/${id}`);
      expect(request.request.method).toBe('DELETE');
      request.flush(null);
    });
  });
});
