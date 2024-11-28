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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Box } from '../Box/Box';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary button',
    variant: 'secondary',
  },
};

export const Sizes: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button {...args} size="small" />
      <Button {...args} size="medium" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button {...args} iconStart="cloud" />
      <Button {...args} iconEnd="arrowRight" />
      <Button {...args} iconStart="cloud" iconEnd="arrowRight" />
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Box>
      <Button {...args} iconStart="cloud" />
      <Button {...args} iconEnd="arrowRight" />
      <Button {...args} iconStart="cloud" iconEnd="arrowRight" />
    </Box>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const CustomTheme: Story = {
  args: {
    children: 'Custom Button',
  },
  decorators: [
    Story => (
      <div
        style={
          {
            '--button-primary-background-color': 'blue',
            '--button-primary-border-color': 'blue',
            '--button-primary-text-color': 'white',
            '--button-primary-border-radius': '8px',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
