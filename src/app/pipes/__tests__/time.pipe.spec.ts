import { TestBed } from '@angular/core/testing';
import { TimePipe } from '../time.pipe';

describe('Pipe: Time', () => {
  let pipe: TimePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    pipe = new TimePipe();
  });

  it('should transform the value to HH:mm time', () => {
    expect(pipe.transform(1234)).toBe('12:34');
    expect(pipe.transform(234)).toBe('02:34');
    expect(pipe.transform(34)).toBe('00:34');
    expect(pipe.transform(4)).toBe('00:04');
    expect(pipe.transform(0)).toBe('00:00');
  });

  it('should return the value if it is not a number', () => {
    expect(pipe.transform('12:34' as unknown as number)).toBe('12:34');
    expect(pipe.transform('1234' as unknown as number)).toBe('1234');
    expect(pipe.transform('' as unknown as number)).toBe('');
  });

  it('should return an empty string if it is nullish', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
