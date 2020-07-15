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
import {
  ApiProvider,
  ApiRegistry,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { catalogApiRef } from '../..';
import { CatalogApi } from '../../api/types';
import { EntityFilterGroupsProvider } from '../../filter';
import { CatalogPage } from './CatalogPage';

describe('CatalogPage', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve([
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'Entity1',
          },
          spec: {
            owner: 'tools@example.com',
            type: 'service',
          },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'Entity2',
          },
          spec: {
            owner: 'not-tools@example.com',
            type: 'service',
          },
        },
      ] as Entity[]),
    getLocationByEntity: () =>
      Promise.resolve({ id: 'id', type: 'github', target: 'url' }),
  };
  const indentityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [identityApiRef, indentityApi],
            [storageApiRef, MockStorageApi.create()],
          ])}
        >
          <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>,
        </ApiProvider>,
      ),
    );

  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    const { findByText, getByText } = renderWrapped(<CatalogPage />);
    expect(await findByText(/Owned \(1\)/)).toBeInTheDocument();
    fireEvent.click(getByText(/All/));
    expect(await findByText(/All \(2\)/)).toBeInTheDocument();
  });
});
