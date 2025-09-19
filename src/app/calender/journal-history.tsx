"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  _id: string; // "MM/DD/YYYY, HH:MM:SS"
  emotion: string;
  notes: string;
  water: number;
  sleep: number;
  outdoors: number;
  activity: number;
  cookedAtHome: boolean;
  eatingOutCost: number;
}

const CalendarPage: React.FC = () => {
  const router = useRouter();
  // defaultPosts is some Post[] you define above
  const defaultPosts: Post[] = [
    /* … */
  ];
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const locale = "en-us";

  const weekdays = useMemo(
    () => localizedWeekdayNames(locale, "long"),
    [locale]
  );

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [focusedCellID, setFocusedCellID] = useState<string | null>(null);

  // Fetch stored logs when component mounts
  useEffect(() => {
    async function fetchLatest() {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const arr: Post[] = Array.isArray(data) ? data : [data];
      setPosts(arr);
    }
    fetchLatest();
  }, []);

  const monthPosts = useMemo(() => {
    return posts.filter((log) => {
      const d = new Date(log.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [posts, year, month]);

  const {
    waterSum,
    sleepSum,
    activitySum,
    outdoorsSum,
    eatingOutCostSum,
    topEmotion,
  } = useMemo(() => {
    // 1) build a map YYYY-MM-DD → latest log of that day
    const latestByDay: Record<string, Post> = {};
    for (const log of monthPosts) {
      const dayKey = new Date(log.date).toISOString().slice(0, 10);
      const existing = latestByDay[dayKey];
      if (!existing || new Date(log.date) > new Date(existing.date)) {
        latestByDay[dayKey] = log;
      }
    }

    // 2) extract only those latest-of-each-day posts
    const dailyLatest = Object.values(latestByDay);

    // 3) now sum them up
    let water = 0,
      sleep = 0,
      activity = 0,
      outdoors = 0,
      eatingOutCost = 0;
    const emotionCount: Record<string, number> = {};

    for (const log of dailyLatest) {
      water += log.water;
      sleep += log.sleep;
      activity += log.activity;
      outdoors += log.outdoors;
      eatingOutCost += log.eatingOutCost;
      emotionCount[log.emotion] = (emotionCount[log.emotion] || 0) + 1;
    }

    // 4) pick the most frequent emotion
    let top = "",
      max = 0;
    for (const [emo, cnt] of Object.entries(emotionCount)) {
      if (cnt > max) {
        max = cnt;
        top = emo;
      }
    }

    return {
      waterSum: water,
      sleepSum: sleep,
      activitySum: activity,
      outdoorsSum: outdoors,
      eatingOutCostSum: eatingOutCost,
      topEmotion: top || "—",
    };
  }, [monthPosts]);

  console.log(posts, "posts");
  const onDayFocused = useCallback((_: Date, cellID: string) => {
    setFocusedCellID(cellID);
  }, []);

  const onDayLostFocus = useCallback((_: Date, cellID: string) => {
    setFocusedCellID((prev) => (prev === cellID ? null : prev));
  }, []);

  const onDayClick = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today for comparison
    
    // Only allow clicks on past dates or today
    if (date <= today) {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      const dateParam = `${mm}/${dd}/${yyyy}`;
      router.push(`/?date=${encodeURIComponent(dateParam)}`);
    }
  }, [router]);

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
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const isClickable = date <= today;
      
      let color = "grey";
      let weight = "normal";
      if (isToday) {
        color = "blue";
        weight = "bold";
      } else if (inMonth) {
        color = isClickable ? "black" : "#ccc";
      }

      const focusStyle =
        focusedCellID === cellID
          ? { backgroundColor: "yellow", boxShadow: "0 0 5px blue" }
          : {};

      const cellKey = date.toLocaleDateString("en-US");

      const latestLogForDate = posts
        .filter((log) => {
          const d = new Date(log.date);
          return d.toLocaleDateString("en-US") === cellKey;
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      return (
        <>
          <div
            key={cellID}
            tabIndex={0}
            onFocus={() => onDayFocused(date, cellID)}
            onBlur={() => onDayLostFocus(date, cellID)}
            onClick={() => onDayClick(date)}
            className="calendar-day"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              cursor: isClickable ? "pointer" : "not-allowed",
              padding: 4,
              userSelect: "none",
              opacity: isClickable ? 1 : 0.6,
              ...focusStyle,
            }}
          >
            <div style={{ marginBottom: 4, color, fontWeight: weight }}>
              {dayText}
            </div>
            {latestLogForDate && (
              <div style={{ fontSize: 10, lineHeight: 1.2 }}>
                <p style={{ margin: 0 }}>
                  <strong>Emotion:</strong> {latestLogForDate.emotion}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Notes:</strong> {latestLogForDate.notes || "—"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Water:</strong> {latestLogForDate.water || "-"}{" "}
                  <strong>Sleep:</strong> {latestLogForDate.sleep || "-"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Outdoors:</strong> {latestLogForDate.outdoors || "-"}{" "}
                  <strong>Activity:</strong> {latestLogForDate.activity || "-"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Cooked at Home:</strong>{" "}
                  {latestLogForDate.cookedAtHome ? "Yes" : "No"}{" "}
                  <strong>Eating Out Cost:</strong> $
                  {latestLogForDate.eatingOutCost || "-"}
                </p>
              </div>
            )}
          </div>
        </>
      );
    },
    [locale, posts, focusedCellID, onDayFocused, onDayLostFocus, onDayClick]
  );

  const renderDayHeading = useCallback(
    (idx: number) => <div key={idx}>{weekdays[idx]}</div>,
    [weekdays]
  );

  const renderHeading = useCallback(
    () => (
      <>
        {/* Month title + nav */}
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

        {/* Single-row stats bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            padding: "0 1rem",
            fontSize: "0.9rem",
          }}
        >
          <div>💧 Water: {waterSum} oz</div>
          <div>🛏️ Sleep: {sleepSum} h</div>
          <div>🏃 Activity: {activitySum}</div>
          <div>🌳 Outdoors: {outdoorsSum} h</div>
          <div>🍽️ Eating Out: ${eatingOutCostSum}</div>
          <div>😊 Top Emotion: {topEmotion}</div>
        </div>
      </>
    ),
    [
      locale,
      year,
      month,
      waterSum,
      sleepSum,
      activitySum,
      outdoorsSum,
      eatingOutCostSum,
      topEmotion,
    ]
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
