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
import { CICDSwitcher } from './EntityPage';
import { UrlPatternDiscovery, ApiProvider, ApiRegistry } from '@backstage/core';
import {
  buildKiteApiRef,
  BuildkiteApi,
} from '@roadiehq/backstage-plugin-buildkite';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';

describe('EntityPage Test', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'ExampleComponent',
      annotations: {
        'buildkite.com/project-slug': 'exampleProject/examplePipeline',
      },
    },
    spec: {
      owner: 'guest',
      type: 'service',
      lifecycle: 'production',
    },
  };

  const discoveryApi = UrlPatternDiscovery.compile('http://exampleapi.com');

  const apis = ApiRegistry.from([
    [buildKiteApiRef, new BuildkiteApi({ discoveryApi })],
  ]);

  describe('CICDSwitcher Test', () => {
    it('Should render Buildkite View', async () => {
      const renderedComponent = await renderWithEffects(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <CICDSwitcher entity={entity} />
          </ApiProvider>,
        ),
      );
      expect(
        renderedComponent.getByText(/exampleProject\/examplePipeline/),
      ).toBeInTheDocument();
    });
  });
});
