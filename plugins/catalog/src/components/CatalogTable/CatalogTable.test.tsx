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
import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import * as React from 'react';
import { CatalogTable } from './CatalogTable';

const entites: Entity[] = [
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
    const rendered = render(
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
      /Error encountered while fetching catalog entities./,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display entity names when loading has finished and no error occurred', async () => {
    const rendered = render(
      wrapInTestApp(
        <CatalogTable
          titlePreamble="Owned"
          entities={entites}
          loading={false}
        />,
      ),
    );
    expect(
      await rendered.findByText(`Owned (${entites.length})`),
    ).toBeInTheDocument();
    expect(await rendered.findByText('component1')).toBeInTheDocument();
    expect(await rendered.findByText('component2')).toBeInTheDocument();
    expect(await rendered.findByText('component3')).toBeInTheDocument();
  });
});
