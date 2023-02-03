import React, { FunctionComponent, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CalendarDisplay,
  CalendarDisplayProps,
} from "../components/CalendarDisplay";
import { CalendarDate, CalendarSystem } from "../lib/system";
import { InlineCalendarView } from "../components/macros/InlineCalendarView";

export default {
  title: "Macros/InlineCalendarView",
  component: InlineCalendarView,
  argTypes: {},
} as ComponentMeta<typeof InlineCalendarView>;

const Template: ComponentStory<typeof InlineCalendarView> = (args) => {
  return <InlineCalendarView {...args}></InlineCalendarView>;
};

export const Primary = Template.bind({});
Primary.args = {};
