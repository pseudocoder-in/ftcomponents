import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TreeViewer, TreeViewerProps } from './TreeViewer';
import { default as treeData } from '../../assets/treeData.json';

export default {
  title: 'TreeViewer',
  component: TreeViewer,
  argTypes: {
    theme: { control: 'theme' },
    data: {}
  },
} as Meta;

const Template: Story<TreeViewerProps> = (args) => <TreeViewer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  theme: "Light",
  data: treeData,
  width: "100vw",
  height: "100vh",
  handleShare: () => { },
  handleFullScreen: () => { },
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme: "Dark",
  data: treeData,
  width: "100vw",
  height: "100vh",
  handleShare: () => { },
  handleFullScreen: () => { },
};

