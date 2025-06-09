import { arrayRotate } from "./array";
import { range } from "./range";
import type { Week, Weekday } from "./types";

export type YearFormat = "numeric" | "2-digit";
export type MonthFormat = "numeric" | "2-digit" | "narrow" | "short" | "long";
export type WeekdayFormat = "narrow" | "short" | "long";

/**
 * Returns a localized string for the first day of the given month and year.
 */
export function localizedYearMonth(
  locale: string,
  monthFormat: MonthFormat,
  yearFormat: YearFormat,
  year: number,
  month: number
): string {
  const firstOfMonth = new Date(year, month - 1, 1);
  return firstOfMonth.toLocaleDateString(locale, {
    month: monthFormat,
    year: yearFormat,
  });
}

/**
 * Returns an array of weekday names (strings), starting from Sunday.
 */
export function localizedWeekdayNames(
  locale: string,
  format: WeekdayFormat
): Week {
  const sunday = new Date(259200000); // Jan 4, 1970 is a Sunday
  const names = range(0, 7).map((_, i) => {
    const date = new Date(sunday.valueOf());
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString(locale, {
      weekday: format,
      timeZone: "utc",
    });
  });
  return names as Week;
}

/**
 * Rotate the localized weekday names so that they start on `startingWeekDay`.
 */
export function localizedWeekdayNamesStartingWith(
  locale: string,
  format: WeekdayFormat,
  startingWeekDay: Weekday
): Week {
  const names = localizedWeekdayNames(locale, format);
  // Rotate the array of strings; cast back to Week
  return arrayRotate<string>(names, startingWeekDay) as Week;
}
