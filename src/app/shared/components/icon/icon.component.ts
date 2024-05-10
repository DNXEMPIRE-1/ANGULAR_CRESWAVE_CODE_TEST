import { MatIconModule } from '@angular/material/icon';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { DetailsTypes, Icons } from 'src/app/util';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon [icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, RouterModule],
})
export class IconComponent implements OnChanges {
  @Input() icon!: Icons;
  @Input() color: ThemePalette = 'primary';
  @Input() ariaLabelText = 'Icon';
  @Input() url?: string;
  @Input() size = 24;
  @Input() forceLargeSizeOnSm?: boolean;
  @Input() clickable = false;
  @Input() urlType?: DetailsTypes;
  @Input() title = '';
  @Input() elId = '';
  @Input() itemId?: number | undefined;
  @Input() styles: Record<string, string> = {};

  @Output() clicked = new EventEmitter<void>();

  queryParams?: Record<string, string>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlType'] || changes['itemId']) {
      this.updateQueryParamsIfNecessary();
    }
  }

  getStyles(): Record<string, string> {
    return {
      ...this.styles,
      'font-size': this.size + 'px',
      width: this.size + 'px',
      height: this.size + 'px',
    };
  }

  private buildQueryParams = (
    id: number,
    type: DetailsTypes
  ): { id: string; type: DetailsTypes } => ({
    id: id.toString(),
    type,
  });

  private updateQueryParamsIfNecessary(): void {
    if (!this.urlType || this.itemId == null) return;

    this.queryParams = this.buildQueryParams(this.itemId, this.urlType);
  }
}
