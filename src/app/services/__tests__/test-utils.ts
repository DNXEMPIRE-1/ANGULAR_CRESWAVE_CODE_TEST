import { ToastService } from '../toast.service';

export function assertAreEqual<T>(actual: T, expected: T): void {
  expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
}

export function mockToastService(): jasmine.SpyObj<ToastService> {
  return jasmine.createSpyObj('ToastService', ['info', 'error', 'success', 'warning']);
}
