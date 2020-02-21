import React, { FC } from 'react';
import { HeaderLabel } from '@spotify-backstage/core';

const timeFormat = { hour: '2-digit', minute: '2-digit' };
const nycOptions = { timeZone: 'America/New_York', ...timeFormat };
const utcOptions = { timeZone: 'UTC', ...timeFormat };
const lonOptions = { timeZone: 'Europe/London', ...timeFormat };
const stoOptions = { timeZone: 'Europe/Stockholm', ...timeFormat };

const defaultTimes = {
  timeNY: '',
  timeUTC: '',
  timeLON: '',
  timeSTO: '',
};

function getTimes() {
  const d = new Date();
  const lang = window.navigator.language;

  // Using the browser native toLocaleTimeString instead of huge moment-tz
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
  const timeNY = d.toLocaleTimeString(lang, nycOptions);
  const timeUTC = d.toLocaleTimeString(lang, utcOptions);
  const timeLON = d.toLocaleTimeString(lang, lonOptions);
  const timeSTO = d.toLocaleTimeString(lang, stoOptions);

  return { timeNY, timeUTC, timeLON, timeSTO };
}

const HomePageTimer: FC<{}> = () => {
  const [{ timeNY, timeUTC, timeLON, timeSTO }, setTimes] = React.useState(
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
      <HeaderLabel label="LON" value={timeLON} />
      <HeaderLabel label="STO" value={timeSTO} />
    </>
  );
};

export default HomePageTimer;
