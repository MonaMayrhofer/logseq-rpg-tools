import React, { useRef } from "react";
import { Calendar } from "./Calendar";
import { CalendarSystem } from "./system";
import { useAppVisible } from "./utils";

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();

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
        <div ref={innerRef} className="text-size-2em"></div>
      </main>
    );
  }
  return null;
}

export default App;
