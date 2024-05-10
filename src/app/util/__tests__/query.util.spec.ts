import { TestBed, inject } from '@angular/core/testing';
import { QueryUtil } from '../query.util';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/app/util';
import { ODataOperators } from 'src/app/helpers/odata';

describe('Util: Query', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryUtil],
    });
  });

  it('should create', inject([QueryUtil], (service: QueryUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('buildODataQuery', () => {
    it('should build an OData query string', () => {
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [[ODataOperators.GreaterThanOrEqualTo, 20]] },
        orderBy: ['name', 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc"
          .length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should remove undefined filters', () => {
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: undefined, lastName: [[ODataOperators.Contains, undefined]] },
        orderBy: ['name', 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John')",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John')&$orderby=name asc".length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle nested orderby props', () => {
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: [[ODataOperators.GreaterThanOrEqualTo, 20]] },
        orderBy: [['nested', 'prop', 'test'], 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=nested/prop/test asc',
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (age ge 20)&$orderby=nested/prop/test asc"
          .length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle date filters', () => {
      const date = new Date(2023, 4, 1);
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { date },
      });

      const expectedParams = {
        filter: '$filter=(date eq 2023-05-01)',
      };

      expect(result.length).toEqual(
        'https://example.com/odata?$filter=(date eq 2023-05-01)'.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should build an OData query string with default options when options are not provided', () => {
      const result = QueryUtil.buildODataQuery('https://example.com');
      expect(result).toEqual('https://example.com/odata');
    });

    it('should ignore undefined filters', () => {
      const result = QueryUtil.buildODataQuery('https://example.com', {
        filter: { name: 'John', age: undefined, height: [[ODataOperators.LessThanOrEqualTo, 180]] },
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (height le 180)",
      };

      expect(result.length).toEqual(
        "https://example.com/odata?$filter=(name eq 'John') and (height le 180)".length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('buildPaginatedODataQuery', () => {
    it('should build a paginated OData query string', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        page: 3,
        itemsPerPage: 10,
        options: { filter: { name: 'John' } },
      });

      const expectedParams = {
        count: '$count=true',
        filter: "$filter=(name eq 'John')",
        skip: '$skip=20',
        top: '$top=10',
      };

      expect(result.length).toEqual(
        `https://example.com/odata?$filter=(name eq 'John')&$count=true&$skip=20&$top=10`.length
      );

      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should build a paginated OData query string with default options when options are not provided', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        page: 1,
        itemsPerPage: 20,
      });

      const expectedParams = {
        count: '$count=true',
        skip: '$skip=0',
        top: '$top=20',
      };

      expect(result.length).toEqual(`https://example.com/odata?$count=true&$skip=0&$top=20`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should use default values for page and itemsPerPage when not provided', () => {
      const result = QueryUtil.buildPaginatedODataQuery('https://example.com', {
        options: { filter: { name: 'John' } },
      });
      const expectedParams = {
        count: '$count=true',
        skip: '$skip=0',
        top: '$top=10',
      };

      expect(result.length).toEqual(
        `https://example.com/odata?$filter=(name eq 'John')&$count=true&$skip=0&$top=10`.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('buildApiUrl', () => {
    const apiUrl = environment.apiUrl;

    it('should return api url concatenated with endpoint', () => {
      expect(QueryUtil.buildApiUrl('/users' as unknown as ApiEndpoints)).toBe(`${apiUrl}/users`);
    });
  });
});
