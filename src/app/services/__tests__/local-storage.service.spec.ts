import { TestBed } from '@angular/core/testing';
import { StoreKeys } from 'src/app/util';
import { LOCAL_STORAGE, LocalStorageService } from '../local-storage.service';
import { StoreData, StoreDataTypes } from 'src/app/models';
import { assertAreEqual } from './test-utils';

describe('Service: LocalStorage', () => {
  let service: LocalStorageService;
  let _localStorage: Storage;

  function setItemAndGet(key: StoreKeys, value: unknown, type?: StoreDataTypes): unknown {
    service.store({ key, value });

    return service.get(key, type);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
    _localStorage = TestBed.inject(LOCAL_STORAGE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    _localStorage.clear();
  });

  describe('store', () => {
    it('should store the value in localStorage', () => {
      const key = StoreKeys.AccessToken;
      const value = 'token-value';
      service.store({ key, value });
      expect(_localStorage.getItem(key)).toBe(value);
    });

    it('should throw an error if data is nullish', () => {
      expect(() => service.store(null as unknown as StoreData)).toThrowError();
      expect(() => service.store(undefined as unknown as StoreData)).toThrowError();
    });

    it('should throw an error if the key is not in StoreKeys', () => {
      const key = 'invalid-key' as StoreKeys;
      const value = 'token-value';

      expect(() => service.store({ key, value })).toThrowError();
    });
  });

  describe('get', () => {
    it("should return the value with it's correct types from localStorage", () => {
      const key = StoreKeys.AccessToken;
      const valuesAndTypes: { value: unknown; type?: StoreDataTypes }[] = [
        { value: 'token-value' },
        { value: 20, type: 'number' },
        { value: { id: 1, name: 'name' }, type: 'object' },
        { value: true, type: 'boolean' },
        { value: null, type: 'object' },
      ];

      for (const { value, type } of valuesAndTypes) {
        const result = setItemAndGet(key, value, type);

        expect(_localStorage.getItem(key)).toBe(type ? JSON.stringify(result) : (result as string));
        assertAreEqual(result, value);
      }
    });

    it('should throw an error if the key is not in StoreKeys', () => {
      const key = 'invalid-key' as StoreKeys;

      expect(() => service.get(key)).toThrowError();
    });
  });

  describe('getMany', () => {
    it('should return the values from localStorage', () => {
      const key = StoreKeys.AccessToken;
      const key2 = StoreKeys.RefreshToken;
      const values = ['token-value', 'token-value2'];
      const expected: Record<string, unknown> = {
        [StoreKeys.AccessToken]: values[0],
        [StoreKeys.RefreshToken]: values[1],
      };

      service.store({ key, value: values[0] });
      service.store({ key: key2, value: values[1] });

      const result = service.getMany([{ key }, { key: key2 }]);

      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove the value from localStorage', () => {
      const key = StoreKeys.AccessToken;
      const value = 'token-value';

      _localStorage.setItem(key, value);

      expect(_localStorage.getItem(key)).toBe(value);

      service.remove(key);

      expect(_localStorage.getItem(key)).toBeNull();
    });

    it('should throw an error if the key is not in StoreKeys', () => {
      const key = 'invalid-key' as StoreKeys;

      expect(() => service.remove(key)).toThrowError();
    });
  });

  describe('clear', () => {
    it('should clear the localStorage', () => {
      const key = StoreKeys.AccessToken;
      const value = 'token-value';
      const key2 = StoreKeys.RefreshToken;
      const value2 = 'token-value2';

      _localStorage.setItem(key, value);
      _localStorage.setItem(key2, value2);

      expect(_localStorage.getItem(key)).toBe(value);
      expect(_localStorage.getItem(key2)).toBe(value2);

      service.clear();

      expect(_localStorage.getItem(key)).toBeNull();
      expect(_localStorage.getItem(key2)).toBeNull();
    });
  });
});
