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
});
