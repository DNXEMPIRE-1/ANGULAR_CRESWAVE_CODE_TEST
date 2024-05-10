/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { PubSubUtil } from 'src/app/util';

@Component({
  template: '',
})
export abstract class WithDestroyed implements OnDestroy {
  protected destroyed$ = new Subject<boolean>();

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }
}
