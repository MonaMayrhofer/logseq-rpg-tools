import React from "react";
import { FunctionComponent } from "react";
import { closeCurrentApp } from "./Modal";
import "./DatePicker.css";
import { FormEventHandler } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { SETTINGS } from "../lib/settings";
import { LongFormat } from "../lib/format";
import { CalendarDate, CalendarSystem } from "../lib/system";

export type OnDatePickedHandler = (date: CalendarDate) => void;

type UNITS = "week" | "day" | "year" | "month";
const UNIT_TRANS: Record<string, UNITS> = {
  w: "week",
  d: "day",
  y: "year",
  m: "month",
};

const RELREG = /((-|\+)\d+)(w|d|y|m)/g;
function parseRelative(
  relative: string,
  current: CalendarDate,
  system: CalendarSystem
): CalendarDate {
  const matches = relative.matchAll(RELREG);

  const matchStr = [];

  let accu = current;

  for (const m of matches) {
    console.log(m[1], m[3]);
    const unit = UNIT_TRANS[m[3]];
    const amount = parseInt(m[1]);
    if (unit !== undefined && !isNaN(amount)) {
      matchStr.push(m[0]);
      if (unit === "week") {
        accu = accu.addDays(7 * amount);
      } else if (unit === "day") {
        accu = accu.addDays(amount);
      } else if (unit === "year") {
        accu = accu.addYears(system, amount);
      } else if (unit === "month") {
        accu = accu.addMonths(system, amount);
      }
    }
  }
  console.log(matchStr);
  console.log(accu);

  return accu;
}

type DatePickerProps = {
  onDatePicked: OnDatePickedHandler;
};
export const DatePicker: FunctionComponent<DatePickerProps> = ({
  onDatePicked,
}) => {
  const [text, setText] = useState("");
  const system = SETTINGS.getMasterCalendarSystem();
  const currentDate = SETTINGS.getCurrentDate();

  const parsed = useMemo(() => {
    if (system === undefined) {
      return null;
    }
    const parsedDate = system.parse(text);
    if (parsedDate !== undefined) {
      console.log("Parsed");
      return parsedDate;
    }
    const relative = parseRelative(text, currentDate, system);
    if (relative !== undefined) {
      console.log("Parsed Relative");
      return relative;
    }
    return null;
  }, [text, system, currentDate]);

  const submit: FormEventHandler = (e) => {
    console.log(parsed);
    e.preventDefault();
    if (parsed) {
      console.log("INSERT DATE");
      // logseq.Editor.insertAtEditingCursor(`{{tgs ${parsed?.date}}}`).then(
      //   (it) => console.log("OK")
      // );
      onDatePicked(parsed);
    }
    closeCurrentApp();
  };

  return (
    <form onSubmit={submit} className="rpg-date--datepicker-form">
      <input
        autoFocus={true}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {system && (
        <>
          {parsed && (
            <>
              <div className="rpg-date--datepicker-preview">
                {parsed.format(system, LongFormat)}
              </div>
            </>
          )}
          <div>Current:</div>
          <div className="rpg-date--datepicker-preview">
            {currentDate.format(system, LongFormat)}
          </div>
        </>
      )}
    </form>
  );
};
