// src/app/lib/Calendar.tsx

import React, { FC, ReactNode } from "react";
import { Month } from "./months";
import type { BorderOptions, Weekday } from "../lib/types";

interface CalendarProps {
  year: number;
  month: number;
  locale: string;
  firstWeekday?: Weekday; // defaults to 0/Sunday
  renderDay: (date: Date, cellID: string) => ReactNode;
  renderDayHeading?: (dayIndex: number) => ReactNode;
  renderHeading?: () => ReactNode;
  borderOptions?: BorderOptions;
}

export const Calender: FC<CalendarProps> = ({
  year,
  month,
  locale,
  firstWeekday = 0,
  renderDay,
  renderDayHeading,
  renderHeading,
  borderOptions,
}) => {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
      {renderHeading && renderHeading()}
      <Month
        locale={locale}
        year={year}
        month={month}
        firstWeekday={firstWeekday}
        renderDay={renderDay}
        renderDayHeading={renderDayHeading}
        borderOptions={borderOptions}
      />
    </div>
  );
};
