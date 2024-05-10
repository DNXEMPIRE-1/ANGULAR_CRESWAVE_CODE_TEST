import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Image } from 'src/app/models';

@Component({
  selector: 'app-image [image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage],
})
export class ImageComponent {
  @Input() image!: Image | undefined;

  get src(): string {
    return this.image?.src ?? '/assets/img/placeholder.png';
  }

  get alt(): string {
    return this.image?.alt ?? 'placeholder';
  }

  get width(): number | undefined {
    return this.image?.width ?? undefined;
  }

  get height(): number | undefined {
    return this.image?.height ?? undefined;
  }

  get priority(): string | boolean {
    return this.image?.priority ?? false;
  }

  get fill(): boolean {
    return !this.width || !this.height;
  }
}
