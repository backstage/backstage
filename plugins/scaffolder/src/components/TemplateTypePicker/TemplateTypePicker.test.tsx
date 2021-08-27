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
import { capitalize } from 'lodash';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { TemplateTypePicker } from './TemplateTypePicker';
import {
  catalogApiRef,
  EntityKindFilter,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { renderWithEffects } from '@backstage/test-utils';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template-1',
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template-2',
    },
    spec: {
      type: 'website',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template-3',
    },
    spec: {
      type: 'library',
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
    } as unknown as CatalogApi,
  ],
  [
    alertApiRef,
    {
      post: jest.fn(),
    } as unknown as AlertApi,
  ],
]);

describe('<TemplateTypePicker/>', () => {
  it('renders available entity types', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('template') },
            backendEntities: entities,
          }}
        >
          <TemplateTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('Categories')).toBeInTheDocument();

    entities.forEach(entity => {
      expect(
        rendered.getByLabelText(capitalize(entity.spec!.type as string)),
      ).toBeInTheDocument();
    });
  });

  it('sets the selected type filters', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('template') },
            backendEntities: entities,
          }}
        >
          <TemplateTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();

    fireEvent.click(rendered.getByLabelText('Service'));
    expect(rendered.getByLabelText('Service')).toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();

    fireEvent.click(rendered.getByLabelText('Website'));
    expect(rendered.getByLabelText('Service')).toBeChecked();
    expect(rendered.getByLabelText('Website')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('Service'));
    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('Website'));
    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();
  });
});
