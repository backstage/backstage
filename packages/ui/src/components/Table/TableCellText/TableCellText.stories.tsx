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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { TableCellText } from './TableCellText';
import { Icon } from '../../Icon/Icon';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Table/TableCellText',
  component: TableCellText,
} satisfies Meta<typeof TableCellText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Hello world',
  },
};

export const WithDescription: Story = {
  args: {
    ...Default.args,
    description: 'This is a description',
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <TableCellText {...args} leadingIcon={<Icon name="arrow-right" />} />
  ),
};

export const WithIconAndDescription: Story = {
  args: {
    ...WithDescription.args,
  },
  render: args => (
    <TableCellText {...args} leadingIcon={<Icon name="arrow-right" />} />
  ),
};

export const WithLink: Story = {
  args: {
    ...WithDescription.args,
    href: '/home',
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const WithExternalLink: Story = {
  args: {
    ...WithDescription.args,
    href: 'https://www.google.com',
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
