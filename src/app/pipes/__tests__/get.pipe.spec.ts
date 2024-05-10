import { TestBed } from '@angular/core/testing';

import { GetPipe } from '../get.pipe';

describe('Pipe: Get', () => {
  let pipe: GetPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    pipe = new GetPipe();
  });

  it('should transform the value to the argument nested property', () => {
    const obj1 = {
      foo: 'fooValue',
    };
    const obj2 = {
      foo: {
        bar: 'barValue',
      },
    };
    const obj3 = {
      foo: {
        bar: {
          baz: 'bazValue',
        },
      },
    };

    expect(pipe.transform(obj1, 'foo')).toBe('fooValue');
    expect(pipe.transform(obj2, 'foo.bar')).toBe('barValue');
    expect(pipe.transform(obj3, 'foo.bar.baz')).toBe('bazValue');
  });

  it('should return an empty string if acessing a non existent value', () => {
    const obj1 = {
      foo: {
        bar: 'barValue',
      },
    };

    expect(pipe.transform(obj1, 'foo.bar.baz')).toBe('');
  });

  it('should return an empty string if the value or args are nullish', () => {
    expect(pipe.transform(null as unknown as object, 'foo.bar')).toBe('');
    expect(pipe.transform(undefined as unknown as object, 'foo.bar')).toBe('');
    expect(pipe.transform({}, null as unknown as string)).toBe('');
    expect(pipe.transform({}, undefined as unknown as string)).toBe('');
  });
});
