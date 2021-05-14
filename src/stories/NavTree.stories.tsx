import React from 'react';
import { Story, Meta } from '@storybook/react';

import { NavTree, NavTreeProps } from '../components';
import {default as treeData} from '../components/NavTree/treeData.json';

export default {
  title: 'Example/NavTree',
  component: NavTree,
  argTypes: {
    theme: { control: 'theme' },
    data: {}
  },
} as Meta;

const Template: Story<NavTreeProps> = (args) => <NavTree {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  theme : "light",
  data : treeData,
  width: "100vw",
  height: "100vh"
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme : "dark",
  data : treeData,
  width: "100vw",
  height: "100vh"
};

