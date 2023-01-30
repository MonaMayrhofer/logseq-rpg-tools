import React, { useMemo } from "react";
import { FunctionComponent } from "react";
import { LongFormat } from "../lib/format";
import { CalendarDate, CalendarSystem } from "../system";

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
    if (d < startOfMonthWeekday) {
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
  if (lastWeekDays != 0) {
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

  return rows;
}

export type CalendarDisplayProps = {
  system: CalendarSystem;
  date: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
};

export const CalendarDisplay: FunctionComponent<CalendarDisplayProps> = ({
  system,
  date,
  onDateChange,
}) => {
  const weekday = date.weekDay(system);

  const cells = useMemo(() => buildCalendarGrid(system, date), [system, date]);

  return (
    <div className="">
      <div className="">
        <button
          onClick={() => onDateChange(date.addMonths(system, -1))}
          className=""
        >
          -
        </button>

        <div className="">{date.format(system, LongFormat)}</div>

        <button
          onClick={() => onDateChange(date.addMonths(system, 1))}
          className=""
        >
          +
        </button>
      </div>

      <div
        // className="flex flex-row border-b border-gray-500"
        className="rpg-calendar--day-row"
      >
        {system.descriptor.dayNames.map((name) => (
          <div key={name} className="">
            {name}
          </div>
        ))}
      </div>
      <div
        // className="flex flex-col border-l border-gray-500"
        className="rpg-calendar--content-body"
      >
        {cells.map((row, index) => (
          <div
            key={index}
            // className="flex flex-row border-b border-gray-500"
            className="rpg-calendar--content-row"
          >
            {row.map((day, index) => (
              <div
                key={index}
                // className="flex flex-col items-center p-2 border-r border-gray-500 grow shrink-1 basis-0"
                className="rpg-calendar--day"
              >
                {day.outside ? <div></div> : <span>{day.dayOfMonth}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
