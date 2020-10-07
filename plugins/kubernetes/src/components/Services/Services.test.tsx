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
import { Services } from './Services';
import * as servicesFixture from './__fixtures__/services.json';
import { wrapInTestApp } from '@backstage/test-utils';

describe('Services', () => {
  it('should render 2 services', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(<Services services={(servicesFixture as any).default} />),
    );

    // common elements
    expect(getAllByText('Service')).toHaveLength(2);
    expect(getAllByText('Ports')).toHaveLength(2);
    expect(getAllByText('Type')).toHaveLength(2);
    expect(getAllByText('Protocol: TCP')).toHaveLength(3);

    // service 1
    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('ClusterIP')).toBeInTheDocument();

    expect(getByText('Name: port1')).toBeInTheDocument();
    expect(getByText('Port: 80')).toBeInTheDocument();
    expect(getByText('Target Port: 9376')).toBeInTheDocument();
    expect(getByText('Name: port1')).toBeInTheDocument();
    expect(getByText('Port: 81')).toBeInTheDocument();
    expect(getByText('Target Port: 9377')).toBeInTheDocument();
    expect(getByText('10.102.223.105')).toBeInTheDocument();

    // service 2
    expect(getByText('dice-roller-lb')).toBeInTheDocument();
    expect(getByText('LoadBalancer')).toBeInTheDocument();
    expect(getByText('Node Port: 32276')).toBeInTheDocument();
    expect(getByText('Port: 8765')).toBeInTheDocument();
    expect(getByText('Target Port: 9378')).toBeInTheDocument();
  });
});
