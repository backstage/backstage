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
import TrendLine from '.';
import SortableTable from 'components/SortableTable';

export default {
  title: 'TrendLine',
  component: TrendLine,
};

const containerStyle = { width: 1000, padding: 20 };

const data = [
  {
    stock: 'A',
    day: <TrendLine data={[0.1, 0.5, 0.7, 1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.7, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[0.1, 0.3, 0.6, 1]} title="Trend over time" />,
    year: <TrendLine data={[0.8, 0.8, 0.8, 1]} title="Trend over time" />,
  },
  {
    stock: 'B',
    day: <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.9, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[1, 0.8, 0.6, 0.4]} title="Trend over time" />,
    year: <TrendLine data={[1, 1, 0.9, 0.8]} title="Trend over time" />,
  },
  {
    stock: 'C',
    day: <TrendLine data={[0.5, 0.3, 0.9, 1]} title="Trend over time" />,
    week: <TrendLine data={[1, 0.7, 0.9, 0.3]} title="Trend over time" />,
    month: <TrendLine data={[0.4, 0.6, 0.8, 0.4]} title="Trend over time" />,
    year: <TrendLine data={[0.2, 0.5, 0.8, 1]} title="Trend over time" />,
  },
  {
    stock: 'D',
    day: <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />,
    week: <TrendLine data={[0.2, 0.7, 0.9, 1]} title="Trend over time" />,
    month: <TrendLine data={[1, 0.8, 0.8, 0.8]} title="Trend over time" />,
    year: <TrendLine data={[1, 0.6, 0.9, 0.7]} title="Trend over time" />,
  },
];

const columns = [
  { id: 'stock', label: 'Stock name' },
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export const Default = () => (
  <div style={containerStyle}>
    <SortableTable data={data} columns={columns} />
  </div>
);

export const TrendingMix = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.1, 0.7, 0.5, 0.8]} title="Trend over time" />
  </div>
);

export const TrendingUp = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.1, 0.5, 0.9, 1.0]} title="Trend over time" />
  </div>
);

export const TrendingDown = () => (
  <div style={containerStyle}>
    <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />
  </div>
);
