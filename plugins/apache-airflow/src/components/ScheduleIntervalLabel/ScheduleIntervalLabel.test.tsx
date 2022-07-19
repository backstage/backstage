/*
 * Copyright 2021 The Backstage Authors
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

import { render } from '@testing-library/react';
import React from 'react';
import { CronExpression, RelativeDelta, TimeDelta } from '../../api/types';
import { ScheduleIntervalLabel } from './ScheduleIntervalLabel';

describe('ScheduleIntervalLabel', () => {
  it('should render with cronexpression interval', async () => {
    const interval = {
      __type: 'CronExpression',
      value: '0 0 * * *',
    } as CronExpression;
    const { findByText } = render(
      <ScheduleIntervalLabel interval={interval} />,
    );
    expect(await findByText('0 0 * * *')).toBeInTheDocument();
  });

  it('should render with time delta interval', async () => {
    const interval = {
      __type: 'TimeDelta',
      days: 5,
      seconds: 750,
      microseconds: 600,
    } as TimeDelta;
    const { findByText } = render(
      <ScheduleIntervalLabel interval={interval} />,
    );
    expect(await findByText('5 days 00:12:30')).toBeInTheDocument();
  });

  it('should not render days with time delta interval with 0 days', async () => {
    const interval = {
      __type: 'TimeDelta',
      days: 0,
      seconds: 750,
      microseconds: 600,
    } as TimeDelta;
    const { findByText } = render(
      <ScheduleIntervalLabel interval={interval} />,
    );
    expect(await findByText('00:12:30')).toBeInTheDocument();
  });

  it('should render singular day with time delta interval and 1 day', async () => {
    const interval = {
      __type: 'TimeDelta',
      days: 1,
      seconds: 750,
      microseconds: 600,
    } as TimeDelta;
    const { findByText } = render(
      <ScheduleIntervalLabel interval={interval} />,
    );
    expect(await findByText('1 day 00:12:30')).toBeInTheDocument();
  });

  it('should render with relative delta interval', async () => {
    const interval = {
      __type: 'RelativeDelta',
      days: 15,
      months: 6,
    } as RelativeDelta;
    const { findByText } = render(
      <ScheduleIntervalLabel interval={interval} />,
    );
    expect(
      await findByText('relativedelta(days=+15,months=+6)'),
    ).toBeInTheDocument();
  });
});
