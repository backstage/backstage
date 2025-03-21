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
import { EntityLayout, catalogPlugin } from '@backstage/plugin-catalog';
import {
  EntityProvider,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { cicdContent } from './EntityPage';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('EntityPage Test', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'ExampleComponent',
      annotations: {
        'github.com/project-slug': 'example/project',
      },
    },
    spec: {
      owner: 'guest',
      type: 'service',
      lifecycle: 'production',
    },
  };

  const rootRouteRef = catalogPlugin.routes.catalogIndex;

  describe('cicdContent', () => {
    it('Should render GitHub Actions View', async () => {
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
            [permissionApiRef, mockApis.permission()],
            [catalogApiRef, catalogApiMock()],
          ]}
        >
          <EntityProvider entity={entity}>
            <EntityLayout>
              <EntityLayout.Route path="/ci-cd" title="CI-CD">
                {cicdContent}
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog': rootRouteRef,
          },
        },
      );

      expect(rendered.getByText('ExampleComponent')).toBeInTheDocument();

      await expect(
        rendered.findByText('No CI/CD available for this entity'),
      ).resolves.toBeInTheDocument();
    });
  });
});
