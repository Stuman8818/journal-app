"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Calender } from "../components/calender";
import { DefaultCalendarHeading } from "../components/calender-header";
import { nextMonth, previousMonth } from "../lib/date";
import {
  localizedWeekdayNames,
  localizedYearMonth,
} from "../lib/localize-date";
import Header from "../components/header";

// Define the shape of a log entry
export interface Post {
  date: string;
  content: string;
}

interface CalendarPageProps {
  initialPosts: Post[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ initialPosts }) => {
  const locale = "en-us";

  const weekdays = useMemo(
    () => localizedWeekdayNames(locale, "long"),
    [locale]
  );

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [focusedCellID, setFocusedCellID] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  console.log(initialPosts, "intials posts");
  // Fetch stored logs when component mounts
  useEffect(() => {
    async function fetchLatest() {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error("Failed to fetch");
      const raw = await res.json(); // Post or Post[]
      const arr: Post[] = Array.isArray(raw) ? raw : [raw];
      setPosts(arr);
    }
    fetchLatest();
  }, []);

  console.log(posts, "posts");
  const onDayFocused = useCallback((_: Date, cellID: string) => {
    setFocusedCellID(cellID);
  }, []);

  const onDayLostFocus = useCallback((_: Date, cellID: string) => {
    setFocusedCellID((prev) => (prev === cellID ? null : prev));
  }, []);

  const renderDay = useCallback(
    (
      date: Date,
      cellID: string,
      selectedYear: number,
      selectedMonth: number
    ) => {
      const dayNum = date.getDate();
      const dayText =
        dayNum === 1
          ? `${date.toLocaleDateString(locale, { month: "short" })} ${dayNum}`
          : dayNum;

      const start = new Date(selectedYear, selectedMonth - 1, 1);
      const end = new Date(selectedYear, selectedMonth, 0);
      const inMonth = date >= start && date <= end;
      const isToday = date.toDateString() === new Date().toDateString();
      let color = "grey";
      let weight = "normal";
      if (isToday) {
        color = "blue";
        weight = "bold";
      } else if (inMonth) {
        color = "black";
      }

      const focusStyle =
        focusedCellID === cellID
          ? { backgroundColor: "yellow", boxShadow: "0 0 5px blue" }
          : {};

      const cellKey = date.toLocaleDateString("en-US");

      // grab your single “latest” entry
      const latest = posts[0];
      // build its local date string from the stored timestamp
      const latestKey = latest
        ? new Date(latest.date).toLocaleDateString("en-US")
        : null;
      const iso = date.toISOString().slice(0, 10);

      // if it exists, parse its date into a JS Date
      // const matchesCell =
      //   latest &&
      //   (() => {
      //     const pd = new Date(latest.date);
      //     return (
      //       pd.getFullYear() === date.getFullYear() &&
      //       pd.getMonth() === date.getMonth() &&
      //       pd.getDate() === date.getDate()
      //     );
      //   })();

      return (
        <>
          <div
            key={cellID}
            tabIndex={0}
            onFocus={() => onDayFocused(date, cellID)}
            onBlur={() => onDayLostFocus(date, cellID)}
            className="calendar-day"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              cursor: "pointer",
              padding: 4,
              userSelect: "none",
              ...focusStyle,
            }}
          >
            <div style={{ marginBottom: 4, color, fontWeight: weight }}>
              {dayText}
            </div>
            {latest && cellKey === latestKey && (
              <div style={{ fontSize: 10, lineHeight: 1.2 }}>
                <p style={{ margin: 0 }}>
                  <strong>Emotion:</strong> {latest.emotion}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Notes:</strong> {latest.notes || "—"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Water:</strong> {latest.water || "-"}
                  <strong>Sleep:</strong> {latest.sleep || "-"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Outdoors:</strong> {latest.outdoors || "-"}
                  <strong>Activity:</strong> {latest.activity || "-"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Cooked at Home:</strong>{" "}
                  {latest.cookedAtHome ? "Yes" : "No"}
                  <strong>Eating Out Cost:</strong> $
                  {latest.eatingOutCost || "-"}
                </p>
              </div>
            )}
          </div>
        </>
      );
    },
    [locale, posts, focusedCellID, onDayFocused, onDayLostFocus]
  );

  const renderDayHeading = useCallback(
    (idx: number) => <div key={idx}>{weekdays[idx]}</div>,
    [weekdays]
  );

  const renderHeading = useCallback(
    () => (
      <DefaultCalendarHeading
        title={localizedYearMonth(locale, "long", "numeric", year, month)}
        onNextMonthClicked={() => {
          const { year: y, month: m } = nextMonth(year, month);
          setYear(y);
          setMonth(m);
        }}
        onPreviousMonthClicked={() => {
          const { year: y, month: m } = previousMonth(year, month);
          setYear(y);
          setMonth(m);
        }}
      />
    ),
    [locale, year, month]
  );

  return (
    <div>
      <Header />
      <Calender
        locale={locale}
        year={year}
        month={month}
        renderDay={(date, id) => renderDay(date, id, year, month)}
        renderDayHeading={renderDayHeading}
        renderHeading={renderHeading}
        borderOptions={{ width: 1, color: "black" }}
      />
    </div>
  );
};

export default CalendarPage;

/*
  Note:
  1. API route is at `app/api/logs/route.ts` — GET returns all logs, POST inserts { date, content }.
  2. Home page (`app/page.tsx`) should POST to `/api/logs` with JSON `{ date: new Date().toISOString().slice(0,10), content }`.
*/
