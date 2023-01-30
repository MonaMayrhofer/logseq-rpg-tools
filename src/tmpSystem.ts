import { CalendarSystem } from "./system";

export const TMP_SYSTEM: CalendarSystem = new CalendarSystem({
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
