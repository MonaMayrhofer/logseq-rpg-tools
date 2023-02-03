import React, { FunctionComponent, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CalendarDisplay,
  CalendarDisplayProps,
} from "../components/CalendarDisplay";
import { CalendarDate, CalendarSystem } from "../lib/system";

type CalendarStoryProps = Pick<CalendarDisplayProps, "system">;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Calendar/Calendar",
  component: CalendarDisplay,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    system: { control: "object" },
  },
} as ComponentMeta<typeof CalendarDisplay>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CalendarDisplay> = (args) => {
  const [date, setDate] = useState(new CalendarDate(0));
  return (
    <CalendarDisplay
      {...args}
      date={date}
      onDateChange={(d) => setDate(d)}
    ></CalendarDisplay>
  );
};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  system: new CalendarSystem({
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
          monthDurations: [14, 15, 16, 17, 18, 19, 10, 11],
        },
        {
          monthDurations: [17, 18, 19, 10, 11, 12, 14, 15],
        },
      ],
    },
  }),
};
