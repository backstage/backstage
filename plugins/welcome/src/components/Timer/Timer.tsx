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

import React, { FC } from 'react';
import { HeaderLabel } from '@spotify-backstage/core';

const timeFormat = { hour: '2-digit', minute: '2-digit' };
const utcOptions = { timeZone: 'UTC', ...timeFormat };
const nycOptions = { timeZone: 'America/New_York', ...timeFormat };
const tyoOptions = { timeZone: 'Asia/Tokyo', ...timeFormat };
const stoOptions = { timeZone: 'Europe/Stockholm', ...timeFormat };

const defaultTimes = {
  timeNY: '',
  timeUTC: '',
  timeTYO: '',
  timeSTO: '',
};

function getTimes() {
  const d = new Date();
  const lang = window.navigator.language;

  // Using the browser native toLocaleTimeString instead of huge moment-tz
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
  const timeNY = d.toLocaleTimeString(lang, nycOptions);
  const timeUTC = d.toLocaleTimeString(lang, utcOptions);
  const timeTYO = d.toLocaleTimeString(lang, tyoOptions);
  const timeSTO = d.toLocaleTimeString(lang, stoOptions);

  return { timeNY, timeUTC, timeTYO, timeSTO };
}

const HomePageTimer: FC<{}> = () => {
  const [{ timeNY, timeUTC, timeTYO, timeSTO }, setTimes] = React.useState(
    defaultTimes,
  );

  React.useEffect(() => {
    setTimes(getTimes());

    const intervalId = setInterval(() => {
      setTimes(getTimes());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <HeaderLabel label="NYC" value={timeNY} />
      <HeaderLabel label="UTC" value={timeUTC} />
      <HeaderLabel label="STO" value={timeSTO} />
      <HeaderLabel label="TYO" value={timeTYO} />
    </>
  );
};

export default HomePageTimer;
