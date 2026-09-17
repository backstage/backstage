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
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../../hooks/test-utils';
import * as rollout from './__fixtures__/rollout.json';
import * as pausedRollout from './__fixtures__/paused-rollout.json';
import * as abortedRollout from './__fixtures__/aborted-rollout.json';
import * as groupedResources from './__fixtures__/grouped-resources.json';
import { RolloutAccordions } from './Rollout';
import { DateTime, Duration } from 'luxon';

describe('Rollout', () => {
  it('should render RolloutAccordion', async () => {
    const wrapper = kubernetesProviders(groupedResources, new Set([]));

    await renderInTestApp(
      wrapper(<RolloutAccordions rollouts={[rollout] as any} />),
    );

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('Rollout')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('2 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();
    expect(screen.queryByText('Paused')).toBeNull();
  });

  it('should render RolloutAccordion with error', async () => {
    const wrapper = kubernetesProviders(
      groupedResources,
      new Set(['dice-roller-6c8646bfd-2m5hv']),
    );

    await renderInTestApp(
      wrapper(<RolloutAccordions rollouts={[rollout] as any} />),
    );

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('Rollout')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('2 pods')).toBeInTheDocument();
    expect(screen.getByText('1 pod with errors')).toBeInTheDocument();
    expect(screen.queryByText('Paused')).toBeNull();
  });

  it('should render Paused Rollout with pause text', async () => {
    const wrapper = kubernetesProviders(groupedResources, new Set([]));

    (pausedRollout.status.pauseConditions[0].startTime as any) =
      DateTime.local()
        // millis * secs * mins = 45 mins
        .minus(Duration.fromMillis(1000 * 60 * 45));

    await renderInTestApp(
      wrapper(<RolloutAccordions rollouts={[pausedRollout] as any} />),
    );

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('Rollout')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('2 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();
    expect(screen.getByText('Paused (45 minutes ago)')).toBeInTheDocument();
  });

  it('should render aborted Rollout with aborted text', async () => {
    const wrapper = kubernetesProviders(groupedResources, new Set([]));

    await renderInTestApp(
      wrapper(
        <RolloutAccordions
          defaultExpanded
          rollouts={[abortedRollout] as any}
        />,
      ),
    );

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('Rollout')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('2 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();
    expect(screen.queryByText('Paused')).toBeNull();
    expect(screen.getByText('Rollout status')).toBeInTheDocument();
    expect(screen.getAllByText('Aborted')).toHaveLength(2);
    expect(
      screen.getByText('some metric related failure message'),
    ).toBeInTheDocument();
  });
});
