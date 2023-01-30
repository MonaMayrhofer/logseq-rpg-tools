import { CalendarDate, CalendarSystem } from "../system";

export type DateFormatter = (
  date: CalendarDate,
  system: CalendarSystem
) => string;

export const ShortFormat: DateFormatter = (date, system) => {
  const data = date.deconstruct(system);

  return `${data.dayOfMonth + 1}-${data.month + 1}-${data.year}`;
};

export const LongFormat: DateFormatter = (date, system) => {
  const data = date.deconstruct(system);
  const weekday = date.weekDay(system);

  return `${system.descriptor.dayNames[weekday]} ${data.dayOfMonth + 1}. ${
    system.descriptor.monthNames[data.month]
  } ${data.year}`;
};
