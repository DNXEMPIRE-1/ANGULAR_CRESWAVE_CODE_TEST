import { inject } from '@angular/core/testing';
import { ProfileUtil } from '../profile.util';
import { ProfileTypes } from '../constants';
import {
  ActiveProfileIds,
  ProfileIdsStore,
  Profile,
  ProfileDateRange,
  ProfileType,
} from 'src/app/models';

describe('Util: Profile', () => {
  const profiles: Profile[] = [
    { profileType: { type: ProfileTypes.Weekday }, priority: 1 },
    { profileType: { type: ProfileTypes.Weekday }, priority: 2 },
    { profileType: { type: ProfileTypes.Weekend }, priority: 2 },
    { profileType: { type: ProfileTypes.Weekend }, priority: 1 },
    { profileType: { type: ProfileTypes.Holiday }, priority: 3 },
    { profileType: { type: ProfileTypes.Holiday }, priority: 1 },
  ];

  it('should create', inject([ProfileUtil], (service: ProfileUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('buildProfileIdsStore', () => {
    const weekdayId = 1;
    const weekendId = 2;
    const holidayId = 3;
    const customId_p2 = 4;
    const customId2_p1 = 5;
    const customId3_p1 = 6;

    const activeProfileIds: ActiveProfileIds = {
      weekday: weekdayId,
      weekend: weekendId,
      holiday: holidayId,
      customDateRanges: [
        {
          profileId: customId_p2,
          start: new Date(2023, 2, 15),
          end: new Date(2023, 2, 20),
          priority: 2,
        },
        {
          profileId: customId2_p1,
          start: new Date(2023, 2, 10),
          end: new Date(2023, 2, 21),
          priority: 1,
        },
        {
          profileId: customId3_p1,
          start: new Date(2023, 3, 21),
          end: new Date(2023, 3, 21),
          priority: 1,
        },
      ],
    };
    const from = new Date(2023, 1, 21);
    const to = new Date(2023, 2, 21);
    const expected: ProfileIdsStore = {
      byDate: {
        '2023-02-21': weekdayId,
        '2023-02-22': weekdayId,
        '2023-02-23': weekdayId,
        '2023-02-24': weekdayId,
        '2023-02-25': weekendId,
        '2023-02-26': weekendId,
        '2023-02-27': weekdayId,
        '2023-02-28': weekdayId,
        '2023-03-01': weekdayId,
        '2023-03-02': weekdayId,
        '2023-03-03': weekdayId,
        '2023-03-04': weekendId,
        '2023-03-05': weekendId,
        '2023-03-06': weekdayId,
        '2023-03-07': weekdayId,
        '2023-03-08': weekdayId,
        '2023-03-09': weekdayId,
        '2023-03-10': customId2_p1,
        '2023-03-11': customId2_p1,
        '2023-03-12': customId2_p1,
        '2023-03-13': customId2_p1,
        '2023-03-14': customId2_p1,
        '2023-03-15': customId_p2,
        '2023-03-16': customId_p2,
        '2023-03-17': customId_p2,
        '2023-03-18': customId_p2,
        '2023-03-19': customId_p2,
        '2023-03-20': customId_p2,
        '2023-03-21': customId2_p1,
      },
      dates: [
        '2023-02-21',
        '2023-02-22',
        '2023-02-23',
        '2023-02-24',
        '2023-02-25',
        '2023-02-26',
        '2023-02-27',
        '2023-02-28',
        '2023-03-01',
        '2023-03-02',
        '2023-03-03',
        '2023-03-04',
        '2023-03-05',
        '2023-03-06',
        '2023-03-07',
        '2023-03-08',
        '2023-03-09',
        '2023-03-10',
        '2023-03-11',
        '2023-03-12',
        '2023-03-13',
        '2023-03-14',
        '2023-03-15',
        '2023-03-16',
        '2023-03-17',
        '2023-03-18',
        '2023-03-19',
        '2023-03-20',
        '2023-03-21',
      ],
    };

    it('should return a data table of date profile ids', () => {
      const profileIdsStore = ProfileUtil.buildProfileIdsStore(activeProfileIds, {
        start: from,
        end: to,
      });
      expect(profileIdsStore).toEqual(expected);
    });

    it('should take account for highest priority custom date ranges', () => {
      const customId_p3 = 5;
      const customId2_p1 = 6;
      const customId3_p2 = 7;

      const activeProfileIdsWithCustomDateRange: ActiveProfileIds = {
        ...activeProfileIds,
        customDateRanges: [
          {
            profileId: customId_p3,
            start: new Date(2023, 3, 20),
            end: new Date(2023, 3, 21),
            priority: 3,
          },
          {
            profileId: customId2_p1,
            start: new Date(2023, 3, 10),
            end: new Date(2023, 3, 21),
            priority: 1,
          },
          {
            profileId: customId3_p2,
            start: new Date(2023, 3, 15),
            end: new Date(2023, 3, 21),
            priority: 2,
          },
        ],
      };
      const expectedWithCustomDateRange: ProfileIdsStore = {
        byDate: {
          '2023-04-10': customId2_p1,
          '2023-04-11': customId2_p1,
          '2023-04-12': customId2_p1,
          '2023-04-13': customId2_p1,
          '2023-04-14': customId2_p1,
          '2023-04-15': customId3_p2,
          '2023-04-16': customId3_p2,
          '2023-04-17': customId3_p2,
          '2023-04-18': customId3_p2,
          '2023-04-19': customId3_p2,
          '2023-04-20': customId_p3,
          '2023-04-21': customId_p3,
        },
        dates: [
          '2023-04-10',
          '2023-04-11',
          '2023-04-12',
          '2023-04-13',
          '2023-04-14',
          '2023-04-15',
          '2023-04-16',
          '2023-04-17',
          '2023-04-18',
          '2023-04-19',
          '2023-04-20',
          '2023-04-21',
        ],
      };
      const profileIdsStore = ProfileUtil.buildProfileIdsStore(
        activeProfileIdsWithCustomDateRange,
        {
          start: new Date(2023, 3, 10),
          end: new Date(2023, 3, 21),
        }
      );
      expect(profileIdsStore).toEqual(expectedWithCustomDateRange);
    });

    it('should prioritize holidays over weekends and weekdays', () => {
      const holidays = [
        new Date(2023, 3, 9),
        new Date(2023, 3, 10),
        new Date(2023, 3, 11),
        new Date(2023, 3, 12),
      ];
      const expectedWithHolidays: ProfileIdsStore = {
        byDate: {
          '2023-04-08': weekendId,
          '2023-04-09': holidayId,
          '2023-04-10': holidayId,
          '2023-04-11': holidayId,
          '2023-04-12': holidayId,
          '2023-04-13': weekdayId,
        },
        dates: ['2023-04-08', '2023-04-09', '2023-04-10', '2023-04-11', '2023-04-12', '2023-04-13'],
      };
      const profileIdsStore = ProfileUtil.buildProfileIdsStore(
        activeProfileIds,
        { start: new Date(2023, 3, 8), end: new Date(2023, 3, 13) },
        holidays
      );
      expect(profileIdsStore).toEqual(expectedWithHolidays);
    });

    it('should return an empty object if no profiles exist', () => {
      const profileIdsStore = ProfileUtil.buildProfileIdsStore(
        {
          weekday: null,
          weekend: null,
          holiday: null,
          customDateRanges: [],
        },
        { start: from, end: to }
      );
      expect(profileIdsStore).toEqual({
        byDate: {},
        dates: [],
      });
    });
  });

  describe('getOrderedCustomDateRangesInRange', () => {
    const start1 = new Date(2023, 0, 1);
    const end1 = new Date(2023, 1, 1);
    const start2 = new Date(2023, 0, 5);
    const end2 = new Date(2023, 2, 1);
    const start3 = new Date(2023, 2, 15);
    const end3 = new Date(2023, 3, 15);
    const customDateRange1: ProfileDateRange = {
      profileId: 1,
      start: start1,
      end: end1,
      priority: 1,
    };
    const customDateRange2: ProfileDateRange = {
      profileId: 2,
      start: start2,
      end: end2,
      priority: 2,
    };
    const customDateRange3: ProfileDateRange = {
      profileId: 3,
      start: start3,
      end: end3,
      priority: 1,
    };

    it('should return an ordered list of custom date ranges that are in the given range', () => {
      const customDateRanges = ProfileUtil.getOrderedCustomDateRangesInRange(
        [customDateRange1, customDateRange2, customDateRange3],
        new Date(2023, 0, 15),
        new Date(2023, 1, 15)
      );
      expect(customDateRanges).toEqual([customDateRange2, customDateRange1]);
    });

    it('should return an empty list if no custom date ranges exist', () => {
      const customDateRanges = ProfileUtil.getOrderedCustomDateRangesInRange([], start1, end1);
      expect(customDateRanges).toEqual([]);
    });

    it('should return an empty list if no custom date ranges are in the given range', () => {
      const customDateRanges = ProfileUtil.getOrderedCustomDateRangesInRange(
        [customDateRange1, customDateRange2],
        new Date(2023, 2, 15),
        new Date(2023, 3, 15)
      );
      expect(customDateRanges).toEqual([]);
    });
  });

  describe('getActiveWeekdayProfile', () => {
    it('should return the weekday profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveWeekdayProfile(profiles);
      expect(profile?.priority).toBe(2);
    });

    it('should return null if no weekday profiles exist', () => {
      const profile = ProfileUtil.getActiveWeekdayProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getActiveWeekendProfile', () => {
    it('should return the weekend profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveWeekendProfile(profiles);
      expect(profile?.priority).toBe(2);
    });

    it('should return null if no weekend profiles exist', () => {
      const profile = ProfileUtil.getActiveWeekendProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getActiveHolidayProfile', () => {
    it('should return the holiday profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveHolidayProfile(profiles);
      expect(profile?.priority).toBe(3);
    });

    it('should return null if no holiday profiles exist', () => {
      const profile = ProfileUtil.getActiveHolidayProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getCustomProfileDateRanges', () => {
    const start1 = new Date(2023, 0, 1);
    const end1 = new Date(2023, 1, 1);
    const start2 = new Date(2023, 0, 5);
    const end2 = new Date(2023, 2, 1);

    const customProfiles: Profile[] = [
      {
        id: 1,
        profileType: {
          type: 'custom',
          dateRangeStart: start1,
          dateRangeEnd: end1,
        },
        priority: 2,
      },
      {
        id: 2,
        profileType: {
          type: 'custom',
          dateRangeStart: start2,
          dateRangeEnd: end2,
        },
        priority: 1,
      },
    ];
    const expected1: ProfileDateRange = {
      profileId: 1,
      start: start1,
      end: end1,
      priority: 2,
    };
    const expected2: ProfileDateRange = {
      profileId: 2,
      start: start2,
      end: end2,
      priority: 1,
    };

    it('should return custom profiles ranges', () => {
      const ranges = ProfileUtil.getCustomProfileDateRanges(customProfiles);
      expect(ranges).toEqual([expected1, expected2]);
    });

    it('should return an empty array if no custom profiles exist', () => {
      const ranges = ProfileUtil.getCustomProfileDateRanges([]);
      expect(ranges).toEqual([]);
    });

    it('should not return undefined elements', () => {
      const customProfilesWithNull: Profile[] = [
        customProfiles[0],
        {
          profileType: {
            type: 'custom',
            dateRangeStart: start2,
            dateRangeEnd: end2,
          },
        },
      ];

      const ids = ProfileUtil.getCustomProfileDateRanges(customProfilesWithNull);
      expect(ids).toEqual([expected1]);
    });

    it('should not return profiles that are not custom', () => {
      const customProfilesWithOtherTypes: Profile[] = [
        customProfiles[0],
        {
          id: 3,
          profileType: { type: ProfileTypes.Weekday, dateRangeStart: start1, dateRangeEnd: end1 },
        },
        {
          id: 4,
          profileType: { type: ProfileTypes.Weekend, dateRangeStart: start2, dateRangeEnd: end2 },
        },
      ];

      const ids = ProfileUtil.getCustomProfileDateRanges(customProfilesWithOtherTypes);
      expect(ids).toEqual([expected1]);
    });
  });

  describe('getProfileDateRange', () => {
    it('should return the date range for a custom profile type', () => {
      const customProfileType: ProfileType = {
        type: 'custom',
        dateRangeStart: new Date('2023-05-01'),
        dateRangeEnd: new Date('2023-05-31'),
      };
      const dateRange = ProfileUtil.getProfileDateRange(customProfileType);
      expect(dateRange).toEqual({
        start: customProfileType.dateRangeStart as Date,
        end: customProfileType.dateRangeEnd as Date,
      });
    });

    it('should return null for a profile type that is not custom', () => {
      const profileType: ProfileType = {
        type: ProfileTypes.Weekday,
        dateRangeEnd: new Date(),
        dateRangeStart: new Date(),
      };
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
      profileType.type = ProfileTypes.Weekend;
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
      profileType.type = ProfileTypes.Holiday;
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
    });
  });

  describe('isWeekdayProfile', () => {
    it('should return true if type is Weekday', () => {
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Weekday)).toBeTrue();
    });

    it('should return false if type is not Weekday', () => {
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Weekend)).toBeFalse();
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });

  describe('isWeekendProfile', () => {
    it('should return true if type is Weekend', () => {
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Weekend)).toBeTrue();
    });

    it('should return false if type is not Weekend', () => {
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });

  describe('isHolidayProfile', () => {
    it('should return true if type is Holiday', () => {
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Holiday)).toBeTrue();
    });

    it('should return false if type is not Holiday', () => {
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Weekend)).toBeFalse();
    });
  });

  describe('isCustomProfile', () => {
    it('should return true if type is Custom', () => {
      expect(ProfileUtil.isCustomProfile('custom')).toBeTrue();
    });

    it('should return false if type is not Custom', () => {
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Weekend)).toBeFalse();
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });

  describe('getDateValuesForProfile', () => {
    it('should return the date values for a weekday', () => {
      const dateValues = ProfileUtil.getDateValuesForProfile(new Date(2023, 4, 1));
      expect(dateValues).toEqual({
        formattedDate: '2023-05-01',
        isHoliday: false,
        isWeekend: false,
      });
    });

    it('should return the date values for a weekend', () => {
      const dateValues = ProfileUtil.getDateValuesForProfile(new Date(2023, 4, 6));
      expect(dateValues).toEqual({
        formattedDate: '2023-05-06',
        isHoliday: false,
        isWeekend: true,
      });
    });

    it('should return the date values for a holiday', () => {
      const date1 = new Date(2023, 4, 6);
      const date2 = new Date(2023, 4, 7);
      const date3 = new Date(2023, 4, 8);
      const holidays = [date1, date2, date3];

      const dateValues1 = ProfileUtil.getDateValuesForProfile(date1, holidays);
      const dateValues2 = ProfileUtil.getDateValuesForProfile(date2, holidays);
      const dateValues3 = ProfileUtil.getDateValuesForProfile(date3, holidays);

      expect(dateValues1).toEqual({
        formattedDate: '2023-05-06',
        isHoliday: true,
        isWeekend: true,
      });
      expect(dateValues2).toEqual({
        formattedDate: '2023-05-07',
        isHoliday: true,
        isWeekend: true,
      });
      expect(dateValues3).toEqual({
        formattedDate: '2023-05-08',
        isHoliday: true,
        isWeekend: false,
      });
    });
  });
});
