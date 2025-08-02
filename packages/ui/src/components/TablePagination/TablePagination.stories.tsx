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

import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { TablePagination } from './TablePagination';

const meta = {
  title: 'Components/TablePagination',
  component: TablePagination,
  argTypes: {
    offset: { control: 'number' },
    pageSize: { control: 'radio', options: [5, 10, 20, 30, 40, 50] },
    rowCount: { control: 'number' },
    showPageSizeOptions: { control: 'boolean', defaultValue: true },
    setOffset: { action: 'setOffset' },
    setPageSize: { action: 'setPageSize' },
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    offset: 0,
    pageSize: 10,
    rowCount: 100,
  },
  render: args => {
    const [{}, updateArgs] = useArgs();

    return (
      <TablePagination
        {...args}
        setOffset={value => {
          updateArgs({ offset: value });
        }}
        setPageSize={value => {
          updateArgs({ pageSize: value });
        }}
      />
    );
  },
};
