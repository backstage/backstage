/*
 * Copyright 2020 The Backstage Authors
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
import { HeaderLabel } from '@backstage/core-components';

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

type TimeObj = {
  time: string;
  label: string;
};

export type ClockConfig = {
  label: string;
  timeZone: string;
};

function getTimes(clockConfigs: ClockConfig[]) {
  const d = new Date();
  const lang = window.navigator.language;

  const clocks: TimeObj[] = [];

  if (!clockConfigs) {
    return clocks;
  }

  for (const clockConfig of clockConfigs) {
    let label = clockConfig.label;

    const options: Intl.DateTimeFormatOptions = {
      timeZone: clockConfig.timeZone,
      ...timeFormat,
    };

    try {
      new Date().toLocaleString(lang, options);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        `The timezone ${options.timeZone} is invalid. Defaulting to GMT`,
      );
      options.timeZone = 'GMT';
      label = 'GMT';
    }

    const time = d.toLocaleTimeString(lang, options);
    clocks.push({ time, label });
  }

  return clocks;
}

export const HeaderWorldClock = ({
  clockConfigs,
}: {
  clockConfigs: ClockConfig[];
}) => {
  const defaultTimes: TimeObj[] = [];
  const [clocks, setTimes] = React.useState(defaultTimes);

  React.useEffect(() => {
    setTimes(getTimes(clockConfigs));

    const intervalId = setInterval(() => {
      setTimes(getTimes(clockConfigs));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [clockConfigs]);

  if (clocks.length !== 0) {
    return (
      <>
        {clocks.map(clock => (
          <HeaderLabel
            label={clock.label}
            value={clock.time}
            key={clock.label}
          />
        ))}
      </>
    );
  }
  return null;
};
