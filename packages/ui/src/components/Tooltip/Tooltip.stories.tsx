/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Placement } from '@react-types/overlays';
import { TooltipTrigger, Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipTrigger,
  parameters: { layout: 'centered' },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    placement: {
      options: ['top', 'right', 'bottom', 'left'],
      control: { type: 'inline-radio' },
    },
    delay: {
      control: { type: 'number' },
    },
    closeDelay: {
      control: { type: 'number' },
    },
  },
  render: ({ tooltip, isOpen, isDisabled, placement, delay, closeDelay }) => (
    <TooltipTrigger
      isOpen={isOpen}
      isDisabled={isDisabled}
      delay={delay}
      closeDelay={closeDelay}
    >
      <Button>Button</Button>
      <Tooltip placement={placement}>{tooltip ?? 'I am a tooltip'}</Tooltip>
    </TooltipTrigger>
  ),
} as Meta<{
  tooltip?: string;
  isOpen?: boolean;
  isDisabled?: boolean;
  placement?: Placement;
  delay?: number;
  closeDelay?: number;
}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tooltip: 'I am a tooltip',
  },
};

export const IsOpen: Story = {
  args: {
    ...Default.args,
    isOpen: true,
  },
};

export const IsDisabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
};

export const NoDelays: Story = {
  args: {
    ...Default.args,
    delay: 0,
    closeDelay: 0,
  },
};

export const OrthogonalPlacements: Story = {
  parameters: {
    controls: {
      exclude: ['placement'],
    },
  },
  args: {
    ...Default.args,
    isOpen: true,
  },
  render: ({ isOpen, tooltip }) => {
    return (
      <TooltipTrigger isOpen={isOpen}>
        <Button>Button</Button>
        <Tooltip placement="top">{tooltip}</Tooltip>
        <Tooltip placement="right">{tooltip}</Tooltip>
        <Tooltip placement="bottom">{tooltip}</Tooltip>
        <Tooltip placement="left">{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  },
};

export const WithLongText: Story = {
  args: {
    ...Default.args,
    isOpen: true,
    tooltip:
      'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
};
