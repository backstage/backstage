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
import { IconProvider } from './provider';
import { icons } from './icons';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(icons),
    },
  },
  args: {
    name: 'heart',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'heart',
  },
};

export const WithCustomIcon: Story = {
  args: {
    name: 'arrow-down',
  },
  decorators: [
    Story => (
      <IconProvider overrides={{ 'arrow-down': () => <div>Custom Icon</div> }}>
        <Story />
      </IconProvider>
    ),
  ],
};
