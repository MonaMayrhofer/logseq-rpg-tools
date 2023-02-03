import "@logseq/libs";

import React from "react";
import * as ReactDOM from "react-dom/client";
// import "./index.css";

import { logseq as PL } from "../package.json";
import { InlineCalendarView } from "./components/macros/InlineCalendarView";
import LsStyle from "./ls-style.css?inline";
import { CalendarDate, CalendarSystem } from "./lib/system";
import { TMP_SYSTEM_DESCRIPTOR } from "./tmpSystem";
import { LongFormat } from "./lib/format";
import { SETTINGS } from "./lib/settings";
import { DatePicker } from "./components/DatePicker";
import { showDatePicker } from "./components/Modal";

// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);

const pluginId = PL.id;

function main() {
  //Idk if this works? but i wanna include the theme...
  const customCSSLink = document.createElement("link");
  customCSSLink.id = "logseq-main-styles";
  customCSSLink.rel = "stylesheet";
  customCSSLink.media = "all";
  customCSSLink.href = "./css/style.css";
  document.head.append(customCSSLink);

  function createModel() {
    return {
      show() {
        logseq.showMainUI();
      },
    };
  }

  logseq.provideModel(createModel());
  logseq.setMainUIInlineStyle({
    zIndex: 100,
    userSelect: "none",
    position: "fixed",
    inset: 0,
    // @ts-ignore
    WebkitAppRegion: "drag",
  });

  const openIconName = "template-plugin-open";

  logseq.provideStyle(css`
    ${LsStyle}
    .${openIconName} {
      opacity: 0.55;
      font-size: 20px;
      margin-top: 4px;
    }

    .${openIconName}:hover {
      opacity: 0.9;
    }
  `);

  logseq.App.registerUIItem("toolbar", {
    key: openIconName,
    template: `
      <div data-on-click="show" class="${openIconName}">⚙️</div>
    `,
  });

  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const [type, ...args] = payload.arguments;

    // if (type !== "rpg-calendar") return;

    if (type === "rpg-calendar") {
      const id = `rpg-calendar-view-${slot}`;

      logseq.provideUI({
        key: `rpg-calendar-${slot}`,
        slot,
        reset: true,
        template: `<div id="${id}"></div>`,
      });

      setTimeout(() => {
        const element = parent.document.getElementById(id);

        if (element !== null) {
          const root = ReactDOM.createRoot(element);
          root.render(<InlineCalendarView></InlineCalendarView>);
        } else {
          logseq.UI.showMsg(
            "Couldn't embed RPG Calendar InlineCalendarView",
            "error"
          );
        }
      }, 0);
    } else if (type === "rpg-date") {
      const id = `rpg-date-view-${slot}`;

      // console.log("PAYLOAD: ", payload);

      const [dateNum] = args;

      const formatted = new CalendarDate(parseInt(dateNum)).format(
        SETTINGS.getMasterCalendarSystem(),
        LongFormat
      );

      logseq.provideUI({
        key: `rpg-calendar-${slot}`,
        slot,
        reset: true,
        template: `<div class="rpg-calendar--date-view" id="${id}">${formatted}</div>`,
      });
      return;
    } else {
      return;
    }
  });

  logseq.Editor.registerSlashCommand("RpgDate", async (it) => {
    showDatePicker();
  });

  SETTINGS.init();
}

logseq.ready(main).catch(console.error);
