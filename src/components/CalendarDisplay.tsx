import React, { useMemo } from "react";
import { FunctionComponent } from "react";
import { CalendarDate, CalendarSystem } from "../system";

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
  const dateDetails = useMemo(() => date.deconstruct(system), [date, system]);

  const monthDays =
    system.descriptor.period.years[dateDetails.yearInPeriod].monthDurations[
      dateDetails.month
    ];

  const weekday = date.weekDay(system);

  const startOfMonthWeekday = useMemo(
    () => date.startOfMonth(system).weekDay(system),
    [system, date]
  );

  const weekLength = system.descriptor.dayNames.length;
  const cells = useMemo(() => {
    const rows = [];
    //First row;
    const firstRow = [];
    for (let d = 0; d < weekLength; d++) {
      if (d < startOfMonthWeekday) {
        firstRow.push("O");
      } else {
        firstRow.push({
          dayOfMonth: d - startOfMonthWeekday,
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
        row.push({
          dayOfMonth: w * weekLength + d + (weekLength - startOfMonthWeekday),
        });
      }
      rows.push(row);
    }

    //Last row
    const lastWeekDays = daysLeft % weekLength;
    const lastRow = [];
    for (let d = 0; d < weekLength; d++) {
      if (d < lastWeekDays) {
        lastRow.push({
          dayOfMonth:
            weekLength * weeks + d + (weekLength - startOfMonthWeekday),
        });
      } else {
        lastRow.push("O");
      }
    }
    rows.push(lastRow);

    return rows;
  }, [monthDays, startOfMonthWeekday, weekLength]);

  console.log(cells);

  return (
    <div className="flex flex-col text-white bg-slate-700">
      <div>{date.date}</div>
      <div>{startOfMonthWeekday}</div>
      <div>
        {dateDetails.dayOfMonth}.{dateDetails.month}.{dateDetails.year} -{" "}
        {weekday}
      </div>
      <button onClick={() => onDateChange(date.addDays(1))}>+</button>
      <button onClick={() => onDateChange(date.addDays(-1))}>-</button>

      <div className="flex flex-row">
        {system.descriptor.dayNames.map((name) => (
          <div key={name} className="">
            {name}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {cells.map((row, index) => (
          <div key={index} className="flex flex-row">
            {row.map((day, index) => (
              <div key={index} className="flex-grow">
                {JSON.stringify(day)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
