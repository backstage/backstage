import React, { FC } from 'react';
import { HeaderLabel } from '@backstage/core';

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
