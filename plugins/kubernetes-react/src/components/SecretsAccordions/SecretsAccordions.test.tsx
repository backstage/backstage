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
import { SecretsAccordions } from './SecretsAccordions';
import * as oneSecretsFixture from '../../__fixtures__/1-secrets.json';
import * as twoSecretsFixture from '../../__fixtures__/2-secrets.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('SecretsAccordions', () => {
  it('should render 1 secret', async () => {
    const wrapper = kubernetesProviders(oneSecretsFixture, new Set<string>());

    await renderInTestApp(wrapper(<SecretsAccordions />));

    expect(screen.getByText('app-secret')).toBeInTheDocument();
    expect(screen.getByText('Secret')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('Data Count: 4')).toBeInTheDocument();
  });

  it('should render 2 secrets', async () => {
    const wrapper = kubernetesProviders(twoSecretsFixture, new Set<string>());

    await renderInTestApp(wrapper(<SecretsAccordions />));

    expect(screen.getByText('app-secret')).toBeInTheDocument();
    expect(screen.getByText('redis-secret')).toBeInTheDocument();
    expect(screen.getAllByText('Secret')).toHaveLength(2);
    expect(screen.getAllByText('namespace: default')).toHaveLength(2);
    expect(screen.getByText('Data Count: 4')).toBeInTheDocument();
    expect(screen.getByText('Data Count: 3')).toBeInTheDocument();
  });
});
