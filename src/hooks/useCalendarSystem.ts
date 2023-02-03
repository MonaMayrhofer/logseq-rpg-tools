import { useMemo } from "react";
import { SETTINGS } from "../lib/settings";
import { CalendarSystem, CalendarSystemDescriptor } from "../system";

//TODO Ideally all the systemDescriptors would be cached and stuff... i guess....
export function useCalendarSystem(): CalendarSystem | undefined {
  //TODO Handle missing or wrong config here.
  return SETTINGS.getMasterCalendarSystem();
}
