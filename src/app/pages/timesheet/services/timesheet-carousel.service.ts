import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, shareReplay, takeUntil } from 'rxjs';
import { DateSlide, MonthSlide } from 'src/app/models';
import { AppService } from 'src/app/services';
import { DateUtil, ElementIds, PubSubUtil, StringUtil } from 'src/app/util';

@Injectable({
  providedIn: 'root',
})
export class TimesheetCarouselService implements OnDestroy {
  private _slides$ = new BehaviorSubject<DateSlide[]>([]);
  private _monthSlides$ = new BehaviorSubject<MonthSlide[]>([]);

  private destroyed$ = new Subject<boolean>();

  get slides$() {
    return this._slides$.asObservable().pipe(shareReplay(1));
  }

  get monthSlides$() {
    return this._monthSlides$.asObservable();
  }

  constructor(private app: AppService) {
    this.initSubs();
  }

  private initSubs(): void {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._slides$.next([]);
      this._monthSlides$.next([]);
    });
    this.app.activeDateString$.pipe(takeUntil(this.destroyed$)).subscribe((dateString) => {
      this.selectSlideByDate(dateString);
    });
    this.app.dateRange$.pipe(takeUntil(this.destroyed$)).subscribe(({ start, end }) => {
      const today = new Date();
      const slides = TimesheetCarouselService.buildDatesCarouselFromRangeWithCenterDateOrDefault(
        start,
        end,
        today
      );
      this.setSlides(slides);
    });
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private setSlides(dateSlides: DateSlide[]): void {
    this._slides$.next(dateSlides);
  }

  private setMonthSlides(monthSlides: MonthSlide[]): void {
    this._monthSlides$.next(monthSlides);
  }

  private selectSlideByDate(dateString: string): void {
    const slides = this._slides$.getValue();
    const activeSlide = slides.find((s) => s.date === dateString);
    if (activeSlide == null) return;
    this.selectSlideByIdWithSlides(activeSlide.id, slides);
  }

  shouldLoadSlides(prevSlides: DateSlide[], currSlides: DateSlide[]): boolean {
    const prevDates = TimesheetCarouselService.getSlidesFirstAndLastDates(prevSlides);
    const currDates = TimesheetCarouselService.getSlidesFirstAndLastDates(currSlides);

    if (prevDates == null) return true;
    if (currDates == null) return false;

    return (
      !DateUtil.datesEqual(prevDates.first, currDates.first) ||
      !DateUtil.datesEqual(prevDates.last, currDates.last)
    );
  }

  defaultCarousel(): DateSlide[] {
    const { start, end } = this.app.getDateRangeOrDefault();

    return TimesheetCarouselService.buildDatesCarouselFromRange(start, end);
  }

  static getSlidesFirstAndLastDates = (slides: DateSlide[]): { first: Date; last: Date } | null => {
    if (slides.length === 0) return null;

    const first = DateUtil.dateStringToDate(slides[0].date);
    const last = DateUtil.dateStringToDate(slides[slides.length - 1].date);

    return { first, last };
  };

  static buildDatesCarouselFromRange = (from: Date, to: Date): DateSlide[] => {
    const size = DateUtil.daysDiff(from, to) + 1;

    return TimesheetCarouselService.buildDatesCarousel(from, size);
  };

  static buildDatesCarouselFromRangeWithCenterDateOrDefault(
    from: Date,
    to: Date,
    centerDate: Date
  ): DateSlide[] {
    const slides = this.buildDatesCarouselFromRange(from, to);
    const centerId = slides.find(
      (slide) => slide.date === DateUtil.formatDateToUniversalFormat(centerDate)
    )?.id;

    if (centerId == null) return slides;

    return TimesheetCarouselService.buildNewSlidesSelectingSlideById(centerId, slides) ?? slides;
  }

  static buildDatesCarouselFromCenterDate(centerDate: Date, size: number): DateSlide[] {
    if (centerDate == null) return [];

    const daysToAdd = -Math.floor(size / 2);
    return TimesheetCarouselService.buildDatesCarousel(centerDate, size, daysToAdd);
  }

  private static buildDatesCarousel(
    initialDate: Date,
    size: number,
    daysToAdd = 0,
    lastMonth = ''
  ): DateSlide[] {
    const slides: DateSlide[] = [];
    for (let days = 0; days < size; days++) {
      const date = DateUtil.addDays(initialDate, days + daysToAdd);
      const dateValues = DateUtil.getDateValues(date);

      slides.push({
        id: `${ElementIds.DateCarouselSlide}${days + 1}`,
        key: this.keyFromDate(dateValues.date),
        ...dateValues,
        selected: days + daysToAdd === 0,
        firstOfMonth: dateValues.month !== lastMonth,
      });

      lastMonth = dateValues.month;
    }

    return slides;
  }

  getSlides(): DateSlide[] {
    return this._slides$.getValue();
  }

  getMonthSlides(): MonthSlide[] {
    return this._monthSlides$.getValue();
  }

  setMonthSlidesFromSlides(): MonthSlide[] {
    const monthSlides = this.getUniqueMonthsFromSlides();
    this.setMonthSlides(monthSlides);
    return monthSlides;
  }

  getFirstSlideOfMonthIndex(month: string, year: number): number {
    return this.getSlides().findIndex(
      (slide) => slide.firstOfMonth && slide.month === month && slide.year === year
    );
  }

  private getUniqueMonthsFromSlides(): MonthSlide[] {
    const slides = this.getSlides();

    const monthSlides = slides
      .map(TimesheetCarouselService.uniqueMonthFromSlideOrDefault)
      .filter((slide): slide is MonthSlide => slide != null);

    return monthSlides;
  }

  private static uniqueMonthFromSlideOrDefault(
    slide: DateSlide,
    index: number,
    current: DateSlide[]
  ): MonthSlide | undefined {
    if (index === 0) return TimesheetCarouselService.buildMonthSlide(slide.month, slide.year);

    return current[index - 1].month === slide.month
      ? undefined
      : TimesheetCarouselService.buildMonthSlide(slide.month, slide.year);
  }

  private static buildMonthSlide(month: string, year: number): MonthSlide {
    return {
      id: TimesheetCarouselService.buildMonthSlideId(month, year),
      key: this.keyFromMonthYear(month, year),
      month,
      year,
      selected: false,
    };
  }

  static keyFromDate(dateStr: string): string {
    return StringUtil.replaceAll(dateStr, '-', '');
  }

  static keyFromMonthYear(month: string, year: number): string {
    return `${month}${year}`;
  }

  static buildMonthSlideId(month: string, year: number): string {
    return `${ElementIds.MonthCarouselSlide}${month}${year}`;
  }

  /**
   * @description
   * Builds a new array of slides with the slide with the given id selected.
   *
   * This method mutates the given slides array.
   */
  static buildNewSlidesSelectingSlideById(id: string, slides: DateSlide[]) {
    const newSlides = slides;
    const slideToSelectIndex = newSlides.findIndex((slide) => slide.id === id);

    if (slideToSelectIndex < 0) return;

    const selectedSlideIndex = newSlides.findIndex((slide) => slide.selected);
    if (selectedSlideIndex >= 0) {
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        selected: false,
      };
    }

    newSlides[slideToSelectIndex] = { ...newSlides[slideToSelectIndex], selected: true };
    return newSlides;
  }

  private selectSlideByIdWithSlides(id: string, slides: DateSlide[]): void {
    const newSlides = TimesheetCarouselService.buildNewSlidesSelectingSlideById(
      id,
      slides ?? this._slides$.getValue()
    );

    if (newSlides == null) return;

    this.setSlides(newSlides);
  }

  selectMonthSlideById(id: string): void {
    let newMonthSlides = this._monthSlides$.getValue();

    const slideIndex = newMonthSlides.findIndex((slide) => slide.id === id);

    if (slideIndex >= 0 && newMonthSlides[slideIndex].selected) return;

    newMonthSlides = newMonthSlides.map((slide, i) => {
      if (i === slideIndex) return { ...slide, selected: true };
      if (!slide.selected) return slide;

      return { ...slide, selected: false };
    });

    this.setMonthSlides(newMonthSlides);
  }
}
