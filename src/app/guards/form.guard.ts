import { inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { CanDeactivateForm } from '../models';
import { ModalService } from '../services';
import { unsavedChangesModalData } from '../util';

export const canDeactivateForm = <T extends { [K in keyof T]: AbstractControl }>(
  comp: CanDeactivateForm<T>
): true | Observable<boolean> => {
  if (!comp.form?.dirty) return true;

  const modalService = inject(ModalService);
  const ref = modalService.confirmation(unsavedChangesModalData());

  return ref.afterClosed().pipe(map((result) => !!result));
};
