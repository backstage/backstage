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
import { ConfigmapsAccordions } from './ConfigmapsAccordions';
import * as oneConfigmapsFixture from '../../__fixtures__/1-configmaps.json';
import * as twoConfigmapsFixture from '../../__fixtures__/2-configmaps.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('ConfigmapsAccordions', () => {
  it('should render 1 configmap', async () => {
    const wrapper = kubernetesProviders(
      oneConfigmapsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<ConfigmapsAccordions />));

    expect(screen.getByText('app-config')).toBeInTheDocument();
    expect(screen.getByText('ConfigMap')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('Data Count: 4')).toBeInTheDocument();
  });

  it('should render 2 configmaps', async () => {
    const wrapper = kubernetesProviders(
      twoConfigmapsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<ConfigmapsAccordions />));

    expect(screen.getByText('app-config')).toBeInTheDocument();
    expect(screen.getByText('redis-config')).toBeInTheDocument();
    expect(screen.getAllByText('ConfigMap')).toHaveLength(2);
    expect(screen.getAllByText('namespace: default')).toHaveLength(2);
    expect(screen.getByText('Data Count: 4')).toBeInTheDocument();
    expect(screen.getByText('Data Count: 3')).toBeInTheDocument();
  });
});
