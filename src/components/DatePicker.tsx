import React from "react";
import { FunctionComponent } from "react";
import { closeCurrentApp } from "./Modal";
import "./DatePicker.css";
import { FormEventHandler } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { SETTINGS } from "../lib/settings";
import { LongFormat } from "../lib/format";
import { CalendarDate } from "../lib/system";

export type OnDatePickedHandler = (date: CalendarDate) => void;

type DatePickerProps = {
  onDatePicked: OnDatePickedHandler;
};
export const DatePicker: FunctionComponent<DatePickerProps> = ({
  onDatePicked,
}) => {
  const [text, setText] = useState("");
  const system = SETTINGS.getMasterCalendarSystem();

  const parsed = useMemo(() => {
    return system?.parse(text);
  }, [text, system]);

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
      {parsed && system && (
        <div className="rpg-date--datepicker-preview">
          {parsed.format(system, LongFormat)}
        </div>
      )}
    </form>
  );
};
