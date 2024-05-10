import { Component, Input } from '@angular/core';
import { Image } from 'src/app/models';
import { ImageComponent } from '../../image/image.component';

@Component({
  selector: 'app-card-layout [image]',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss'],
  standalone: true,
  imports: [ImageComponent],
})
export class CardLayoutComponent {
  @Input() image!: Image | undefined;
}
