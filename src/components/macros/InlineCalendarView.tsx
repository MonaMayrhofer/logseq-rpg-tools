import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { CalendarDate } from "../../system";
import { TMP_SYSTEM } from "../../tmpSystem";
import { CalendarDisplay, Events } from "../CalendarDisplay";

async function fetchEvents(): Promise<Events> {
  // https://docs.datomic.com/cloud/query/query-data-reference.html#predicates
  const result = await logseq.DB.datascriptQuery(
    `
    [
      :find ?date (pull ?b [:block/uuid])
      :in $ %
      :where
      (rpg-date ?b ?date)
    ]

  `,
    // [(>= ?date 0)]
    // [(< ?date 10)]
    `
    [
      [(rpg-date ?b ?datenum)
        [?b :block/properties ?prop ]
        [(get ?prop :rpg-date) ?date ]
        [(re-pattern "{{tgs (\\\\d+)}}") ?pattern]
        [(re-find ?pattern ?date) (_ ?datenumstr)]
        [(- ?datenumstr 0) ?datenum]
      ]
    ]
  `

    // (property ?b :rpg-date "aa")
  );

  const events: Events = {};

  result.forEach(([date, block]: any) => {
    if (!(date in events)) {
      events[date] = [];
    }
    events[date].push({
      date: new CalendarDate(date),
      name: block.uuid,
    });
  });

  console.log("Refetched events to be: ", events);

  return events;
}

type InlineCalendarViewProps = any;
export const InlineCalendarView: FunctionComponent<InlineCalendarViewProps> =
  () => {
    const [date, setDate] = useState(new CalendarDate(0));
    const [events, setEvents] = useState<Events>([]);

    useEffect(() => {
      let active = true;
      fetchEvents().then((it) => {
        if (active) {
          setEvents(it);
        }
      });

      const onChangeHook = logseq.DB.onChanged((e) => {
        fetchEvents().then((it) => {
          if (active) {
            setEvents(it);
          }
        });
      });
      return () => {
        onChangeHook();
        active = false;
      };
    }, []);

    return (
      <div className="rpg-calendar--inline-container">
        <CalendarDisplay
          date={date}
          onDateChange={(d) => setDate(d)}
          system={TMP_SYSTEM}
          events={events}
        ></CalendarDisplay>
      </div>
    );
  };
