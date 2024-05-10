import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { ModalConfirmData } from 'src/app/models';
import { ModalConfirmComponent, ModalFeedbackComponent } from '../shared/components/modals';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) {}

  /**
   * Higher order function that returns a function that opens a modal, optionally running a function on accept.
   * @param data The data to pass to the modal.
   * @param onAcceptFn The function to run on accept.
   *
   * @returns The modal reference.
   */
  confirmation(data: ModalConfirmData, onAcceptFn?: () => void): MatDialogRef<unknown, boolean> {
    const ref = this.open(ModalConfirmComponent, data);

    if (!onAcceptFn) return ref;

    this.runOnAccept(ref, onAcceptFn);
    return ref;
  }

  feedback(data: ModalConfirmData): MatDialogRef<unknown, boolean> {
    return this.open(ModalFeedbackComponent, data);
  }

  private runOnAccept(ref: MatDialogRef<unknown>, fn: () => void): void {
    const pipedRef$ = ref.afterClosed().pipe(
      filter((result) => !!result),
      tap(() => fn())
    );
    pipedRef$.subscribe();
  }

  private open(cmp: ComponentType<unknown>, data: unknown): MatDialogRef<unknown> {
    const dialogRef = this.dialog.open(cmp, {
      data,
      autoFocus: false,
      restoreFocus: false,
    });

    return dialogRef;
  }

  openComponent<T>(cmp: ComponentType<T>, data: T): MatDialogRef<T> {
    const dialogRef = this.dialog.open(cmp, {
      data,
      autoFocus: false,
      restoreFocus: false,
    });

    return dialogRef;
  }
}
