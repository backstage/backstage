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
import { DateTime, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import React from 'react';

export const CreatedAtColumn = ({ createdAt }: { createdAt: string }) => {
  const createdAtTime = DateTime.fromISO(createdAt);
  const formatted = Interval.fromDateTimes(createdAtTime, DateTime.local())
    .toDuration()
    .valueOf();

  return <p>{humanizeDuration(formatted, { round: true })} ago</p>;
};
