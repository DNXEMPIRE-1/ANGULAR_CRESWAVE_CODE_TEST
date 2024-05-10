import { Component } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { paths } from 'src/app/util';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [ButtonComponent],
})
export class NotFoundComponent {
  paths = paths;
}
