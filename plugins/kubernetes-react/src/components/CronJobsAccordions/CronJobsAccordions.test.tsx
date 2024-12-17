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

import { screen } from '@testing-library/react';
import { CronJobsAccordions } from './CronJobsAccordions';
import * as oneCronJobsFixture from '../../__fixtures__/1-cronjobs.json';
import * as twoCronJobsFixture from '../../__fixtures__/2-cronjobs.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('CronJobsAccordions', () => {
  it('should render 1 active cronjobs', async () => {
    const wrapper = kubernetesProviders(oneCronJobsFixture, new Set<string>());

    await renderInTestApp(wrapper(<CronJobsAccordions />));

    expect(screen.getByText('dice-roller-cronjob')).toBeInTheDocument();
    expect(screen.getByText('CronJob')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render 1 suspended cronjobs', async () => {
    const wrapper = kubernetesProviders(twoCronJobsFixture, new Set<string>());

    await renderInTestApp(wrapper(<CronJobsAccordions />));

    expect(screen.getByText('dice-roller-cronjob')).toBeInTheDocument();
    expect(screen.getByText('CronJob')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });
});
