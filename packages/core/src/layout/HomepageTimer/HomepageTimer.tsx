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
import { HeaderLabel } from '../HeaderLabel';
import { ConfigApi, useApi, configApiRef } from '@backstage/core-api';

const timeFormat = { hour: '2-digit', minute: '2-digit' };
const defaultTimes = {
  timeOne: { time: '', label: '' },
  timeTwo: { time: '', label: '' },
  timeThree: { time: '', label: '' },
  timeFour: { time: '', label: '' },
};

interface timeObj {
  time: string;
  label: string;
}

function updateTimeObject(
  configApi: ConfigApi,
  config: string,
  timeObject: timeObj,
) {
  const timezoneConfig = configApi.getOptionalConfig('homepageTimer');

  if (timezoneConfig) {
    const d = new Date();
    const lang = window.navigator.language;

    if (
      timezoneConfig.has(`${config}.label`) &&
      timezoneConfig.has(`${config}.timezone`)
    ) {
      const options = {
        timeZone: timezoneConfig.getString(`${config}.timezone`),
        ...timeFormat,
      };

      // Using the browser native toLocaleTimeString instead of huge moment-tz
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
      timeObject.time = d.toLocaleTimeString(lang, options);
      timeObject.label = timezoneConfig.getString(`${config}.label`);
    }
  }
}

function getTimes(configApi: ConfigApi) {
  const timeOne = { time: '', label: '' };
  const timeTwo = { time: '', label: '' };
  const timeThree = { time: '', label: '' };
  const timeFour = { time: '', label: '' };

  updateTimeObject(configApi, 'timeOne', timeOne);
  updateTimeObject(configApi, 'timeTwo', timeTwo);
  updateTimeObject(configApi, 'timeThree', timeThree);
  updateTimeObject(configApi, 'timeFour', timeFour);

  return { timeOne, timeTwo, timeThree, timeFour };
}

export const HomepageTimer = () => {
  const configApi = useApi(configApiRef);

  const [{ timeOne, timeTwo, timeThree, timeFour }, setTimes] = React.useState(
    defaultTimes,
  );

  React.useEffect(() => {
    setTimes(getTimes(configApi));

    const intervalId = setInterval(() => {
      setTimes(getTimes(configApi));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [configApi]);

  return (
    <>
      {/* HeaderLabel returns a literal <unknown> if an empty string is passed, thus the check to needs to be done
      to check if the element needs to be present */}
      {timeOne.label.length === 0 ? null : (
        <HeaderLabel label={timeOne.label} value={timeOne.time} />
      )}
      {timeTwo.label.length === 0 ? null : (
        <HeaderLabel label={timeTwo.label} value={timeTwo.time} />
      )}
      {timeThree.label.length === 0 ? null : (
        <HeaderLabel label={timeThree.label} value={timeThree.time} />
      )}
      {timeFour.label.length === 0 ? null : (
        <HeaderLabel label={timeFour.label} value={timeFour.time} />
      )}
    </>
  );
};
