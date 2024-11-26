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
import { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { IconProvider } from './context';
import * as LucideIcons from 'lucide-react';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(LucideIcons),
    },
  },
  args: {
    name: 'ArrowDown',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'ArrowDown',
  },
};

export const CustomIcon: Story = {
  args: {
    name: 'CustomIcon',
  },
};

export const WithCustomIcon: Story = {
  args: {
    name: 'ArrowDown',
  },
  decorators: [
    Story => (
      <IconProvider overrides={{ ArrowDown: () => <div>Custom Icon</div> }}>
        <Story />
      </IconProvider>
    ),
  ],
};

export const WithCustomIconOverride: Story = {
  args: {
    name: 'CustomIcon',
  },
  decorators: [
    Story => (
      <IconProvider
        overrides={{ CustomIcon: () => <div>Custom Super Icon</div> }}
      >
        <Story />
      </IconProvider>
    ),
  ],
};
