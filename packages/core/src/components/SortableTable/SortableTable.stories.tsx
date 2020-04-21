/*
 * Copyright 2020 Spotify AB
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
import { StatusError, StatusOK, StatusWarning } from 'components/Status';
import SortableTable from './SortableTable';

export default {
  title: 'Sortable Table',
  component: SortableTable,
};
const containerStyle = { width: 600, padding: 20 };

const data = [
  { id: 'buffalos', amount: 1, status: <StatusError />, statusValue: 2 },
  { id: 'milk', amount: 3, status: <StatusWarning />, statusValue: 1 },
  { id: 'cheese', amount: 8, status: <StatusWarning />, statusValue: 1 },
  { id: 'bread', amount: 2, status: <StatusOK />, statusValue: 0 },
];
const columns = [
  { id: 'id', label: 'ID' },
  { id: 'amount', disablePadding: false, numeric: true, label: 'AMOUNT' },
  { id: 'status', label: 'STATUS', sortValue: row => row.statusValue },
];
const footerData = [
  { id: 'total', amount: 4, statusValue: 2, status: <StatusError /> },
];

export const Default = () => (
  <div style={containerStyle}>
    <SortableTable orderBy="desc" data={data} columns={columns} />
  </div>
);

export const WithFooter = () => (
  <div style={containerStyle}>
    <SortableTable
      orderBy="asc"
      data={data}
      columns={columns}
      footerData={footerData}
    />
  </div>
);
