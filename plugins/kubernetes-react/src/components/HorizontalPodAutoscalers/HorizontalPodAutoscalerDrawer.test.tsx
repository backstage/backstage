/*
 * Copyright 2020 The Backstage Authors
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
import { screen } from '@testing-library/react';
import * as hpas from './__fixtures__/horizontalpodautoscalers.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { HorizontalPodAutoscalerDrawer } from './HorizontalPodAutoscalerDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('HorizontalPodAutoscalersDrawer', () => {
  it('should render hpa drawer', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <HorizontalPodAutoscalerDrawer hpa={hpas[0] as any} expanded>
          <h1>CHILD</h1>
        </HorizontalPodAutoscalerDrawer>
      </TestApiProvider>,
    );

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('CHILD')).toBeInTheDocument();
    expect(screen.getByText('HorizontalPodAutoscaler')).toBeInTheDocument();
    expect(screen.getByText('YAML')).toBeInTheDocument();
    expect(
      screen.getByText('Target CPU Utilization Percentage'),
    ).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(
      screen.getByText('Current CPU Utilization Percentage'),
    ).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Min Replicas')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Max Replicas')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Current Replicas')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('Desired Replicas')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });
});
