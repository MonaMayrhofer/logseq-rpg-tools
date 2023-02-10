import {
  CalendarDate,
  CalendarSystem,
  CalendarSystemDescriptor,
} from "./system";
import { TMP_SYSTEM_DESCRIPTOR } from "../tmpSystem";

type SettingsSchema = {
  calendarSystems: Record<string, CalendarSystemDescriptor>;
  masterCalendar: string;
  currentDate: number;
  disabled: boolean;
};

function parseCalendarSystems(
  settings: Partial<SettingsSchema>
): Record<string, CalendarSystem> {
  const descriptors = settings?.calendarSystems;
  if (descriptors === undefined) {
    return {};
  }
  return Object.assign(
    {},
    ...Object.entries(descriptors).map(([key, descriptor]) => ({
      [key]: new CalendarSystem(descriptor),
    }))
  );
}

function setupLogseqSettingsSchema() {
  logseq.useSettingsSchema([
    {
      default: {
        example: TMP_SYSTEM_DESCRIPTOR,
      },
      description: "Dictionary of available calendar systems",
      key: "calendarSystems",
      title: "Calendar Systems",
      type: "object",
    },
    {
      default: "example",
      description:
        "The master calendar system. Should be a key that is contained in 'Calendar Systems'. The 01.01.00 of this calendar corresponds to the zero date and all the dates within the graph are interpreted as being in this calendar.",
      key: "masterCalendar",
      title: "Master Calendar",
      type: "string",
    },
    {
      default: "example",
      description:
        "The current Date, used to calculate how long ago things were.",
      key: "currentDate",
      title: "Current Date",
      type: "number",
    },
  ]);
}

//TODO This could be a zustand store

class RpgCalendarSettings {
  initialized: boolean;

  systems: Record<string, CalendarSystem>;

  masterSystem: string;

  currentDate: CalendarDate;

  constructor() {
    this.initialized = false;
    this.systems = {};
    this.masterSystem = "";
    this.currentDate = new CalendarDate(0);
  }

  init() {
    console.log("Initializing Settings");
    this.initialized = true;
    setupLogseqSettingsSchema();

    this.parseSettings(logseq.settings || {});
    logseq.onSettingsChanged((settings, newSettings) => {
      console.log("Settings Changed", settings, newSettings);
      this.parseSettings(newSettings);
    });
  }

  parseSettings(settings: Partial<SettingsSchema>) {
    this.systems = parseCalendarSystems(settings);
    this.masterSystem = settings.masterCalendar || "";
    this.currentDate = new CalendarDate(settings.currentDate || 0);
    console.log("Parsed Settings: ", this);
  }

  getCalendarSystem(name: string): CalendarSystem | undefined {
    return this.systems[name];
  }

  getMasterCalendarSystem(): CalendarSystem | undefined {
    return this.getCalendarSystem(this.masterSystem);
  }

  setCurrentDate(date: CalendarDate) {
    logseq.updateSettings({
      currentDate: date.date,
    });
  }

  getCurrentDate() {
    return this.currentDate;
  }

  subscribeCurrentDate(callback: (date: CalendarDate) => void) {
    logseq.onSettingsChanged((settings, newSettings) => {
      const newDate = new CalendarDate(newSettings.currentDate);
      if (newDate.date !== this.currentDate.date) {
        this.currentDate = newDate;
        callback(this.currentDate);
      }
    });
    callback(this.currentDate);
    //TODO This MUST return an unsubscriber!!!
  }
}

export const SETTINGS = new RpgCalendarSettings();
