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

import { EntityLayout } from '@internal/plugin-catalog-customized';
import {
  EntityProvider,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { githubActionsApiRef } from '@backstage/plugin-github-actions';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { cicdContent } from './EntityPage';

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

  const mockedApi = {
    listWorkflowRuns: jest.fn().mockResolvedValue([]),
  };
  const mockPermissionApi = new MockPermissionApi();

  describe('cicdContent', () => {
    it('Should render GitHub Actions View', async () => {
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [githubActionsApiRef, mockedApi],
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
            [permissionApiRef, mockPermissionApi],
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
      );

      expect(rendered.getByText('ExampleComponent')).toBeInTheDocument();

      await expect(
        rendered.findByText('No Workflow Data'),
      ).resolves.toBeInTheDocument();
      expect(rendered.getByText('Create new Workflow')).toBeInTheDocument();
    });
  });
});
