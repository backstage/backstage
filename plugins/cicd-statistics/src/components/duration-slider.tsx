/*
 * Copyright 2022 The Backstage Authors
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

import React, { useCallback, useMemo, useState } from 'react';
import { Slider } from '@material-ui/core';
import { debounce } from 'lodash';

import { formatDuration, formatDurationFromSeconds } from './utils';
import { Label } from './label';

const marks = [
  0,
  1,
  2,
  3,
  4,
  5,
  10,
  20,
  30,
  60,
  2 * 60,
  3 * 60,
  4 * 60,
  5 * 60,
  10 * 60,
  15 * 60,
  30 * 60,
  45 * 60,
  60 * 60,
].map((value, index) => ({
  value: index,
  label: formatDurationFromSeconds(value),
  seconds: value,
}));

function findMarkIndex(seconds: number): number {
  if (marks[0].seconds > seconds) {
    return 0;
  } else if (marks[marks.length - 1].seconds < seconds) {
    return marks.length - 1;
  }
  for (let i = 0; i < marks.length - 1; ++i) {
    const a = marks[i];
    const b = marks[i + 1];
    if (seconds === a.seconds) {
      return i;
    } else if (seconds === b.seconds) {
      return i + 1;
    } else if (a.seconds < seconds && b.seconds > seconds) {
      return seconds - a.seconds < b.seconds - seconds ? i : i - 1;
    }
  }
  return 0; // Won't happen
}

function formatDurationFromIndex(index: number) {
  return formatDurationFromSeconds(marks[index].seconds);
}

export interface DurationSliderProps {
  header: string;
  value: number;
  setValue: (value: number) => void;
}

export function DurationSlider(props: DurationSliderProps) {
  const { header, value, setValue } = props;

  const [curValue, setCurValue] = useState(value);

  const debouncedSetValue = useMemo(() => debounce(setValue, 1000), [setValue]);

  const onChange = useCallback(
    (_: any, index: number | number[]) => {
      const millis = marks[index as number].seconds * 1000;
      setCurValue(millis);
      debouncedSetValue(millis);
    },
    [debouncedSetValue],
  );

  const indexValue = useMemo(() => findMarkIndex(curValue / 1000), [curValue]);

  return (
    <>
      <Label>
        {header} {formatDuration(curValue)}
      </Label>
      <Slider
        value={indexValue}
        min={0}
        step={1}
        max={marks.length - 1}
        marks
        getAriaValueText={formatDurationFromIndex}
        valueLabelFormat={formatDurationFromIndex}
        onChange={onChange}
        valueLabelDisplay="auto"
        aria-labelledby="slider-hide-limit"
      />
    </>
  );
}
