/*
 * Copyright 2021 The Backstage Authors
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
import { fireEvent } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityKindFilter,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { renderWithEffects } from '@backstage/test-utils';
import { CatalogKindHeader } from './CatalogKindHeader';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template',
    },
  },
  {
    apiVersion: '1',
    kind: 'System',
    metadata: {
      name: 'system',
    },
  },
];

const apis = ApiRegistry.from([
  [
    catalogApiRef,
    {
      getEntities: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ items: entities })),
    } as Partial<CatalogApi>,
  ],
]);

describe('<CatalogKindHeader />', () => {
  it('renders available kinds', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    fireEvent.mouseDown(input);

    entities.map(entity => {
      expect(
        rendered.getByRole('option', { name: `${entity.kind}s` }),
      ).toBeInTheDocument();
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'frob' } }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(rendered.getByText('Frobs')).toBeInTheDocument();
  });

  it('updates the kind filter', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ updateFilters }}>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    fireEvent.mouseDown(input);

    const option = rendered.getByRole('option', { name: 'Templates' });
    fireEvent.click(option);

    expect(updateFilters).toHaveBeenCalledWith({
      kind: new EntityKindFilter('template'),
    });
  });
});
