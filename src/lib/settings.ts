import { CalendarSystem, CalendarSystemDescriptor } from "../system";
import { TMP_SYSTEM_DESCRIPTOR } from "../tmpSystem";

type SettingsSchema = {
  calendarSystems: Record<string, CalendarSystemDescriptor>;
  masterCalendar: string;
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
  ]);
}

class RpgCalendarSettings {
  initialized: boolean;

  systems: Record<string, CalendarSystem>;

  masterSystem: string;

  constructor() {
    this.initialized = false;
    this.systems = {};
    this.masterSystem = "";
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
    console.log("Parsed Settings: ", this);
  }

  getCalendarSystem(name: string): CalendarSystem | undefined {
    return this.systems[name];
  }

  getMasterCalendarSystem(): CalendarSystem | undefined {
    return this.getCalendarSystem(this.masterSystem);
  }
}

export const SETTINGS = new RpgCalendarSettings();
