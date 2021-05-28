import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TreeViewer, TreeViewerProps } from './TreeViewer';
import { treeData } from '../../assets/treedata';

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
  fontColor: 'black',
  fontSize: 14,
  backgroundImage: `url(https://www.transparenttextures.com/patterns/asfalt-dark.png)`,
  handleShare: () => { },
  handleFullScreen: () => { },
};

export const Secondary = Template.bind({});
Secondary.args = {
  theme: "Dark",
  data: treeData,
  width: "100vw",
  height: "100vh",
  linkColor: 'gold',
  handleShare: () => { },
  handleFullScreen: () => { },
  backgroundImage: `radial-gradient(circle at center center, transparent,rgb(33,33,33)),repeating-linear-gradient(135deg, rgb(33,33,33) 0px, rgb(33,33,33) 2px,transparent 2px, transparent 10px,rgb(33,33,33) 10px, rgb(33,33,33) 11px,transparent 11px, transparent 21px),repeating-linear-gradient(45deg, rgb(47,47,47) 0px, rgb(47,47,47) 4px,transparent 4px, transparent 8px),linear-gradient(90deg, rgb(33,33,33),rgb(33,33,33))`
};

