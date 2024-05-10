import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';
import { Observable, map, takeUntil, tap } from 'rxjs';
import { DateSlide, MonthSlide, WithDestroyed } from 'src/app/models';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { DateUtil, Icons } from 'src/app/util';
import { TimesheetCarouselService } from '../../services/timesheet-carousel.service';
import { MonthSlideComponent } from '../month-slide/month-slide.component';
import { TimesheetSlideComponent } from '../timesheet-slide/timesheet-slide.component';
@Component({
  selector: 'app-timesheet-carousel',
  templateUrl: './timesheet-carousel.component.html',
  styleUrls: ['./timesheet-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    MonthSlideComponent,
    IconComponent,
    TimesheetSlideComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class TimesheetCarouselComponent extends WithDestroyed implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel?: CarouselComponent;
  @ViewChild('carouselHeader', { static: false }) carouselHeader?: CarouselComponent;

  @Output() selectedDate = new EventEmitter<Date>();

  slides$: Observable<DateSlide[]>;
  todaySlideExists$: Observable<boolean>;
  monthSlides$: Observable<MonthSlide[]>;

  slideWidth = 160;

  carouselOptions: OwlOptions = {
    dots: false,
    items: this.calculateDateItemsFor24PxMargin(),
    nav: true,
    lazyLoad: true,
    freeDrag: true,
    navSpeed: 350,
  };

  carouselHeaderOptions: OwlOptions = {
    dots: false,
    nav: false,
    pullDrag: false,
    mouseDrag: false,
    touchDrag: false,
    freeDrag: false,
    center: true,
    navSpeed: 950,
    items: this.calculateMonthItems([]),
  };

  Icons = Icons;

  get prevDisabled(): boolean {
    if (!this.carousel?.navData?.prev) return true;

    return this.carousel.navData.prev.disabled;
  }

  get nextDisabled(): boolean {
    if (!this.carousel?.navData?.next) return true;

    return this.carousel.navData.next.disabled;
  }

  constructor(private carouselService: TimesheetCarouselService, private cdRef: ChangeDetectorRef) {
    super();
    this.slides$ = this.carouselService.slides$;
    this.todaySlideExists$ = this.slides$.pipe(
      map((slides) => slides.some((slide) => slide.isToday))
    );
    this.monthSlides$ = this.carouselService.monthSlides$;
  }

  ngOnInit(): void {
    this.initSubs();
  }

  ngAfterViewInit(): void {
    this.centerSelected();
  }

  private initSubs(): void {
    this.slides$
      .pipe(
        takeUntil(this.destroyed$),
        tap((slides) => {
          this.onSlideChanges(slides);
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  onSlideClick(slide: DateSlide): void {
    this.onSlideSelect(slide);
  }

  onMonthSlideClick(slide: MonthSlide): void {
    const { id, selected, month, year } = slide;
    if (selected) return;

    this.onMonthSlideSelect(id);

    const firstSlideOfMonthIndex = this.carouselService.getFirstSlideOfMonthIndex(month, year);

    if (firstSlideOfMonthIndex === -1) return;

    this.moveToIndex(firstSlideOfMonthIndex);
  }

  private onSlideChanges(slides: DateSlide[]): void {
    if (!slides?.length) return;

    const selectedSlidePosition = slides.findIndex((slide) => slide.selected);
    let position = 0;
    if (selectedSlidePosition === -1) {
      const todayPosition = Math.floor(slides?.length / 2);
      position = todayPosition;

      this.carouselOptions = {
        ...this.carouselOptions,
        startPosition: this.getCenterPosition(position),
      };
    } else {
      position = selectedSlidePosition;
    }

    this.moveToIndex(this.getCenterPosition(position));

    const monthSlides = this.carouselService.setMonthSlidesFromSlides();

    const monthItemsCount = this.calculateMonthItems(monthSlides);
    this.carouselHeaderOptions.items = monthItemsCount;
    this.setMonthStartPosition(position, slides);
  }

  next(): void {
    this.carousel?.next();
  }

  prev(): void {
    this.carousel?.prev();
  }

  goToToday(): void {
    const slides = this.carouselService.getSlides();

    const todaySlide = slides.find((slide) => slide.isToday);

    if (!todaySlide) return;

    if (!todaySlide.selected) {
      this.onSlideSelect(todaySlide);
    } else {
      this.moveToIndex(this.getCenterPosition(slides.indexOf(todaySlide)));
    }
  }

  handleChange(event: SlidesOutputData): void {
    const startPosition = event?.startPosition ?? -1;
    if (!(startPosition > 0)) return;
    const slides = this.carouselService.getSlides();

    const startSlide = slides[startPosition];

    if (!startSlide) return;
    const monthSlideId = TimesheetCarouselService.buildMonthSlideId(
      startSlide.month,
      startSlide.year
    );

    if (!monthSlideId) return;

    this.onMonthSlideSelect(monthSlideId);
  }

  private setMonthStartPosition(startPosition: number, slides: DateSlide[]) {
    const startSlide = slides[startPosition];
    const monthSlideId = TimesheetCarouselService.buildMonthSlideId(
      startSlide.month,
      startSlide.year
    );
    if (!monthSlideId) return;

    this.carouselService.selectMonthSlideById(monthSlideId);
  }

  private calculateDateItemsFor24PxMargin(): number {
    return Math.floor(window.innerWidth / (this.slideWidth * 1.25));
  }

  private calculateMonthItems(monthSlides: MonthSlide[]): number {
    return Math.min(3, monthSlides.length);
  }

  getItemKey<T extends { key: string }>(index: number, item: T): string {
    return item.key;
  }

  moveToSelected(): void {
    const selectedSlide = this.getSelectedSlide();

    if (!selectedSlide) return;

    this.carousel?.to(selectedSlide.id);
  }

  private getSelectedSlide() {
    const slides = this.carouselService.getSlides();

    return slides.find((slide) => slide.selected);
  }

  private getSelectedSlideIndex() {
    const slides = this.carouselService.getSlides();

    return slides.findIndex((slide) => slide.selected);
  }

  centerSelected(): void {
    const index = this.getSelectedSlideIndex();
    const slideToCenter = this.carouselService.getSlides()[this.getCenterPosition(index)];

    if (slideToCenter == null) return;

    this.carousel?.to(slideToCenter.id);
  }

  moveToIndex(index: number): void {
    const slides = this.carouselService.getSlides();

    const slide = slides[index];

    if (!slide) return;

    this.carousel?.to(slide.id);
  }

  moveToSelectedMonth(): void {
    const monthSlides = this.carouselService.getMonthSlides();

    const selectedMonthSlide = monthSlides.find((slide) => slide.selected);

    if (!selectedMonthSlide) return;

    this.carouselHeader?.to(selectedMonthSlide.id);
  }

  moveToMonthById(id: string | undefined): void {
    if (!id) return;

    this.carouselHeader?.to(id);
  }

  private onSlideSelect(slide: DateSlide) {
    this.selectedDate.emit(DateUtil.dateStringToDate(slide.date));
  }

  private onMonthSlideSelect(id: string) {
    this.carouselService.selectMonthSlideById(id);
    this.moveToMonthById(id);
  }

  private getCenterPosition(position: number): number {
    return Math.ceil(Math.max(0, position - (this.carouselOptions.items ?? 0) / 2));
  }
}
