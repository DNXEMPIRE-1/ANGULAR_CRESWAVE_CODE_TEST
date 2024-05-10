import { Injectable } from '@angular/core';
import { IconConfig } from 'src/app/models';
import { Icons } from 'src/app/util';

@Injectable({
  providedIn: 'root',
})
export class UserUtil {
  static getVisibilityIcon(onClick: () => void): IconConfig<never> {
    return IconConfig.withClick('cPasswordVisibilityIcon', Icons.RemoveRedEye, onClick, 'accent');
  }

  static getPasswordHelpers(): string[] {
    return [
      'At least 10 characters',
      'At least 1 uppercase letter',
      'At least 1 lowercase letter',
      'At least 1 number',
    ];
  }
}
