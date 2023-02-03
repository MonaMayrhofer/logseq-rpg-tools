import React, { useState } from "react";
import { FunctionComponent } from "react";
import { CalendarDisplay } from "./components/CalendarDisplay";
import { CalendarDate, CalendarSystem } from "./lib/system";

type FunctionComponentProps = {
  system: CalendarSystem;
};

export const Calendar: FunctionComponent<FunctionComponentProps> = ({
  system,
}) => {
  const [date, setDate] = useState(new CalendarDate(0));
  return (
    <CalendarDisplay
      system={system}
      date={date}
      onDateChange={(d) => setDate(d)}
    ></CalendarDisplay>
  );
};
