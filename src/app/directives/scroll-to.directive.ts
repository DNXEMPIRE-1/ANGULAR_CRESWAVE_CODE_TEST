import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { AsyncUtil } from '../util';

@Directive({
  selector: '[appScrollTo]',
  standalone: true,
})
export class ScrollToDirective implements AfterViewInit {
  @Input('appScrollTo') initial = false;
  @Input() renderTime = 100;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (!this.initial) return;

    AsyncUtil.delayHtmlRender(this.renderTime).then(() => this.scrollTo());
  }

  scrollTo() {
    this.el.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
