import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-layout',
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class ModalLayoutComponent {}
