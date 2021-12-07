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
import { render } from '@testing-library/react';
import { JobsAccordions } from './JobsAccordions';
import * as oneCronJobsFixture from '../../__fixtures__/1-cronjobs.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';
import { V1Job, ObjectSerializer } from '@kubernetes/client-node';

describe('JobsAccordions', () => {
  it('should render 2 jobs', async () => {
    const wrapper = kubernetesProviders(oneCronJobsFixture, new Set<string>());

    const jobs: V1Job[] = oneCronJobsFixture.jobs.map(
      job => ObjectSerializer.deserialize(job, 'V1Job') as V1Job,
    );

    const { getByText } = render(
      wrapper(wrapInTestApp(<JobsAccordions jobs={jobs} />)),
    );

    expect(getByText('dice-roller-cronjob-1637028600')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();

    expect(getByText('dice-roller-cronjob-1637025000')).toBeInTheDocument();
    expect(getByText('Succeeded')).toBeInTheDocument();
  });
});
