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

import React from 'react';
import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import {
  ApiProvider,
  ApiRegistry,
  IdentityApi,
  identityApiRef,
  ProfileInfo,
  storageApiRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, Matcher, render, waitFor } from '@testing-library/react';
import { within, screen } from '@testing-library/dom';
import { EntityFilterGroupsProvider } from '../../filter';
import { createComponentRouteRef } from '../../routes';
import { CatalogBasePage } from './CatalogPageBase';
import { CustomTable } from '../../../dev/CustomTable';

describe('CatalogPage', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
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
            relations: [
              {
                type: RELATION_OWNED_BY,
                target: { kind: 'Group', name: 'tools', namespace: 'default' },
              },
            ],
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
            relations: [
              {
                type: RELATION_OWNED_BY,
                target: {
                  kind: 'Group',
                  name: 'not-tools',
                  namespace: 'default',
                },
              },
            ],
          },
        ] as Entity[],
      }),
    getLocationByEntity: () =>
      Promise.resolve({ id: 'id', type: 'github', target: 'url' }),
    getEntityByName: async entityName => {
      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: entityName.name },
        relations: [
          {
            type: RELATION_MEMBER_OF,
            target: { namespace: 'default', kind: 'Group', name: 'tools' },
          },
        ],
      };
    },
  };
  const testProfile: Partial<ProfileInfo> = {
    displayName: 'Display Name',
  };
  const identityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
    getProfile: () => testProfile,
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [identityApiRef, identityApi],
            [storageApiRef, MockStorageApi.create()],
          ])}
        >
          <EntityFilterGroupsProvider>{children}</EntityFilterGroupsProvider>,
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create': createComponentRouteRef,
          },
        },
      ),
    );

  it('should render a custom table with working managed filters', async () => {
    const { findByText, getByText } = renderWrapped(
      <CatalogBasePage
        showHeaderTabs={false}
        showSupportButton
        showManagedFilters
        TableComponent={() => <CustomTable useBuiltInFilters={false} />}
      />,
    );
    expect(await findByText(/Owned/)).toBeInTheDocument();
    fireEvent.click(getByText(/All/));
    expect(await findByText(/All/)).toBeInTheDocument();
  });

  it('should set initial filter correctly when managed filters are enabled', async () => {
    const { findByText } = renderWrapped(
      <CatalogBasePage
        showHeaderTabs={false}
        showManagedFilters
        showSupportButton
        initiallySelectedFilter="all"
        TableComponent={() => <CustomTable useBuiltInFilters={false} />}
      />,
    );
    expect(await findByText(/All/)).toBeInTheDocument();
  });

  it('should render the correct entities filtered on the selectedfilter', async () => {
    const findInside = (filterElement: HTMLElement, regex: RegExp) =>
      within(filterElement).getByText(
        (((_: string, node: Element) =>
          node?.textContent?.match(regex)) as unknown) as Matcher,
        { selector: 'li' },
      );
    const { findByText, getByText } = await renderWrapped(
      <CatalogBasePage
        showHeaderTabs={false}
        showManagedFilters
        showSupportButton
        TableComponent={() => <CustomTable useBuiltInFilters={false} />}
      />,
    );

    const filters = screen.getByText('Personal').parentElement as HTMLElement;
    // wait for table to render
    await findByText('Entity1');

    expect(findInside(filters, /Owned.*1/)).toBeInTheDocument();
    expect(findInside(filters, /Starred.*0/)).toBeInTheDocument();

    fireEvent.click(getByText(/All/));
    expect(findInside(filters, /All.*2/)).toBeInTheDocument();
  });
});
