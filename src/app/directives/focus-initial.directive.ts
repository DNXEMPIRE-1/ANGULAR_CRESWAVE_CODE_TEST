import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AsyncUtil } from '../util';

@Directive({
  selector: '[appFocusInitial]',
  standalone: true,
})
export class FocusInitialDirective implements OnInit {
  @Input() focusChild = false;

  constructor(private el: ElementRef) {}

  async ngOnInit() {
    const el = this.el.nativeElement as HTMLElement | null;

    if (!this.focusChild) return this.focusEl(el);

    await AsyncUtil.delayHtmlRender();
    this.focusEl(el?.firstElementChild as HTMLElement | null);
  }

  private focusEl(el: HTMLElement | null) {
    if (el == null) throw Error('Element is null');

    if (el.focus) return el.focus();
    throw Error('Element does not have focus method');
  }
}
