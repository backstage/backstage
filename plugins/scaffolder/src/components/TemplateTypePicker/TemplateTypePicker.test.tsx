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

import { fireEvent } from '@testing-library/react';
import { capitalize } from 'lodash';
import { Entity } from '@backstage/catalog-model';
import { TemplateTypePicker } from './TemplateTypePicker';
import {
  catalogApiRef,
  EntityKindFilter,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { mockApis } from '@backstage/frontend-test-utils';
import { GetEntityFacetsResponse } from '@backstage/catalog-client';

/*
 * Browser API polyfills for jsdom environment.
 * Radix UI primitives (Popover, Checkbox) and cmdk rely on browser APIs
 * that are not available in jsdom.
 */

// cmdk uses ResizeObserver for measuring list dimensions.
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Radix scrolls selected items into view when opening.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// Radix uses pointer capture APIs for pointer event management.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function () {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function () {};
}

// DOMRect.fromRect is used by Radix for collision-aware positioning.
if (typeof DOMRect === 'undefined' || !DOMRect.fromRect) {
  (globalThis as any).DOMRect = {
    fromRect: () => ({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  };
}

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
  [alertApiRef, mockApis.alert()],
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
