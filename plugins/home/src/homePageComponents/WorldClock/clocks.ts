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

/** @public */
export type ClockConfig = {
  label: string;
  timeZone: string;
};

export type TimeObj = {
  label: string;
  value: string;
  dateTime: string;
};

const defaultTimeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

export function getTimes(
  clockConfigs: ClockConfig[],
  customTimeFormat?: Intl.DateTimeFormatOptions,
): TimeObj[] {
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
      ...(customTimeFormat ?? defaultTimeFormat),
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
