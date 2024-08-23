import { formatDate } from '../src/util/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      [new Date('2022-01-13T00:00:00'), 'January 13, 2022 at 00:00 AM'],
      [new Date('2022-02-04T01:05:00'), 'February 4, 2022 at 01:05 AM'],
      [new Date('2022-03-20T19:55:00'), 'March 20, 2022 at 07:55 PM'],
      [new Date('2022-04-13T10:10:00'), 'April 13, 2022 at 10:10 AM'],
      [new Date('2022-05-31T20:00:00'), 'May 31, 2022 at 08:00 PM'],
      [new Date('2022-06-01T04:05:00'), 'June 1, 2022 at 04:05 AM'],
      [new Date('2022-07-21T18:01:00'), 'July 21, 2022 at 06:01 PM'],
      [new Date('2022-08-24T14:41:00'), 'August 24, 2022 at 02:41 PM'],
      [new Date('2022-09-03T19:00:00'), 'September 3, 2022 at 07:00 PM'],
      [new Date('2022-10-05T12:00:00'), 'October 5, 2022 at 12:00 PM'],
      [new Date('2022-11-07T13:15:00'), 'November 7, 2022 at 01:15 PM'],
      [new Date('2022-12-15T23:45:00'), 'December 15, 200 at 11:45 PM'],
    ])(
      'returns formatted date when passing datetime string #%#',
      (date, expected) => {
        expect(formatDate(date)).toBe(expected);
      },
    );
  });
});
