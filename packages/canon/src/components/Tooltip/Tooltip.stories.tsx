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
  args: {
    children: (
      <>
        <Button>Button</Button>
        <Tooltip>I am a tooltip</Tooltip>
      </>
    ),
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

export const PlacementTop: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <Button>Tooltip on top</Button>
        <Tooltip placement="top">I'm a tooltip</Tooltip>
      </>
    ),
  },
};

export const PlacementRight: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <Button>Tooltip on top</Button>
        <Tooltip placement="right">I'm a tooltip</Tooltip>
      </>
    ),
  },
};

export const PlacementLeft: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <Button>Tooltip on top</Button>
        <Tooltip placement="left">I'm a tooltip</Tooltip>
      </>
    ),
  },
};
