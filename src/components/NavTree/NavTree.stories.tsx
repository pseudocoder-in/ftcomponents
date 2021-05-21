import React from 'react';
import { Story, Meta } from '@storybook/react';

import { NavTree, NavTreeProps } from './NavTree';
import { treeData } from '../../assets/treedata';

export default {
  title: 'NavTree',
  component: NavTree,
  argTypes: {
    theme: { control: 'theme' },
    data: {}
  },
} as Meta;

const Template: Story<NavTreeProps> = (args) => <NavTree {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  theme: "light",
  data: treeData,
  width: "100vw",
  height: "100vh",
  onUpdate: (data) => { console.log(data) }
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme: "dark",
  data: treeData,
  width: "100vw",
  height: "100vh",
  onUpdate: (data) => { console.log(data) }
};

