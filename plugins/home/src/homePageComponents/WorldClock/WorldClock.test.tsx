/*
 * Copyright 2026 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import { act } from '@testing-library/react';
import { WorldClock } from './WorldClock';
import type { ClockConfig } from './clocks';

describe('WorldClock', () => {
  it('renders clock labels for configured time zones', async () => {
    const clockConfigs: ClockConfig[] = [
      { label: 'NYC', timeZone: 'America/New_York' },
      { label: 'UTC', timeZone: 'UTC' },
      { label: 'STO', timeZone: 'Europe/Stockholm' },
    ];

    const { getByText } = await renderInTestApp(
      <WorldClock clockConfigs={clockConfigs} />,
    );

    expect(getByText('NYC')).toBeInTheDocument();
    expect(getByText('UTC')).toBeInTheDocument();
    expect(getByText('STO')).toBeInTheDocument();
  });

  it('shows a message when no clock configs are provided', async () => {
    const { getByText } = await renderInTestApp(<WorldClock />);

    expect(getByText(/No clocks configured/)).toBeInTheDocument();
  });

  it('shows a message when clock configs array is empty', async () => {
    const { getByText } = await renderInTestApp(
      <WorldClock clockConfigs={[]} />,
    );

    expect(getByText(/No clocks configured/)).toBeInTheDocument();
  });

  describe('with a fixed system time', () => {
    const clockConfigs: ClockConfig[] = [
      { label: 'UTC', timeZone: 'UTC' },
      { label: 'NYC', timeZone: 'America/New_York' },
    ];
    const customTimeFormat: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('exposes an accessible label and a time element for each clock', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        <WorldClock
          clockConfigs={clockConfigs}
          customTimeFormat={customTimeFormat}
        />,
      );

      expect(getByLabelText('UTC: 12:00')).toBeInTheDocument();
      expect(getByText('12:00')).toHaveAttribute('datetime', '12:00');
      expect(getByLabelText('NYC: 08:00')).toBeInTheDocument();
      expect(getByText('08:00')).toHaveAttribute('datetime', '08:00');
    });

    it('updates the displayed times as the interval ticks', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        <WorldClock
          clockConfigs={clockConfigs}
          customTimeFormat={customTimeFormat}
        />,
      );

      expect(getByLabelText('UTC: 12:00')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(60_000);
      });

      expect(getByLabelText('UTC: 12:01')).toBeInTheDocument();
      expect(getByText('12:01')).toHaveAttribute('datetime', '12:01');
      expect(getByLabelText('NYC: 08:01')).toBeInTheDocument();
      expect(getByText('08:01')).toHaveAttribute('datetime', '08:01');
    });
  });
});
