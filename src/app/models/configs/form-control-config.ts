import { FormGroup } from '@angular/forms';

export interface FormControlConfig {
  fg: FormGroup;
  canEdit: boolean;
  formId?: string;
}
