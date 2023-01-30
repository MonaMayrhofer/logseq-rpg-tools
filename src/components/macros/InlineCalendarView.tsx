import React, { useState } from "react";
import { FunctionComponent } from "react";
import { CalendarDate } from "../../system";
import { TMP_SYSTEM } from "../../tmpSystem";
import { CalendarDisplay } from "../CalendarDisplay";

type InlineCalendarViewProps = any;
export const InlineCalendarView: FunctionComponent<InlineCalendarViewProps> =
  () => {
    const [date, setDate] = useState(new CalendarDate(0));

    return (
      <CalendarDisplay
        date={date}
        onDateChange={(d) => setDate(d)}
        system={TMP_SYSTEM}
      ></CalendarDisplay>
    );
  };
