import { FinishedPipe } from '../finished.pipe';

describe('Pipe: Finished', () => {
  it('create an instance', () => {
    const pipe = new FinishedPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return Finished if true', () => {
    const pipe = new FinishedPipe();
    expect(pipe.transform(true)).toBe('Finished');
  });

  it('should return In progress if false', () => {
    const pipe = new FinishedPipe();
    expect(pipe.transform(false)).toBe('In progress');
  });
});
