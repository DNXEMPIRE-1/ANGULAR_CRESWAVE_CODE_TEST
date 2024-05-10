import { TestBed, inject } from '@angular/core/testing';
import { ObjectUtil } from '../object.util';

describe('Util: Object', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectUtil],
    });
  });

  it('should create', inject([ObjectUtil], (service: ObjectUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('deepClone', () => {
    it('should create a deep clone of an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = ObjectUtil.deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('should create a deep clone of an array', () => {
      const arr = [1, 2, 3, { a: 1, b: 2 }];
      const clone = ObjectUtil.deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[3]).not.toBe(arr[3]);
    });

    it('should not throw an error when given a falsy value', () => {
      expect(() => ObjectUtil.deepClone(null)).not.toThrow();
      expect(() => ObjectUtil.deepClone(undefined)).not.toThrow();
    });

    it('should return the same value when given a primitive', () => {
      expect(ObjectUtil.deepClone(1)).toEqual(1);
      expect(ObjectUtil.deepClone('hello')).toEqual('hello');
      expect(ObjectUtil.deepClone(true)).toEqual(true);
    });

    it('should return the same value when given a function', () => {
      const fn = () => 'hello';
      expect(ObjectUtil.deepClone(fn)).toEqual(fn);
    });
  });

  describe('isFromEnum', () => {
    it('should return true when value is from enum', () => {
      enum TestEnum {
        One = 'one',
        Two = 'two',
      }

      expect(ObjectUtil.isFromEnum(TestEnum, 'one')).toBe(true);
    });

    it('should return false when value is not from enum', () => {
      enum TestEnum {
        One = 'one',
        Two = 'two',
      }

      expect(ObjectUtil.isFromEnum(TestEnum, 'three')).toBe(false);
    });

    it('should return false when value is not from enum and enum is empty', () => {
      enum TestEnum {}

      expect(ObjectUtil.isFromEnum(TestEnum, 'three')).toBe(false);
    });

    it('should return false when value is nullish', () => {
      enum TestEnum {}

      expect(ObjectUtil.isFromEnum(TestEnum, null)).toBe(false);
      expect(ObjectUtil.isFromEnum(TestEnum, undefined)).toBe(false);
    });
  });

  describe('shouldParseJson', () => {
    it('should return true when value is a stringified JSON', () => {
      expect(ObjectUtil.shouldParseJson('{"name":"John"}')).toBe(true);
    });

    it('should return true when value is a stringified Array', () => {
      expect(ObjectUtil.shouldParseJson('[2, 3, 5]')).toBe(true);
    });

    it('should return false when value is not a stringified JSON', () => {
      expect(ObjectUtil.shouldParseJson('John')).toBe(false);
    });
  });

  describe('getPropValue', () => {
    it('should return value of property when it exists', () => {
      const obj = { name: 'John' };
      expect(ObjectUtil.getPropValue(obj, 'name')).toBe('John');
    });

    it('should return nested property when it exists', () => {
      const obj = { user: { name: 'Nested' } };
      expect(ObjectUtil.getPropValue(obj, 'user.name')).toBe('Nested');
    });

    it('should return null when property does not exist', () => {
      const obj = { user: { name: 'John' } };
      expect(ObjectUtil.getPropValue(obj, 'user.age')).toBeNull();
    });
  });
});
