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
import { TooltipTrigger, Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipTrigger,
} satisfies Meta<typeof TooltipTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '' },
  render: () => (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip>I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const IsOpen: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger isOpen>
      <Button>Button</Button>
      <Tooltip>I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const IsDisabled: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger isDisabled>
      <Button>Button</Button>
      <Tooltip>I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementTop: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip placement="top">I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementRight: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip placement="right">I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementLeft: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip placement="left">I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementBottom: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip placement="bottom">I am a tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export const WithLongText: Story = {
  args: {
    ...Default.args,
  },
  render: () => (
    <TooltipTrigger isOpen>
      <Button>Button</Button>
      <Tooltip placement="bottom">
        I am a tooltip with a very long text. I am a tooltip with a very long
        text.
      </Tooltip>
    </TooltipTrigger>
  ),
};
