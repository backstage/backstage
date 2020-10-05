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

import React from 'react';
import { render } from '@testing-library/react';
import * as hpaFixture from './__fixtures__/horizontalpodautoscalers.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { HorizontalPodAutoscalers } from './HorizontalPodAutoscalers';

describe('HorizontalPodAutoscalers', () => {
  it('should render horizontalpodautoscaler', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(
        <HorizontalPodAutoscalers hpas={(hpaFixture as any).default} />,
      ),
    );

    // title
    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('Horizontal Pod Autoscaler')).toBeInTheDocument();

    expect(getByText('Scaling Target')).toBeInTheDocument();
    expect(getByText('Api Version: apps/v1')).toBeInTheDocument();
    expect(getByText('Kind: Deployment')).toBeInTheDocument();
    expect(getByText('Name: dice-roller')).toBeInTheDocument();
    expect(getByText('Min Replicas')).toBeInTheDocument();
    expect(getByText('Max Replicas')).toBeInTheDocument();
    expect(getByText('15')).toBeInTheDocument();
    expect(getByText('Current Replicas')).toBeInTheDocument();
    expect(getByText('Desired Replicas')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('Target CPU Utilization Percentage')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('Current CPU Utilization Percentage')).toBeInTheDocument();
    expect(getByText('Last Scale Time')).toBeInTheDocument();
    expect(getAllByText('unknown')).toHaveLength(2);
    expect(getAllByText('10')).toHaveLength(2);
  });
});
