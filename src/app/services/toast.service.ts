import { Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, concatMap, filter, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastData } from 'src/app/models';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { AlertTypes, PubSubUtil } from '../util';

type ToastConfig = MatSnackBarConfig<string>;

@Injectable({
  providedIn: 'root',
})
export class ToastService implements OnDestroy {
  private readonly posXDefault: MatSnackBarHorizontalPosition = 'center';
  private readonly posYDefault: MatSnackBarVerticalPosition = 'top';
  private readonly durationDefault = 4000;

  private _toastQueue$ = new BehaviorSubject<MatSnackBarConfig<string> | void>(undefined);
  private _toastCount$ = new BehaviorSubject<number>(0);
  private destroyed$ = new Subject<boolean>();

  get toastCount$() {
    return this._toastCount$.asObservable();
  }

  constructor(private _snackBar: MatSnackBar) {
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs(): void {
    this._toastQueue$
      .pipe(
        takeUntil(this.destroyed$),

        filter((nextInQueue): nextInQueue is MatSnackBarConfig<string> => {
          const isValid = nextInQueue != null;

          if (!isValid) return false;

          const currentToastText = this._snackBar._openedSnackBarRef?.instance?.data;
          const alreadyOpen = currentToastText === nextInQueue?.data;
          if (alreadyOpen) return false;
          this.incrementCount();

          return true;
        }),
        concatMap((nextInQueue) => {
          const ref = this.openToast(nextInQueue);
          return ref.afterDismissed().pipe(finalize(() => this.decrementCount()));
        })
      )
      .subscribe();
  }

  success(message: string): void {
    this.open({ message }, AlertTypes.Success);
  }

  error(message: string): void {
    this.open({ message }, AlertTypes.Error);
  }

  info(message: string): void {
    this.open({ message }, AlertTypes.Info);
  }

  warning(message: string): void {
    this.open({ message }, AlertTypes.Warning);
  }

  open({ message, positionX, positionY, duration }: ToastData, type: AlertTypes): void {
    const durationToUse = duration === 0 ? undefined : duration || this.durationDefault;
    const typeClass = ['toast', type];

    const config = {
      horizontalPosition: positionX || this.posXDefault,
      verticalPosition: positionY || this.posYDefault,
      duration: durationToUse,
      panelClass: typeClass,
      data: message,
    };

    this.queueToast(config);
  }

  private openToast(config: MatSnackBarConfig<string>) {
    return this._snackBar.openFromComponent(ToastComponent, config);
  }

  closeToast(): void {
    const snackInstance: MatSnackBarRef<ToastComponent> | null = this._snackBar._openedSnackBarRef;

    snackInstance?.dismiss();
  }

  private queueToast(config: ToastConfig): void {
    this.addToastToQueue(config);
  }

  private addToastToQueue(config: ToastConfig): void {
    this._toastQueue$.next(config);
  }

  private incrementCount() {
    const val = this._toastCount$.getValue();
    this._toastCount$.next(val + 1);
  }

  private decrementCount() {
    const val = this._toastCount$.getValue();
    this._toastCount$.next(val - 1);
  }
}
