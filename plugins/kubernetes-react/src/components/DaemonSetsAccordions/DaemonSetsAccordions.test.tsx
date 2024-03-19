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
import { DaemonSetsAccordions } from './DaemonSetsAccordions';
import * as oneDaemonsFixture from '../../__fixtures__/2-daemonsets.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('DaemonSetsAccordions', () => {
  it('should render two daemonset', async () => {
    const wrapper = kubernetesProviders(oneDaemonsFixture);

    await renderInTestApp(wrapper(<DaemonSetsAccordions />));

    expect(screen.getByText('fluentd-elasticsearch')).toBeInTheDocument();
    expect(screen.getByText('fluentd-elasticsearch2')).toBeInTheDocument();
  });
});
