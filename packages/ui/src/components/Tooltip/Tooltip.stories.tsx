/*
 * Copyright 2025 The Backstage Authors
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
import preview from '../../../../../.storybook/preview';
import { Placement } from '@react-types/overlays';
import { TooltipTrigger, Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = preview.meta({
  title: 'Backstage UI/Tooltip',
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
  render: ({ children, isOpen, isDisabled, placement, delay, closeDelay }) => (
    <TooltipTrigger
      isOpen={isOpen}
      isDisabled={isDisabled}
      delay={delay}
      closeDelay={closeDelay}
    >
      <Button>Button</Button>
      <Tooltip placement={placement}>{children ?? 'I am a tooltip'}</Tooltip>
    </TooltipTrigger>
  ),
});

export const Default = meta.story({
  args: {
    children: 'I am a tooltip',
  },
});

export const IsOpen = meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
  },
});

export const IsDisabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
});

export const NoDelays = meta.story({
  args: {
    ...Default.input.args,
    delay: 0,
    closeDelay: 0,
  },
});

export const OrthogonalPlacements = meta.story({
  parameters: {
    controls: {
      exclude: ['placement'],
    },
  },
  args: {
    ...Default.input.args,
    isOpen: true,
  },
  render: ({ isOpen, children }) => {
    return (
      <TooltipTrigger isOpen={isOpen}>
        <Button>Button</Button>
        <Tooltip placement="top">{children}</Tooltip>
        <Tooltip placement="right">{children}</Tooltip>
        <Tooltip placement="bottom">{children}</Tooltip>
        <Tooltip placement="left">{children}</Tooltip>
      </TooltipTrigger>
    );
  },
});

export const WithLongText = meta.story({
  args: {
    ...Default.input.args,
    isOpen: true,
    children:
      'I am a tooltip with a very long text. orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
});
