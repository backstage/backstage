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

import {
  renderInTestApp,
  TestApiProvider,
  textContentMatcher,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { IngressDrawer } from './IngressDrawer';
import * as ingresses from './__fixtures__/2-ingresses.json';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('IngressDrawer', () => {
  it('should render ingress drawer', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <IngressDrawer ingress={(ingresses as any).ingresses[0]} expanded />
      </TestApiProvider>,
    );

    expect(screen.getAllByText('awesome-service')).toHaveLength(4);
    expect(screen.getByText('YAML')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(
      screen.getByText(textContentMatcher('host: api.awesome-host.io')),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(textContentMatcher('servicePort: 80')),
    ).toHaveLength(2);
    expect(
      screen.getAllByText(textContentMatcher('serviceName: awesome-service')),
    ).toHaveLength(2);
  });
});
