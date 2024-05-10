import { OrderByConfig } from 'src/app/models';
import { ArrayUtil } from '../array.util';
import { TestBed, inject } from '@angular/core/testing';
import { assertAreEqual } from 'src/app/services/__tests__/test-utils';

describe('Util: Array', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArrayUtil],
    });
  });

  it('should create', inject([ArrayUtil], (service: ArrayUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('areEqualShallow', () => {
    it('should return true when arrays are equal', () => {
      expect(ArrayUtil.areEqualShallow([1, 2, 3], [1, 2, 3])).toBeTrue();
      expect(ArrayUtil.areEqualShallow(['a', 'b', 'c'], ['a', 'b', 'c'])).toBeTrue();
      expect(ArrayUtil.areEqualShallow([true, false], [true, false])).toBeTrue();
    });

    it('should return false when arrays are not equal', () => {
      expect(ArrayUtil.areEqualShallow([1, 2, 3], [1, 2])).toBeFalse();
      expect(ArrayUtil.areEqualShallow([1, 2, 3], [1, 2, 4])).toBeFalse();
      expect(ArrayUtil.areEqualShallow(['a', 'b', 'c'], ['a', 'b', 'd'])).toBeFalse();
      expect(ArrayUtil.areEqualShallow([true, false], [true, true])).toBeFalse();
    });

    it('should return false when one or both of the arrays are null', () => {
      const nullArr = null as unknown as unknown[];

      expect(ArrayUtil.areEqualShallow(nullArr, [1, 2, 3])).toBeFalse();
      expect(ArrayUtil.areEqualShallow([1, 2, 3], nullArr)).toBeFalse();
      expect(ArrayUtil.areEqualShallow(nullArr, nullArr)).toBeFalse();
    });
  });

  describe('areEqualDeep', () => {
    it('should return true when arrays are equal', () => {
      expect(ArrayUtil.areEqualDeep([1, 2, 3], [1, 2, 3])).toBeTrue();
      expect(ArrayUtil.areEqualDeep(['a', 'b', 'c'], ['a', 'b', 'c'])).toBeTrue();
      expect(ArrayUtil.areEqualDeep([true, false], [true, false])).toBeTrue();
      expect(ArrayUtil.areEqualDeep([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBeTrue();
      expect(
        ArrayUtil.areEqualDeep(
          [
            [1, 2],
            [3, 4],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBeTrue();
    });

    it('should return false when arrays are not equal', () => {
      expect(ArrayUtil.areEqualDeep([1, 2, 3], [1, 2])).toBeFalse();
      expect(ArrayUtil.areEqualDeep([1, 2, 3], [1, 2, 4])).toBeFalse();
      expect(ArrayUtil.areEqualDeep(['a', 'b', 'c'], ['a', 'b', 'd'])).toBeFalse();
      expect(ArrayUtil.areEqualDeep([true, false], [true, true])).toBeFalse();
      expect(ArrayUtil.areEqualDeep([{ a: 1 }, { b: 20 }], [{ a: 1 }, { b: 2 }])).toBeFalse();
      expect(
        ArrayUtil.areEqualDeep(
          [
            [1, 2],
            [3, 5],
          ],
          [
            [1, 2],
            [3, 4],
          ]
        )
      ).toBeFalse();
    });

    it('should return false when one or both of the arrays are null', () => {
      const nullArr = null as unknown as unknown[];

      expect(ArrayUtil.areEqualDeep(nullArr, [1, 2, 3])).toBeFalse();
      expect(ArrayUtil.areEqualDeep([1, 2, 3], nullArr)).toBeFalse();
      expect(ArrayUtil.areEqualDeep(nullArr, nullArr)).toBeFalse();
    });
  });

  describe('sumNumberProp', () => {
    it('should return the sum of the property of each item in the array', () => {
      expect(
        ArrayUtil.sumNumberProp(
          [
            { a: 1, b: 0, c: 0 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'a'
        )
      ).toBe(6);
      expect(
        ArrayUtil.sumNumberProp(
          [
            { a: 1, b: 0, c: 0 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'b'
        )
      ).toBe(0);
      expect(
        ArrayUtil.sumNumberProp(
          [
            { a: 1, b: 0, c: 10 },
            { a: 2, b: 0, c: 0 },
            { a: 3, b: 0, c: 0 },
          ],
          'c'
        )
      ).toBe(10);
    });

    it('should return 0 when the array is empty or nullish', () => {
      expect(ArrayUtil.sumNumberProp([], 'a')).toBe(0);
      expect(ArrayUtil.sumNumberProp(null as unknown as { a: number }[], 'a')).toBe(0);
      expect(ArrayUtil.sumNumberProp(undefined as unknown as { a: number }[], 'a')).toBe(0);
    });

    it('should return 0 when the property is not a number', () => {
      expect(ArrayUtil.sumNumberProp([{ a: 'a' }, { a: 'b' }, { a: 'c' }], 'a')).toBe(0);
    });
  });

  describe('onOrderByChange', () => {
    it('should return an object with new column key and ascending direction when orderBy is null', () => {
      const newOrderBy = ArrayUtil.onOrderByChange(null, 'name');
      expect(newOrderBy).toEqual({ key: 'name', direction: 'asc' });
    });

    it('should return null when direction is descending and key matches the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'desc' } as unknown as OrderByConfig;
      const newOrderBy = ArrayUtil.onOrderByChange(existingOrderBy, 'name' as keyof unknown);
      expect(newOrderBy).toBeNull();
    });

    it('should return an object with new column key and ascending direction when key does not match the existing key', () => {
      const existingOrderBy1 = { key: 'name', direction: 'asc' } as unknown as OrderByConfig;
      const newOrderBy1 = ArrayUtil.onOrderByChange(existingOrderBy1, 'age' as keyof unknown);
      expect(newOrderBy1).toEqual({ key: 'age' as keyof unknown, direction: 'asc' });

      const existingOrderBy2 = { key: 'name', direction: 'asc' } as unknown as OrderByConfig;
      const newOrderBy2 = ArrayUtil.onOrderByChange(existingOrderBy2, [
        'age',
        'nested.value',
      ] as keyof unknown);
      expect(newOrderBy2).toEqual({
        key: ['age', 'nested.value'] as keyof unknown,
        direction: 'asc',
      });
    });

    it('should return an object with new column key and descending direction when direction is ascending and key does not match the existing key', () => {
      const existingOrderBy = { key: 'name', direction: 'asc' } as unknown as OrderByConfig;
      const newOrderBy = ArrayUtil.onOrderByChange(existingOrderBy, 'age' as keyof unknown);
      expect(newOrderBy).toEqual({ key: 'age' as keyof unknown, direction: 'asc' });
    });

    it('should return an object with existing column key and descending direction when direction is ascending and key matches the existing key', () => {
      const existingOrderBy1 = { key: 'name', direction: 'asc' } as unknown as OrderByConfig;
      const newOrderBy1 = ArrayUtil.onOrderByChange(existingOrderBy1, 'name' as keyof unknown);
      expect(newOrderBy1).toEqual({ key: 'name' as keyof unknown, direction: 'desc' });

      const existingOrderBy2 = {
        key: ['name', 'nested.prop'],
        direction: 'asc',
      } as unknown as OrderByConfig;
      const newOrderBy2 = ArrayUtil.onOrderByChange(existingOrderBy2, [
        'name',
        'nested.prop',
      ] as keyof unknown);
      expect(newOrderBy2).toEqual({
        key: ['name', 'nested.prop'] as keyof unknown,
        direction: 'desc',
      });
    });
  });

  describe('orderItems', () => {
    const items = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 20 },
    ];
    const nestedItems = [
      { name: 'A', nested: { value: 100 } },
      { name: 'A', nested: { value: 20 } },
      { name: 'A', nested: { value: 35 } },
    ];

    it('should order items in ascending direction by default', () => {
      const orderedItems = ArrayUtil.orderItems(items, 'age', 'asc');
      const orderedNestedItems = ArrayUtil.orderItems(nestedItems, ['nested', 'value'], 'asc');

      expect(orderedItems).toEqual([
        { name: 'Charlie', age: 20 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ]);
      expect(orderedNestedItems).toEqual([
        { name: 'A', nested: { value: 20 } },
        { name: 'A', nested: { value: 35 } },
        { name: 'A', nested: { value: 100 } },
      ]);
    });

    it('should order items in descending direction', () => {
      const orderedItems = ArrayUtil.orderItems(items, 'age', 'desc');
      const orderedNestedItems = ArrayUtil.orderItems(nestedItems, ['nested', 'value'], 'desc');

      expect(orderedItems).toEqual([
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Charlie', age: 20 },
      ]);
      assertAreEqual(orderedNestedItems, [
        { name: 'A', nested: { value: 100 } },
        { name: 'A', nested: { value: 35 } },
        { name: 'A', nested: { value: 20 } },
      ]);
    });

    it('should not modify original array', () => {
      const unorderedItems = items;
      const unorderedNestedItems = nestedItems;

      const orderedItems = ArrayUtil.orderItems(unorderedItems, 'age', 'desc');
      const orderedNestedItems = ArrayUtil.orderItems(
        unorderedNestedItems,
        ['nested', 'value'],
        'desc'
      );

      expect(orderedItems).not.toEqual(items);
      expect(unorderedItems).toEqual(items);

      expect(orderedNestedItems).not.toEqual(nestedItems);
      expect(unorderedNestedItems).toEqual(nestedItems);
    });
  });

  describe('isEmpty', () => {
    it('should return true when the array is empty or nullish', () => {
      expect(ArrayUtil.isEmpty([])).toBeTrue();
      expect(ArrayUtil.isEmpty(null as unknown as unknown[])).toBeTrue();
      expect(ArrayUtil.isEmpty(undefined as unknown as unknown[])).toBeTrue();
    });

    it('should return false when the array is not empty', () => {
      expect(ArrayUtil.isEmpty([1, 2, 3])).toBeFalse();
    });
  });

  describe('isNotEmpty', () => {
    it('should return false when the array is empty or nullish', () => {
      expect(ArrayUtil.isNotEmpty([])).toBeFalse();
      expect(ArrayUtil.isNotEmpty(null as unknown as unknown[])).toBeFalse();
      expect(ArrayUtil.isNotEmpty(undefined as unknown as unknown[])).toBeFalse();
    });

    it('should return true when the array is not empty', () => {
      expect(ArrayUtil.isNotEmpty([1, 2, 3])).toBeTrue();
    });
  });
});
