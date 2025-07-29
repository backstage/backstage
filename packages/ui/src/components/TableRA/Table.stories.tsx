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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Table, TableHeader, Column, TableBody } from '.';
import { MemoryRouter } from 'react-router-dom';
import {
  Table as ReactAriaTable,
  TableHeader as ReactAriaTableHeader,
  Column as ReactAriaColumn,
  Cell,
  Row as ReactAriaRow,
  Cell as ReactAriaCell,
  Row,
  Checkbox,
} from 'react-aria-components';

const meta = {
  title: 'Components/TableRA',
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncontrolled: Story = {
  render: () => {
    return (
      <Table>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Type</Column>
          <Column>Size</Column>
          <Column>Date Modified</Column>
        </TableHeader>
        <TableBody>
          <ReactAriaRow>
            <ReactAriaCell>
              <Checkbox slot="selection" />
            </ReactAriaCell>
            <ReactAriaCell>Games</ReactAriaCell>
            <ReactAriaCell>File folder</ReactAriaCell>
            <ReactAriaCell>6/7/2020</ReactAriaCell>
          </ReactAriaRow>
          <ReactAriaRow>
            <ReactAriaCell>
              <Checkbox slot="selection" />
            </ReactAriaCell>
            <ReactAriaCell>Program Files</ReactAriaCell>
            <ReactAriaCell>File folder</ReactAriaCell>
            <ReactAriaCell>4/7/2021</ReactAriaCell>
          </ReactAriaRow>
          <ReactAriaRow>
            <ReactAriaCell>
              <Checkbox slot="selection" />
            </ReactAriaCell>
            <ReactAriaCell>bootmgr</ReactAriaCell>
            <ReactAriaCell>System file</ReactAriaCell>
            <ReactAriaCell>11/20/2010</ReactAriaCell>
          </ReactAriaRow>
          <ReactAriaRow>
            <ReactAriaCell>
              <Checkbox slot="selection" />
            </ReactAriaCell>
            <ReactAriaCell>log.txt</ReactAriaCell>
            <ReactAriaCell>Text Document</ReactAriaCell>
            <ReactAriaCell>1/18/2016</ReactAriaCell>
          </ReactAriaRow>
        </TableBody>
      </Table>
    );
  },
};
