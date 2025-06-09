import React, { FC, ReactNode } from "react";
import {
  dayPerWeekRange,
  monthDayOffsetsByWeekForYearMonth,
} from "../lib/date";
import type { BorderOptions, Weekday } from "../lib/types";
import "./months.css";

export interface MonthProps {
  year: number;
  month: number;
  locale: string;
  firstWeekday: Weekday;
  renderDay: (date: Date, cellID: string) => ReactNode;
  renderDayHeading?: (dayIndex: number) => ReactNode;
  borderOptions?: BorderOptions;
}

interface WeekdayHeadingsProps {
  weekdays: Weekday[];
  renderDayHeading: (dayIndex: number) => ReactNode;
}

const defaultBorderOptions: BorderOptions = {
  width: 1,
  color: "black",
};

function dateOfCalendarWeekAndWeekdayIndex(
  year: number,
  month: number,
  dayOffset: number
): Date {
  return new Date(year, month - 1, dayOffset);
}

function borderStyle(
  dayIndex: number,
  weekIndex: number,
  lastWeekIndex: number,
  borderOptions: BorderOptions | "no-border"
) {
  let borderWidth: number;
  let borderColor: string;

  if (borderOptions === "no-border") {
    borderWidth = 0;
    borderColor = "black";
  } else {
    ({ width: borderWidth, color: borderColor } = borderOptions);
  }

  return {
    borderTop: borderWidth,
    borderRight: dayIndex === 6 ? borderWidth : 0,
    borderBottom: weekIndex === lastWeekIndex ? borderWidth : 0,
    borderLeft: borderWidth,
    borderColor,
    borderStyle: "solid" as const,
  };
}

const WeekdayHeadings: FC<WeekdayHeadingsProps> = ({
  weekdays,
  renderDayHeading,
}) => (
  <div className="Month-week-header">
    {weekdays.map((dayIndex) => (
      <div className="Month-week-header-weekday" key={dayIndex}>
        {renderDayHeading?.(dayIndex)}
      </div>
    ))}
  </div>
);

export const Month: FC<MonthProps> = ({
  year,
  month,
  firstWeekday,
  renderDay,
  renderDayHeading,
  borderOptions,
}) => {
  const orderedWeekdays = dayPerWeekRange(firstWeekday);
  const weeks = monthDayOffsetsByWeekForYearMonth(year, month, firstWeekday);

  return (
    <div className="Month-month">
      {renderDayHeading && (
        <WeekdayHeadings
          weekdays={orderedWeekdays}
          renderDayHeading={renderDayHeading}
        />
      )}
      {weeks.map((dayOffsets, weekIndex) => (
        <div key={`${year}-${month}-${weekIndex}`} className="Month-week">
          {dayOffsets.map((dayOffset, dayIndex) => {
            const cellDate = dateOfCalendarWeekAndWeekdayIndex(
              year,
              month,
              dayOffset
            );
            const cellID = `${weekIndex}-${dayOffset}`;
            return (
              <div
                key={cellID}
                id={`Month-day-${cellID}`}
                className="Month-day"
                style={borderStyle(
                  dayIndex,
                  weekIndex,
                  weeks.length - 1,
                  borderOptions ?? defaultBorderOptions
                )}
              >
                {renderDay(cellDate, cellID)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
