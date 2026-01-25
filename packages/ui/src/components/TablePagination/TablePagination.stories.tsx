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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TablePagination } from './TablePagination';

const noop = () => {};

const meta = {
  title: 'Backstage UI/TablePagination',
  component: TablePagination,
  argTypes: {
    offset: { control: 'number' },
    pageSize: { control: 'radio', options: [5, 10, 20, 30, 40, 50] },
    totalCount: { control: 'number' },
    hasNextPage: { control: 'boolean' },
    hasPreviousPage: { control: 'boolean' },
    showPageSizeOptions: { control: 'boolean' },
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true,
  },
};

export const FirstPage: Story = {
  args: {
    ...Default.args,
  },
};

export const LastPage: Story = {
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true,
  },
};

export const MiddlePage: Story = {
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true,
  },
};

export const WithoutPageSizeOptions: Story = {
  args: {
    ...Default.args,
    showPageSizeOptions: false,
  },
};

export const CursorPagination: Story = {
  args: {
    ...Default.args,
    offset: undefined,
  },
};

export const CustomLabel: Story = {
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({ offset, pageSize, totalCount }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return `Page ${page} of ${totalPages}`;
    },
  },
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false,
  },
};
