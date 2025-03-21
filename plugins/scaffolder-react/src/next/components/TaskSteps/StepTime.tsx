/*
 * Copyright 2023 The Backstage Authors
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
import React, { useCallback, useState } from 'react';
import useInterval from 'react-use/esm/useInterval';
import { DateTime, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import Typography from '@material-ui/core/Typography';
import { useMountEffect } from '@react-hookz/web';

export const StepTime = (props: {
  step: {
    id: string;
    name: string;
    startedAt?: string;
    endedAt?: string;
  };
}) => {
  const [time, setTime] = useState('');
  const { step } = props;

  const getDelay = () => {
    if (step.startedAt && step.endedAt && time) {
      return null;
    }
    if (step.startedAt && step.endedAt) {
      return 1;
    }
    return 1000;
  };

  const calculate = useCallback(() => {
    if (!step.startedAt) {
      setTime('');
      return;
    }

    const end = step.endedAt
      ? DateTime.fromISO(step.endedAt)
      : DateTime.local();

    const startedAt = DateTime.fromISO(step.startedAt);
    const formatted = Interval.fromDateTimes(startedAt, end)
      .toDuration()
      .valueOf();

    setTime(humanizeDuration(formatted, { round: true }));
  }, [step.endedAt, step.startedAt]);

  useMountEffect(calculate);
  useInterval(calculate, getDelay());

  return <Typography variant="caption">{time}</Typography>;
};
