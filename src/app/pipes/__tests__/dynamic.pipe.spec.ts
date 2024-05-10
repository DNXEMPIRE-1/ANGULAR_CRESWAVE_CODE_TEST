import { DecimalPipe } from '@angular/common';
import { Injector, ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicPipe } from '../dynamic.pipe';

describe('Pipe: Dynamic', () => {
  let injector: Injector;
  let pipe: DynamicPipe<DecimalPipe>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecimalPipe],
    });
    injector = TestBed.inject(Injector);
    pipe = new DynamicPipe(injector);
  });

  it('should transform the value with the provided pipe', () => {
    const value = 1234.5678;
    const transformedValue = pipe.transform(value, DecimalPipe, ['1.2-2']);
    expect(transformedValue).toBe('1,234.57');
  });

  it('should return the value if no pipe token is provided', () => {
    const value = 'Hello, world!';
    const transformedValue = pipe.transform(
      value,
      null as unknown as ProviderToken<DecimalPipe>,
      []
    );
    expect(transformedValue).toBe(value);
  });

  it('should transform the value if it or params is null or undefined', () => {
    const valueNull = null;
    const value = 15;
    const transformedValue = '15';

    expect(pipe.transform(value, DecimalPipe, null)).toBe(transformedValue);
    expect(pipe.transform(value, DecimalPipe, undefined)).toBe(transformedValue);
    expect(pipe.transform(valueNull, DecimalPipe, [])).toBe(valueNull);
    expect(pipe.transform(valueNull, DecimalPipe, null)).toBe(valueNull);
    expect(pipe.transform(valueNull, DecimalPipe, undefined)).toBe(valueNull);
  });
});
