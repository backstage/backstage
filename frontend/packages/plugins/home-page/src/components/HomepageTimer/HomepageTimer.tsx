import React, { FC } from 'react';
import { HeaderLabel } from '@spotify-backstage/core';

const timeFormat = { hour: '2-digit', minute: '2-digit' };
const nycOptions = { timeZone: 'America/New_York', ...timeFormat };
const sydOptions = { timeZone: 'Australia/Sydney', ...timeFormat };
const tyoOptions = { timeZone: 'Asia/Tokyo', ...timeFormat };
const stoOptions = { timeZone: 'Europe/Stockholm', ...timeFormat };

const defaultTimes = {
  timeNY: '',
  timeSYD: '',
  timeTYO: '',
  timeSTO: '',
};

function getTimes() {
  const d = new Date();
  const lang = window.navigator.language;

  // Using the browser native toLocaleTimeString instead of huge moment-tz
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
  const timeNY = d.toLocaleTimeString(lang, nycOptions);
  const timeSYD = d.toLocaleTimeString(lang, sydOptions);
  const timeTYO = d.toLocaleTimeString(lang, tyoOptions);
  const timeSTO = d.toLocaleTimeString(lang, stoOptions);

  return { timeNY, timeSYD, timeTYO, timeSTO };
}

const HomePageTimer: FC<{}> = () => {
  const [{ timeNY, timeSYD, timeTYO, timeSTO }, setTimes] = React.useState(
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
      <HeaderLabel label="STO" value={timeSTO} />
      <HeaderLabel label="TYO" value={timeTYO} />
      <HeaderLabel label="SYD" value={timeSYD} />
    </>
  );
};

export default HomePageTimer;
