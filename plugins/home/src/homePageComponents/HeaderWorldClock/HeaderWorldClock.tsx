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
  label: string;
  value: string;
  dateTime: string;
};

/** @public */
export type ClockConfig = {
  label: string;
  timeZone: string;
};

function getTimes(
  clockConfigs: ClockConfig[],
  customTimeFormat?: Intl.DateTimeFormatOptions,
) {
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
      ...(customTimeFormat ?? timeFormat),
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

    const value = d.toLocaleTimeString(lang, options);
    const dateTime = d.toLocaleTimeString(lang, {
      timeZone: options.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    clocks.push({ label, value, dateTime });
  }

  return clocks;
}

/**
 * A component to display a configurable list of clocks for various time zones.
 *
 * @example
 * Here's a simple example:
 * ```
 * // This will give you a clock for the time zone that Stockholm is in
 * // you can add more than one but keep in mind space may be limited
 * const clockConfigs: ClockConfig[] = [
 *  {
 *    label: 'STO',
 *    timeZone: 'Europe/Stockholm',
 *  },
 * ];
 *
 * // Setting hour12 to false will make all the clocks show in the 24hr format
 * const timeFormat: Intl.DateTimeFormatOptions = {
 *  hour: '2-digit',
 *  minute: '2-digit',
 *  hour12: false,
 * };
 *
 * // Here is the component in use:
 * <HeaderWorldClock
 *  clockConfigs={clockConfigs}
 *  customTimeFormat={timeFormat}
 * />
 * ```
 *
 * @public
 */
export const HeaderWorldClock = (props: {
  clockConfigs: ClockConfig[];
  customTimeFormat?: Intl.DateTimeFormatOptions;
}) => {
  const { clockConfigs, customTimeFormat } = props;

  const defaultTimes: TimeObj[] = [];
  const [clocks, setTimes] = React.useState(defaultTimes);

  React.useEffect(() => {
    setTimes(getTimes(clockConfigs, customTimeFormat));

    const intervalId = setInterval(() => {
      setTimes(getTimes(clockConfigs, customTimeFormat));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [clockConfigs, customTimeFormat]);

  if (clocks.length !== 0) {
    return (
      <>
        {clocks.map(clock => (
          <HeaderLabel
            key={clock.label}
            label={clock.label}
            value={<time dateTime={clock.dateTime}>{clock.value}</time>}
          />
        ))}
      </>
    );
  }
  return null;
};
