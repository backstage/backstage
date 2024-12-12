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
import { Entity } from '@backstage/catalog-model';
import { TemplateTypePicker } from './TemplateTypePicker';
import {
  catalogApiRef,
  EntityKindFilter,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { GetEntityFacetsResponse } from '@backstage/catalog-client';

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

const apis = TestApiRegistry.from(
  [
    catalogApiRef,
    {
      getEntityFacets: jest.fn().mockResolvedValue({
        facets: {
          'spec.type': entities.map(e => ({
            value: (e.spec as any).type,
            count: 1,
          })),
        },
      } as GetEntityFacetsResponse),
    },
  ],
  [
    alertApiRef,
    {
      post: jest.fn(),
    } as unknown as AlertApi,
  ],
);

describe('<TemplateTypePicker/>', () => {
  it('renders available entity types', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('template', 'Template') },
            backendEntities: entities,
          }}
        >
          <TemplateTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('Categories')).toBeInTheDocument();
    fireEvent.click(rendered.getByTestId('categories-picker-expand'));

    entities.forEach(entity => {
      expect(
        rendered.getByLabelText(capitalize(entity.spec!.type as string)),
      ).toBeInTheDocument();
    });
  });

  it('sets the selected type filters', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('template', 'Template') },
            backendEntities: entities,
          }}
        >
          <TemplateTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    fireEvent.click(rendered.getByTestId('categories-picker-expand'));
    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();

    fireEvent.click(rendered.getByLabelText('Service'));
    fireEvent.click(rendered.getByTestId('categories-picker-expand'));
    expect(rendered.getByLabelText('Service')).toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();

    fireEvent.click(rendered.getByLabelText('Website'));
    fireEvent.click(rendered.getByTestId('categories-picker-expand'));
    expect(rendered.getByLabelText('Service')).toBeChecked();
    expect(rendered.getByLabelText('Website')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('Service'));
    fireEvent.click(rendered.getByTestId('categories-picker-expand'));
    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('Website'));
    fireEvent.click(rendered.getByTestId('categories-picker-expand'));
    expect(rendered.getByLabelText('Service')).not.toBeChecked();
    expect(rendered.getByLabelText('Website')).not.toBeChecked();
  });
});
