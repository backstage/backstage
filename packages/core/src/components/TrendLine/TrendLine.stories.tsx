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

export default {
  title: 'TrendLine',
  component: TrendLine,
};

const width = 140;

export const Default = () => (
  <div style={{ width }}>
    <TrendLine data={[0.1, 0.7, 0.5, 0.8]} title="Trend over time" />
  </div>
);

export const TrendingUp = () => (
  <div style={{ width }}>
    <TrendLine data={[0.1, 0.5, 0.9, 1.0]} title="Trend over time" />
  </div>
);

export const TrendingDown = () => (
  <div style={{ width }}>
    <TrendLine data={[0.8, 0.7, 0.5, 0.1]} title="Trend over time" />
  </div>
);
