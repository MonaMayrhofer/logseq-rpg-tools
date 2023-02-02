import React, { useMemo } from "react";
import { FunctionComponent } from "react";
import { useCalendarGrid } from "../hooks/calendarGrid";
import { LongFormat } from "../lib/format";
import { CalendarDate, CalendarSystem } from "../system";

export type CalendarDisplayProps = {
  system: CalendarSystem;
  date: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
  events: Events;
};

export type Event = {
  date: CalendarDate;
  name: string;
};

export type Events = Record<number, Event[]>;

export const CalendarDisplay: FunctionComponent<CalendarDisplayProps> = ({
  system,
  date,
  events,
  onDateChange,
}) => {
  const cells = useCalendarGrid(system, date);

  return (
    <div className="rpg-calendar--container">
      <div className="rpg-calendar--navigator">
        <button
          onClick={() => onDateChange(date.addMonths(system, -1))}
          className=""
        >
          &lt;
        </button>

        <h1>{date.format(system, LongFormat)}</h1>

        <button
          onClick={() => onDateChange(date.addMonths(system, 1))}
          className=""
        >
          &gt;
        </button>
      </div>

      <div className="rpg-calendar--day-header-row">
        {system.descriptor.dayNames.map((name) => (
          <div key={name} className="rpg-calendar--day-header">
            {name}
          </div>
        ))}
      </div>
      <div className="">
        {cells.map((row, index) => (
          <div key={index} className="rpg-calendar--day-row">
            {row.map((day, index) => (
              <div
                key={index}
                // className="flex flex-col items-center p-2 border-r border-gray-500 grow shrink-1 basis-0"
                className="rpg-calendar--day"
              >
                {day.outside ? (
                  <div></div>
                ) : (
                  <>
                    <span>{day.dayOfMonth + 1}</span>
                    {day.date &&
                      events[day.date.date]?.map((event, index) => (
                        <div key={index}>E</div>
                      ))}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
