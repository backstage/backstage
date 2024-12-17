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

import { Entity } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { catalogApiRef, EntityProvider } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import {
  EntityRelationWarning,
  hasRelationWarnings,
} from './EntityRelationWarning';

describe('<EntityRelationWarning />', () => {
  const catalogApi = catalogApiMock.mock();
  const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

  const entityExisting: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'existing',
    },
  };

  it('renders EntityRelationWarning if the entity has missing relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      relations: [
        {
          type: 'dependsOn',
          targetRef: 'component:default/missing',
        },
        {
          type: 'dependsOn',
          targetRef: 'component:default/existing',
        },
      ],
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [undefined, entityExisting],
    });
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityRelationWarning />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(
      screen.getByText(content =>
        content.includes(
          "This entity has relations to other entities, which can't be found in the catalog.",
        ),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(content =>
        content.includes('Entities not found are: component:default/missing'),
      ),
    ).toBeInTheDocument();
  });

  it("doesn't render EntityRelationWarning if the entity has no missing relations", async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      relations: [
        {
          type: 'dependsOn',
          targetRef: 'component:default/existing',
        },
      ],
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [entityExisting],
    });
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <EntityRelationWarning />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(
      screen.queryByText(content =>
        content.includes(
          "This entity has relations to other entities, which can't be found in the catalog.",
        ),
      ),
    ).not.toBeInTheDocument();
  });

  it('returns hasRelationWarnings truthy if the entity has missing relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      relations: [
        {
          type: 'dependsOn',
          targetRef: 'component:default/missing',
        },
        {
          type: 'dependsOn',
          targetRef: 'component:default/existing',
        },
      ],
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [undefined, entityExisting],
    });

    const hasWarnings = await hasRelationWarnings(entity, { apis });

    expect(hasWarnings).toBeTruthy();
  });

  it('returns hasRelationWarnings falsy if the entity has no missing relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      relations: [
        {
          type: 'dependsOn',
          targetRef: 'component:default/existing',
        },
      ],
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [entityExisting],
    });

    const hasWarnings = await hasRelationWarnings(entity, { apis });

    expect(hasWarnings).toBeFalsy();
  });
});
