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
import * as ingressesFixture from './__fixtures__/ingress.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { Ingresses } from './Ingresses';

describe('Ingresses', () => {
  it('should render ingress', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <Ingresses ingresses={(ingressesFixture as any).default} />,
      ),
    );

    // title
    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('Ingress')).toBeInTheDocument();

    // values
    expect(getByText('Backend')).toBeInTheDocument();
    expect(getByText('Ip: 192.168.64.2')).toBeInTheDocument();
    expect(getByText('Rules')).toBeInTheDocument();
    expect(getByText('Host: nginx')).toBeInTheDocument();
    expect(getByText('Http:')).toBeInTheDocument();
    expect(getByText('Paths:')).toBeInTheDocument();
    expect(getByText('Service Name: dice-roller')).toBeInTheDocument();
    expect(getByText('Service Port: 80')).toBeInTheDocument();
    expect(getByText('Path: /')).toBeInTheDocument();
    expect(getByText('Path Type: ImplementationSpecific')).toBeInTheDocument();
  });
});
