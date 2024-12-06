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

import { screen } from '@testing-library/react';
import { DeploymentsAccordions } from './DeploymentsAccordions';
import * as twoDeployFixture from '../../__fixtures__/2-deployments.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('DeploymentsAccordions', () => {
  it('should render 2 deployments', async () => {
    const wrapper = kubernetesProviders(
      twoDeployFixture,
      new Set(['dice-roller-canary-7d64cd756c-vtbdx']),
    );

    await renderInTestApp(wrapper(<DeploymentsAccordions />));

    expect(screen.getByText('dice-roller')).toBeInTheDocument();
    expect(screen.getByText('10 pods')).toBeInTheDocument();
    expect(screen.getByText('No pods with errors')).toBeInTheDocument();
    expect(
      screen.getByText('min replicas 10 / max replicas 15'),
    ).toBeInTheDocument();
    expect(screen.getByText('current CPU usage: 30%')).toBeInTheDocument();
    expect(screen.getByText('target CPU usage: 50%')).toBeInTheDocument();

    expect(screen.getByText('dice-roller-canary')).toBeInTheDocument();
    expect(screen.getByText('2 pods')).toBeInTheDocument();
    expect(screen.getByText('1 pod with errors')).toBeInTheDocument();
  });
});
