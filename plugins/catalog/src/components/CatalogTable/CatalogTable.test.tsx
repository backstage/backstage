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

import { Entity } from '@backstage/catalog-model';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import * as React from 'react';
import { CatalogTable } from './CatalogTable';

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component1' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component2' },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'component3' },
  },
];

describe('CatalogTable component', () => {
  it('should render error message when error is passed in props', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <CatalogTable
          titlePreamble="Owned"
          entities={[]}
          loading={false}
          error={{ code: 'error' }}
        />,
      ),
    );
    const errorMessage = await rendered.findByText(
      /Could not fetch catalog entities./,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <CatalogTable
          titlePreamble="Owned"
          entities={entities}
          loading={false}
        />,
      ),
    );
    expect(rendered.getByText(/Owned \(3\)/)).toBeInTheDocument();
    expect(rendered.getByText(/component1/)).toBeInTheDocument();
    expect(rendered.getByText(/component2/)).toBeInTheDocument();
    expect(rendered.getByText(/component3/)).toBeInTheDocument();
  });
});
