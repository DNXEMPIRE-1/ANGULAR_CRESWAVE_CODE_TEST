import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { DateSlide, DaysOfWeek } from 'src/app/models';
import { ToastService } from 'src/app/services/toast.service';
import { mockToastService } from 'src/app/services/__tests__/test-utils';
import { ElementIds } from 'src/app/util';
import { TimesheetCarouselService } from '../timesheet-carousel.service';
import { TimesheetService } from '../timesheet.service';

describe('Service: TimesheetCarousel', () => {
  const toastService = mockToastService();

  beforeEach(() => {
    const mockTimesheetService = {
      defaultRange: jasmine.createSpy(),
      activeDateString$: of(),
      dateRange$: of(),
      item$: of(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TimesheetCarouselService,
        {
          provide: TimesheetService,
          useValue: mockTimesheetService,
        },
        {
          provide: ToastService,
          useValue: toastService,
        },
      ],
    });
  });

  it('should create', inject([TimesheetCarouselService], (service: TimesheetCarouselService) => {
    expect(service).toBeTruthy();
  }));

  describe('keyFromDate', () => {
    it('should remove unnecessary characters from date', () => {
      const date = '2021-01-01';
      const expected = '20210101';

      const result = TimesheetCarouselService.keyFromDate(date);

      expect(result).toBe(expected);
    });
  });

  describe('keyFromMonthYear', () => {
    it('should remove unnecessary characters from date', () => {
      const month = 'January';
      const year = 2021;
      const expected = 'January2021';

      const result = TimesheetCarouselService.keyFromMonthYear(month, year);

      expect(result).toBe(expected);
    });
  });

  describe('buildDatesCarouselFromCenterDate', () => {
    it('should return the date slides on odd sizes', () => {
      const mockBaseDate = new Date(2021, 0, 1);
      const expectedSlides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '2020-12-31',
          day: '31',
          month: 'December',
          dayOfWeek: DaysOfWeek.Thursday,
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '2021-01-01',
          day: '01',
          month: 'January',
          dayOfWeek: DaysOfWeek.Friday,
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '2021-01-02',
          day: '02',
          month: 'January',
          dayOfWeek: DaysOfWeek.Saturday,
          isWeekend: true,
          year: 2021,
        },
      ].map((slide) => ({ ...slide, key: slide.date }));
      const expectedSize = 3;

      const result = TimesheetCarouselService.buildDatesCarouselFromCenterDate(
        mockBaseDate,
        expectedSize
      );

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
        expect(slide.month).toEqual(expectedSlides[i].month);
      });
    });

    it('should return the date slides on even sizes', () => {
      const mockBaseDate = new Date(2021, 0, 1);
      const expectedSlides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '2021-12-30',
          day: '30',
          dayOfWeek: DaysOfWeek.Wednesday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}2`,
          date: '2021-12-31',
          day: '31',
          dayOfWeek: DaysOfWeek.Thursday,
          month: 'December',
          isWeekend: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '2021-01-01',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
          month: 'January',
          isWeekend: false,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}4`,
          date: '2021-01-02',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
          month: 'January',
          isWeekend: true,
          year: 2021,
        },
      ].map((slide) => ({ ...slide, key: slide.date }));
      const expectedSize = 4;

      const result = TimesheetCarouselService.buildDatesCarouselFromCenterDate(
        mockBaseDate,
        expectedSize
      );

      expect(result.length).toBe(expectedSize);
      result.forEach((slide, i) => {
        expect(slide.id).toContain(ElementIds.DateCarouselSlide);
        expect(slide.day).toEqual(expectedSlides[i].day);
        expect(slide.dayOfWeek).toEqual(expectedSlides[i].dayOfWeek);
        expect(slide.month).toEqual(expectedSlides[i].month);
      });
    });
  });

  describe('buildDatesCarouselFromRange', () => {
    it('should return the date slides on odd sizes', () => {
      const mockFromDate = new Date(2021, 0, 1);
      const mockToDate = new Date(2021, 0, 3);
      const expectedStartDate = '2021-01-01';
      const expectedEndDate = '2021-01-03';
      const expectedSize = 3;

      const result = TimesheetCarouselService.buildDatesCarouselFromRange(mockFromDate, mockToDate);

      expect(result.length).toBe(expectedSize);
      expect(result[0].date).toEqual(expectedStartDate);
      expect(result[result.length - 1].date).toEqual(expectedEndDate);
    });

    it('should return the date slides on even sizes', () => {
      const mockFromDate = new Date(2021, 0, 1);
      const mockToDate = new Date(2021, 0, 4);
      const expectedStartDate = '2021-01-01';
      const expectedEndDate = '2021-01-04';
      const expectedSize = 4;

      const result = TimesheetCarouselService.buildDatesCarouselFromRange(mockFromDate, mockToDate);

      expect(result.length).toBe(expectedSize);
      expect(result[0].date).toEqual(expectedStartDate);
      expect(result[result.length - 1].date).toEqual(expectedEndDate);
    });
  });

  describe('buildNewSlidesSelectingSlideById', () => {
    it('should return the date slides with selected slide', () => {
      const idToSelect = `${ElementIds.DateCarouselSlide}2`;
      const slides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          date: '2021-12-30',
          day: '30',
          dayOfWeek: DaysOfWeek.Wednesday,
          month: 'December',
          isWeekend: false,
          selected: false,
          year: 2020,
        },
        {
          id: idToSelect,
          date: '2021-12-31',
          day: '31',
          dayOfWeek: DaysOfWeek.Thursday,
          month: 'December',
          isWeekend: false,
          selected: false,
          year: 2020,
        },
        {
          id: `${ElementIds.DateCarouselSlide}3`,
          date: '2021-01-01',
          day: '01',
          dayOfWeek: DaysOfWeek.Friday,
          month: 'January',
          isWeekend: false,
          selected: true,
          year: 2021,
        },
        {
          id: `${ElementIds.DateCarouselSlide}4`,
          date: '2021-01-02',
          day: '02',
          dayOfWeek: DaysOfWeek.Saturday,
          month: 'January',
          isWeekend: true,
          selected: false,
          year: 2021,
        },
      ].map((slide) => ({ ...slide, key: slide.date }));

      const result = TimesheetCarouselService.buildNewSlidesSelectingSlideById(idToSelect, slides);

      if (result == null) {
        fail();
        return;
      }
      expect(result.length).toBe(slides.length);
      expect(result.filter((slide) => slide.selected).length).toBe(1);
      expect(result.find((slide) => slide.id === idToSelect)?.selected).toBeTrue();
    });

    it('should return undefined if the id is not found', () => {
      const idToSelect = `${ElementIds.DateCarouselSlide}5`;
      const slides: DateSlide[] = [
        {
          id: `${ElementIds.DateCarouselSlide}1`,
          key: '2021-12-30',
          date: '2021-12-30',
          day: '30',
          dayOfWeek: DaysOfWeek.Wednesday,
          month: 'December',
          isWeekend: false,
          selected: false,
          year: 2020,
        },
      ];

      const result = TimesheetCarouselService.buildNewSlidesSelectingSlideById(idToSelect, slides);

      expect(result).toBeUndefined();
    });
  });
});
