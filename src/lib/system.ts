import { DateFormatter } from "./format";

// This describes one Year within the Period (Each year within a period can have a different amount of days)
export type YearInPeriodSystemDescriptor = {
  monthDurations: number[];
};
/// A Period is one complete period within the calendar system that repeats over and over again. Each Period has the same amount of days
export type PeriodSystemDescriptor = {
  years: YearInPeriodSystemDescriptor[];
};
export type CalendarSystemDescriptor = {
  name: string;
  period: PeriodSystemDescriptor;
  dayNames: string[];
  monthNames: string[];
};

export type CalendarDateParts = {
  year: number;
  month: number;
  dayOfMonth: number;
  yearInPeriod: number;
};

export class CalendarSystem {
  descriptor: CalendarSystemDescriptor;

  daysInYear: number[];
  daysInPeriod: number;

  constructor(descriptor: CalendarSystemDescriptor) {
    this.descriptor = descriptor;

    this.daysInYear = this.descriptor.period.years.map((year) =>
      year.monthDurations.reduce((acc, month) => acc + month, 0)
    );
    this.daysInPeriod = this.daysInYear.reduce((acc, year) => acc + year);
  }

  fromDMY(day: number, month: number, year: number): CalendarDate {
    const fullPeriods = Math.floor(year / this.descriptor.period.years.length);
    const yearInPeriod = year % this.descriptor.period.years.length;
    const period = this.descriptor.period.years[yearInPeriod];

    let days = fullPeriods * this.daysInPeriod;
    for (let y = 0; y < yearInPeriod; y++) {
      days += this.daysInYear[y];
    }

    for (let m = 0; m < month; m++) {
      days += period.monthDurations[m];
    }

    days += day;

    return new CalendarDate(days);
  }

  parse(raw: string): CalendarDate | undefined {
    const parts = raw.split(".");
    if (parts.length === 3) {
      try {
        const d = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        console.log("Parsed: ", raw, d, m, y);
        return this.fromDMY(d - 1, m - 1, y);
      } catch (e) {
        console.log(e);
      }
    }
    return undefined;
  }
}

type DurationParts = {
  years: number;
  months: number;
  // days: number;
};

export class CalendarDate {
  since(system: CalendarSystem, otherDate: CalendarDate): DurationParts {
    const myParts = this.deconstruct(system);
    const otherParts = otherDate.deconstruct(system);
    const ret = {
      years: myParts.year - otherParts.year,
      months: myParts.month - otherParts.month,
    };

    if (ret.months < 0) {
      ret.months += system.descriptor.monthNames.length;
      ret.years -= 1;
    }

    ///   [          ] [  I       ]
    /// - [          ] [      I   ]

    ///   [          ] [  I       ]
    /// - [       I  ] [          ]
    return ret;
  }
  date: number;

  constructor(date: number) {
    this.date = date;
  }

  deconstruct(system: CalendarSystem): CalendarDateParts {
    const period = Math.floor(this.date / system.daysInPeriod);
    const dayInPeriod = this.date % system.daysInPeriod;
    let yearInPeriod = 0;
    let dayInYear = dayInPeriod;
    while (dayInYear >= system.daysInYear[yearInPeriod]) {
      dayInYear -= system.daysInYear[yearInPeriod];
      yearInPeriod += 1;
    }

    let monthInYear = 0;
    let dayInMonth = dayInYear;
    while (
      dayInMonth >=
      system.descriptor.period.years[yearInPeriod].monthDurations[monthInYear]
    ) {
      dayInMonth -=
        system.descriptor.period.years[yearInPeriod].monthDurations[
          monthInYear
        ];
      monthInYear += 1;
    }

    return {
      year: yearInPeriod + system.descriptor.period.years.length * period,
      dayOfMonth: dayInMonth,
      month: monthInYear,
      yearInPeriod: yearInPeriod,
    };
  }

  addDays(days: number): CalendarDate {
    return new CalendarDate(this.date + days);
  }

  weekDay(system: CalendarSystem): number {
    return this.date % system.descriptor.dayNames.length;
  }

  startOfMonth(system: CalendarSystem): CalendarDate {
    const date = this.deconstruct(system);
    return system.fromDMY(0, date.month, date.year);
  }

  addYears(system: CalendarSystem, years: number): CalendarDate {
    const date = this.deconstruct(system);
    //TODO This crashes if we switch to a year that has less days in the month than the current day is day of month.
    return system.fromDMY(date.dayOfMonth, date.month, date.year + years);
  }
  addMonths(system: CalendarSystem, months: number): CalendarDate {
    const date = this.deconstruct(system);

    let newMonth = date.month + months;

    const yearDelta = Math.floor(
      newMonth / system.descriptor.monthNames.length
    );

    console.log(newMonth, yearDelta);

    if (newMonth < 0) {
      newMonth += system.descriptor.monthNames.length;
    }

    return system.fromDMY(
      date.dayOfMonth,
      newMonth % system.descriptor.monthNames.length,
      date.year + yearDelta
    );
  }

  format(system: CalendarSystem, formatter: DateFormatter): string {
    return formatter(this, system);
  }
}
