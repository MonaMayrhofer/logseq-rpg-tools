import { useMemo } from "react";
import { CalendarDate, CalendarSystem } from "../lib/system";

function buildCalendarGrid(system: CalendarSystem, date: CalendarDate) {
  const weekLength = system.descriptor.dayNames.length;
  const startOfMonth = date.startOfMonth(system);
  const startOfMonthWeekday = startOfMonth.weekDay(system);
  const dateDetails = date.deconstruct(system);
  const period = system.descriptor.period.years[dateDetails.yearInPeriod];
  const monthDays = period.monthDurations[dateDetails.month];

  const rows = [];
  //First row;
  const firstRow = [];
  for (let d = 0; d < weekLength; d++) {
    if (d < startOfMonthWeekday || d >= monthDays) {
      firstRow.push({
        outside: true,
      });
    } else {
      const dayOfMonth = d - startOfMonthWeekday;
      firstRow.push({
        dayOfMonth,
        date: startOfMonth.addDays(dayOfMonth),
        outside: false,
      });
    }
  }
  rows.push(firstRow);

  const daysLeft = monthDays - (weekLength - startOfMonthWeekday);
  if (daysLeft > 0) {
    const weeks = Math.floor(daysLeft / weekLength);

    //Medium rows:
    for (let w = 0; w < weeks; w++) {
      const row = [];
      for (let d = 0; d < weekLength; d++) {
        const dayOfMonth =
          w * weekLength + d + (weekLength - startOfMonthWeekday);
        row.push({
          dayOfMonth,
          date: startOfMonth.addDays(dayOfMonth),
          outside: false,
        });
      }
      rows.push(row);
    }

    //Last row
    const lastWeekDays = daysLeft % weekLength;
    if (lastWeekDays > 0) {
      const lastRow = [];
      for (let d = 0; d < weekLength; d++) {
        if (d < lastWeekDays) {
          const dayOfMonth =
            weekLength * weeks + d + (weekLength - startOfMonthWeekday);
          lastRow.push({
            dayOfMonth,
            date: startOfMonth.addDays(dayOfMonth),
            outside: false,
          });
        } else {
          lastRow.push({
            outside: true,
          });
        }
      }
      rows.push(lastRow);
    }
  }

  return rows;
}

export function useCalendarGrid(system: CalendarSystem, date: CalendarDate) {
  return useMemo(() => buildCalendarGrid(system, date), [system, date]);
}
