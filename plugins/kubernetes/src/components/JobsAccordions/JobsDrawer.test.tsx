/*
 * Copyright 2021 The Backstage Authors
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
import * as oneCronJobsFixture from '../../__fixtures__/1-cronjobs.json';
import { renderInTestApp } from '@backstage/test-utils';
import { JobDrawer } from './JobsDrawer';

describe('JobDrawer', () => {
  it('should render job drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <JobDrawer job={(oneCronJobsFixture as any).jobs[0]} expanded />,
    );

    expect(getAllByText('dice-roller-cronjob-1637025000')).toHaveLength(2);
    expect(getAllByText('Job')).toHaveLength(2);
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Parallelism')).toBeInTheDocument();
    expect(getByText('Completions')).toBeInTheDocument();
    expect(getByText('Backoff Limit')).toBeInTheDocument();
    expect(getByText('Start Time')).toBeInTheDocument();
  });
});
