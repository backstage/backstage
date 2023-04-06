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

import { Header } from '@backstage/core-components';
import { wrapInTestApp } from '@backstage/test-utils';
import React, { ComponentType } from 'react';
import { ClockConfig, HeaderWorldClock } from './HeaderWorldClock';

export default {
  title: 'Plugins/Home/Components/HeaderWorldClock',
  decorators: [(Story: ComponentType<{}>) => wrapInTestApp(<Story />)],
};

export const Default = () => {
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

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return (
    <Header title="Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock
        clockConfigs={clockConfigs}
        customTimeFormat={timeFormat}
      />
    </Header>
  );
};

export const TwentyFourHourClocks = () => {
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

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return (
    <Header title="24hr Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock
        clockConfigs={clockConfigs}
        customTimeFormat={timeFormat}
      />
    </Header>
  );
};
