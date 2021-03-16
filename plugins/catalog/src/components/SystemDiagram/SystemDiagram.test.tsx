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

import { ApiProvider, ApiRegistry } from '@backstage/core';
import {
  catalogApiRef,
  CatalogApi,
  getEntityRelations,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { Entity, EntityName, RELATION_PART_OF } from '@backstage/catalog-model';

import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { SystemDiagram } from './SystemDiagram';

describe('<SystemDiagram />', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          // {
          //   apiVersion: 'backstage.io/v1alpha1',
          //   kind: 'System',
          //   metadata: {
          //     name: 'my-system',
          //   },
          //   spec: {
          //     owner: 'tools@example.com',
          //   },
          // },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'Entity2',
            },
            spec: {
              owner: 'not-tools@example.com',
              type: 'service',
              system: 'my-system',
            },
          },
        ] as Entity[],
      }),
  };

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'my-system',
        // namespace: 'my-namespace',
      },
      relations: [],
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.from([[catalogApiRef, catalogApi]])}>
        <SystemDiagram entity={entity} />
      </ApiProvider>,
    );

    expect(getByText('System Diagram')).toBeInTheDocument();
    expect(getByText('my-system')).not.toBeInTheDocument();
  });

  it('shows related systems', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'System',
      metadata: {
        name: 'my-system',
        namespace: 'my-namespace',
      },
      relations: [
        {
          target: {
            kind: 'Domain',
            namespace: 'my-namespace',
            name: 'my-domain',
          },
          type: RELATION_PART_OF,
        },
      ],
    };

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.from([[catalogApiRef, catalogApi]])}>
        <SystemDiagram entity={entity} />
      </ApiProvider>,
    );

    expect(getByText('System Diagram')).toBeInTheDocument();
    expect(getByText('my-system')).toBeInTheDocument();
  });
});
