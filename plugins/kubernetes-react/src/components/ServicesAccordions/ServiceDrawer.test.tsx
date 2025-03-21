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
import * as services from './__fixtures__/2-services.json';
import {
  textContentMatcher,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { ServiceDrawer } from './ServiceDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('ServiceDrawer', () => {
  it('should render deployment drawer', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <ServiceDrawer service={(services as any).services[0]} expanded />,
      </TestApiProvider>,
    );

    expect(screen.getAllByText('awesome-service-grpc')).toHaveLength(2);
    expect(screen.getAllByText('Service')).toHaveLength(2);
    expect(screen.getByText('YAML')).toBeInTheDocument();
    expect(screen.getByText('Cluster IP')).toBeInTheDocument();
    expect(screen.getByText('Ports')).toBeInTheDocument();
    expect(
      screen.getByText(textContentMatcher('targetPort: 1997')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(textContentMatcher('app: awesome-service')),
    ).toBeInTheDocument();
  });
});
