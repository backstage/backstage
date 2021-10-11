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

import { renderInTestApp } from '@backstage/test-utils';
import { HeaderWorldClock, ClockConfig } from './HeaderWorldClock';
import React from 'react';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';

describe('HeaderWorldClock with valid Time Zones', () => {
  it('displays Time Zones as expected', async () => {
    const clockConfigs: ClockConfig[] = [
      {
        label: 'NYC',
        timeZone: 'America/New_York',
      },
      {
        label: 'UTC',
        timeZone: 'UTC',
      },
      {
        label: 'STO',
        timeZone: 'Europe/Stockholm',
      },
      {
        label: 'TYO',
        timeZone: 'Asia/Tokyo',
      },
    ];

    const rendered = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <HeaderWorldClock clockConfigs={clockConfigs} />
      </ThemeProvider>,
    );

    expect(rendered.getByText('NYC')).toBeInTheDocument();
    expect(rendered.getByText('UTC')).toBeInTheDocument();
    expect(rendered.getByText('STO')).toBeInTheDocument();
    expect(rendered.getByText('TYO')).toBeInTheDocument();
  });
});

describe('HeaderWorldClock with no Time Zones provided', () => {
  it('should not appear in output', async () => {
    const clockConfigs: ClockConfig[] = [];

    const rendered = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <HeaderWorldClock clockConfigs={clockConfigs} />
      </ThemeProvider>,
    );

    expect(rendered.container).toBeEmptyDOMElement();
  });
});

describe('HeaderWorldClock with invalid Time Zone', () => {
  it('uses GMT as fallback Time Zone', async () => {
    const clockConfigs: ClockConfig[] = [
      {
        label: 'New York',
        timeZone: 'America/New_Pork',
      },
    ];

    const rendered = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <HeaderWorldClock clockConfigs={clockConfigs} />
      </ThemeProvider>,
    );

    expect(rendered.getByText('GMT')).toBeInTheDocument();
  });
});
