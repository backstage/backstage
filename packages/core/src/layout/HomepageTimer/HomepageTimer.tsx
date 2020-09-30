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

class TimeObj {
  time: string;
  label: string;

  constructor(time: string, label: string) {
    this.time = time;
    this.label = label;
  }
};

function getTimes(configApi: ConfigApi) {
  const d = new Date();
  const lang = window.navigator.language;

  let _a;
  var clocks = [];

  const clockConfigs = (_a = configApi.getOptionalConfigArray("homepage.clocks")) !== null ? _a : [];

  for (let clock of clockConfigs) {
    if (clock.has('label') && clock.has('timezone')) {

      const options = {
        timeZone: clock.getString('timezone'),
        ...timeFormat,
      };

      let time = d.toLocaleTimeString(lang, options);
      let label = clock.getString('label');

      clocks.push(new TimeObj(time, label));
    }
  }

  return clocks;
}

export const HomepageTimer = () => {
  const configApi = useApi(configApiRef);

  const defaultTimes: TimeObj[] = [];
  const [clocks, setTimes] = React.useState(defaultTimes);

  React.useEffect(() => {
    setTimes(getTimes(configApi));

    const intervalId = setInterval(() => {
      setTimes(getTimes(configApi));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [configApi]);


  if (clocks.length !== 0) {
    return (
      <>
        {clocks.map((clock) => (
          <HeaderLabel label={clock.label} value={clock.time} key={clock.label} />
        ))}
      </>
    );
  } else {
    return null;
  }
};
