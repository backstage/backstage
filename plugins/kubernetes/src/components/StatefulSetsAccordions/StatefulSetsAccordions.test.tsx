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
import { render } from '@testing-library/react';
import { StatefulSetsAccordions } from './StatefulSetsAccordions';
import * as twoStatefulSetsFixture from '../../__fixtures__/2-statefulsets.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('StatefulSetsAccordions', () => {
  it('should render 2 statefulsets', async () => {
    const wrapper = kubernetesProviders(
      twoStatefulSetsFixture,
      new Set(['dice-roller-canary-7d64cd756c-vtbdx']),
    );

    const { getByText, getAllByText } = render(
      wrapper(wrapInTestApp(<StatefulSetsAccordions />)),
    );

    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('10 pods')).toBeInTheDocument();
    expect(getByText('No pods with errors')).toBeInTheDocument();

    expect(getByText('dice-roller-canary')).toBeInTheDocument();
    expect(getByText('2 pods')).toBeInTheDocument();
    expect(getByText('1 pod with errors')).toBeInTheDocument();

    expect(getAllByText('namespace: default')).toHaveLength(2);
  });
});
