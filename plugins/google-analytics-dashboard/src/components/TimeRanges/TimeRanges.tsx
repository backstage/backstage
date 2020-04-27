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

import React, { FC, useContext } from 'react';
import Select from 'components/Select';
import { Context } from 'contexts/Context';

export type TimeRange = {
  'start-date': '7daysAgo' | '30daysAgo';
  'end-date': 'today';
};

const TimeRanges: FC<{}> = () => {
  const { timeRange, setCurrentTimeRange } = useContext(Context);

  const ranges = [
    { value: '7daysAgo', label: '1 week' },
    { value: '30daysAgo', label: '1 Month' },
  ];

  const handleTimeRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeRange({
      'start-date': event.target.value as TimeRange['start-date'],
      'end-date': 'today',
    });
  };

  return (
    <Select
      value={timeRange['start-date']}
      handler={handleTimeRange}
      items={ranges}
    />
  );
};

export default TimeRanges;
