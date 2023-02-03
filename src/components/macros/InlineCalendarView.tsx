import React, { useMemo, useState } from "react";
import { useCallback } from "react";
import { FunctionComponent } from "react";
import { useCalendarSystem } from "../../hooks/useCalendarSystem";
import { DbQuery, useDbQuery } from "../../hooks/useDbQuery";
import { CalendarDate } from "../../system";
import {
  CalendarDisplay,
  CalendarEvent,
  EventClickData,
  Events,
} from "../CalendarDisplay";

const EVENTS_QUERY: DbQuery = {
  query: `
      [
        :find ?date (pull ?b [*])
        :in $ %
        :where
        (rpg-date ?b ?date)
        (not-preblock ?b)
      ]

    `,
  // [(>= ?date 0)]
  // [(< ?date 10)]
  inputs: `
      [
        [(rpg-date ?b ?datenum)
          [?b :block/properties ?prop ]
          [(get ?prop :rpg-date) ?date ]
          [(re-pattern "{{tgs (\\\\d+)}}") ?pattern]
          [(re-find ?pattern ?date) (_ ?datenumstr)]
          [(- ?datenumstr 0) ?datenum]
        ]
        [(not-preblock ?b) 
          [(get-else $ ?b :block/pre-block? false) ?preblock]
          [(= ?preblock false)]
        ]
      ]
    `,
};

type InlineCalendarViewProps = any;
export const InlineCalendarView: FunctionComponent<InlineCalendarViewProps> =
  () => {
    const [date, setDate] = useState(new CalendarDate(0));

    const { loading, data } = useDbQuery(EVENTS_QUERY);

    console.log(logseq.settings);

    const system = useCalendarSystem();

    const events = useMemo(() => {
      if (!loading) {
        const events: Events = {};
        console.log("D", data);
        data.forEach(([date, block]: any) => {
          if (!(date in events)) {
            events[date] = [];
          }
          console.log(block);
          events[date].push({
            date: new CalendarDate(date),
            name: block.properties["event-name"] ?? block.name ?? block.uuid,
            target: {
              block: block.name !== undefined,
              name: block.name ?? block.uuid,
            },
          });
        });
        return events;
      } else {
        return undefined;
      }
    }, [data, loading]);

    const onEventClick = useCallback((e: CalendarEvent) => {
      console.log("Navigating to event", e);
      logseq.App.pushState("page", {
        name: e.target.name,
      });
    }, []);

    if (events === undefined) {
      return <div className="rpg-calendar--inline-container">...</div>;
    } else if (system === undefined) {
      return (
        <div className="rpg-calendar--inline-container">Invalid Settings</div>
      );
    } else {
      return (
        <div className="rpg-calendar--inline-container">
          <CalendarDisplay
            date={date}
            onDateChange={(d) => setDate(d)}
            system={system}
            events={events}
            onEventClick={onEventClick}
          ></CalendarDisplay>
        </div>
      );
    }
  };
