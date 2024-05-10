import { Injectable } from '@angular/core';
import { debounce, DebouncedFunc } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterApiCall?: DebouncedFunc<() => void>;

  cancelPreviousCall(): void {
    this.filterApiCall?.cancel();
  }

  filterDebounced(callApi: () => Promise<void>, filterInternally?: () => void, delay = 500): void {
    this.cancelPreviousCall();

    this.filterApiCall = debounce(callApi, delay);
    this.filterApiCall();

    filterInternally?.();
  }
}
