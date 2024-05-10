import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { PubSubUtil } from 'src/app/util';
import { LoadingComponent } from '../../loading/loading.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTooltipModule, LoadingComponent],
})
export class ButtonComponent implements OnChanges, OnDestroy {
  @Input() disabled = false;
  @Input() color: ThemePalette = 'primary';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() url?: string;
  @Input() model: 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' | 'link' | '' = '';
  @Input() elId?: string;
  @Input() styles: Record<string, string> = {};
  @Input() hiddenLabel = false;
  @Input() iconOnly = false;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  isLoading = false;
  subscriptions: Subscription[] = [];

  get isDisabled(): boolean {
    return this.isLoading || this.disabled;
  }

  constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId'] && !!this.elId) {
      this.initLoadingSubscription();
    }
  }

  ngOnDestroy(): void {
    PubSubUtil.unsub(this.subscriptions);
  }

  initLoadingSubscription(): void {
    PubSubUtil.unsub(this.subscriptions);

    if (!this.elId) return;

    this.subscriptions.push(
      this.loadingService.isLoadingById$(this.elId).subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.cdRef.detectChanges();
      })
    );
  }

  emitClick = (): void => this.clicked.emit();

  getLinkStyles(): Record<string, string> {
    return {
      color: '#fff',
      ...this.styles,
    };
  }
}
