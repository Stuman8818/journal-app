// src/app/lib/util/calendarUtils.ts

import { range } from "./range";
import { arrayRotate } from "./array";
import type { Weekday } from "./types";

/**
 * Treats a Date as UTC by offsetting by the timezone offset.
 */
function treatAsUTC(date: Date): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

/**
 * Returns the number of days between two dates, treating both as UTC midnights.
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (
    (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) /
    millisecondsPerDay
  );
}

/**
 * Returns [0,1,2,3,4,5,6] rotated so that `firstCalendarWeekday` comes first.
 */
export const dayPerWeekRange = (firstCalendarWeekday: Weekday): Weekday[] =>
  arrayRotate<Weekday>([0, 1, 2, 3, 4, 5, 6], firstCalendarWeekday);

/**
 * How many days in the first calendar week, given the month's first day and
 * the chosen first weekday of the week.
 */
export function daysInFirstCalendarWeek(
  firstDayOfTheMonth: Date,
  firstCalendarWeekday: Weekday
): number {
  const indexOfFirstWeekdayOfMonth = firstDayOfTheMonth.getDay();
  if (indexOfFirstWeekdayOfMonth == null) {
    throw new Error("Invalid first day of the month");
  }
  if (indexOfFirstWeekdayOfMonth >= firstCalendarWeekday) {
    return 7 - indexOfFirstWeekdayOfMonth + firstCalendarWeekday;
  }
  return firstCalendarWeekday - indexOfFirstWeekdayOfMonth;
}

/**
 * Returns the weekday (0=Sun … 6=Sat) of the first day of the given month.
 */
export function firstWeekdayInMonth(year: number, month: number): Weekday {
  return new Date(year, month - 1, 1).getDay() as Weekday;
}

/**
 * If a day offset is before the firstCalendarWeekday, shift it into the next week.
 */
export function adjustedDayOffsetBasedOnFirstCalendarWeekday(
  dayOffset: number,
  firstCalendarWeekday: number
): number {
  let adjusted = dayOffset;
  if (adjusted < firstCalendarWeekday) {
    adjusted += 7;
  }
  return adjusted;
}

/**
 * Returns a 2D array of day numbers laid out by week for the given month.
 */
export function monthDayOffsetsByWeekForYearMonth(
  year: number,
  month: number,
  firstCalendarWeekday: Weekday
): number[][] {
  const weekdayOfTheFirst = firstWeekdayInMonth(year, month);
  const orderedWeekdays = dayPerWeekRange(firstCalendarWeekday);
  const firstDayOffset = adjustedDayOffsetBasedOnFirstCalendarWeekday(
    orderedWeekdays[0],
    firstCalendarWeekday
  );
  const adjustedFirstOffset =
    firstDayOffset > weekdayOfTheFirst ? firstDayOffset - 7 : firstDayOffset;
  const startOffset = adjustedFirstOffset - weekdayOfTheFirst + 1;
  const weeks = calendarWeeksInMonth(year, month, firstCalendarWeekday);

  return range(0, weeks).map((weekIndex) =>
    orderedWeekdays.map((_, dayIndex) => startOffset + weekIndex * 7 + dayIndex)
  );
}

/**
 * How many calendar rows (weeks) are needed to display the entire month.
 */
export function calendarWeeksInMonth(
  year: number,
  month: number,
  firstCalendarWeekday: Weekday
): number {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayPrevMonth = new Date(year, month - 1, 0);
  const lastDayOfMonth = new Date(year, month, 0);
  const totalDays = daysBetween(lastDayPrevMonth, lastDayOfMonth);
  const firstWeekDays = daysInFirstCalendarWeek(
    firstDayOfMonth,
    firstCalendarWeekday
  );
  const remaining = totalDays - firstWeekDays;
  return Math.ceil(remaining / 7) + 1;
}

/**
 * Increment or decrement a { year, month } pair.
 */
export function nextYearMonth(args: { year: number; month: number }): {
  year: number;
  month: number;
} {
  const { year, month } = args;
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

export function previousYearMonth(args: { year: number; month: number }): {
  year: number;
  month: number;
} {
  const { year, month } = args;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

/**
 * Convenience aliases using separate args.
 */
export function nextMonth(
  year: number,
  month: number
): { year: number; month: number } {
  return nextYearMonth({ year, month });
}

export function previousMonth(
  year: number,
  month: number
): { year: number; month: number } {
  return previousYearMonth({ year, month });
}
