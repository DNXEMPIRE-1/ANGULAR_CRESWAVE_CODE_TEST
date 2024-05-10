import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { StringUtil } from '../util';

@Directive({
  selector: '[appSetId]',
  standalone: true,
})
export class SetIdDirective implements OnInit {
  @Input() appSetId: unknown;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (typeof this.appSetId !== 'string' || !StringUtil.notEmpty(this.appSetId)) return;

    this.el.nativeElement.id = this.appSetId;
  }
}
