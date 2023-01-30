import React, { useRef } from "react";
import { Calendar } from "./Calendar";
import { CalendarSystem } from "./system";
import { useAppVisible } from "./utils";

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();

  const system: CalendarSystem = new CalendarSystem({
    name: "test-system",
    dayNames: ["Mond", "Tues", "Wednes", "Thurs", "Frid", "Satd", "Sund"],
    monthNames: [
      "Unandir",
      "Sekandir",
      "Tretir",
      "Ewak",
      "Saad",
      "Aldwin",
      "Son",
      "Dunon",
    ],
    period: {
      years: [
        {
          monthDurations: [4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          monthDurations: [7, 8, 9, 10, 11, 12, 4, 5],
        },
      ],
    },
  });

  if (visible) {
    return (
      <main
        className="bg-slate-500"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} className="text-size-2em">
          <Calendar system={system}></Calendar>
        </div>
      </main>
    );
  }
  return null;
}

export default App;
