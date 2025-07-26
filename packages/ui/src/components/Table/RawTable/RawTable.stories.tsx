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

import { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  RawTable,
  RawTableBody,
  RawTableHead,
  RawTableHeader,
  RawTableRow,
  RawTableCell,
} from '.';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

const meta = {
  title: 'Components/Table/RawTable',
  component: RawTable,
  subcomponents: {
    Body: RawTableBody as ComponentType<unknown>,
    Cell: RawTableCell as ComponentType<unknown>,
    Head: RawTableHead as ComponentType<unknown>,
    Header: RawTableHeader as ComponentType<unknown>,
    Row: RawTableRow as ComponentType<unknown>,
  },
} satisfies Meta<typeof RawTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RawTable>
      <RawTableHeader>
        <RawTableRow>
          <RawTableHead className="w-[100px]">Invoice</RawTableHead>
          <RawTableHead>Status</RawTableHead>
          <RawTableHead>Method</RawTableHead>
          <RawTableHead className="text-right">Amount</RawTableHead>
        </RawTableRow>
      </RawTableHeader>
      <RawTableBody>
        {invoices.map(invoice => (
          <RawTableRow key={invoice.invoice}>
            <RawTableCell className="font-medium">
              {invoice.invoice}
            </RawTableCell>
            <RawTableCell>{invoice.paymentStatus}</RawTableCell>
            <RawTableCell>{invoice.paymentMethod}</RawTableCell>
            <RawTableCell className="text-right">
              {invoice.totalAmount}
            </RawTableCell>
          </RawTableRow>
        ))}
      </RawTableBody>
    </RawTable>
  ),
};
