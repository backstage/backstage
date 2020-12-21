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
import { EntityLayout } from './EntityLayout';
import {
  AlertApi,
  alertApiRef,
  ApiProvider,
  ApiRegistry,
} from '@backstage/core';
import { renderInTestApp, withLogCollector } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Routes, Route } from 'react-router';
import { Entity } from '@backstage/catalog-model';
import { EntityContext } from '../../hooks/useEntity';
import { catalogApiRef } from '../../plugin';
import { CatalogApi } from '@backstage/catalog-client';

const mockEntityData = {
  loading: false,
  error: undefined,
  entity: {
    kind: 'MyKind',
    metadata: {
      name: 'my-entity',
    },
  } as Entity,
};

const mockApis = ApiRegistry.with(catalogApiRef, {} as CatalogApi).with(
  alertApiRef,
  {} as AlertApi,
);

describe('EntityLayout', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityContext.Provider value={mockEntityData}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
          </EntityLayout>
        </EntityContext.Provider>
      </ApiProvider>,
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('throws if any other component is a child of TabbedLayout', async () => {
    const { error } = await withLogCollector(async () => {
      await expect(
        renderInTestApp(
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </EntityLayout.Route>
            <div>This will cause app to throw</div>
          </EntityLayout>,
        ),
      ).rejects.toThrow(/Child of EntityLayout must be an EntityLayout.Route/);
    });

    expect(error).toEqual([
      expect.stringMatching(
        /Child of EntityLayout must be an EntityLayout.Route/,
      ),
      expect.stringMatching(
        /The above error occurred in the <EntityLayout> component/,
      ),
    ]);
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={
            <ApiProvider apis={mockApis}>
              <EntityContext.Provider value={mockEntityData}>
                <EntityLayout>
                  <EntityLayout.Route path="/" title="tabbed-test-title">
                    <div>tabbed-test-content</div>
                  </EntityLayout.Route>
                  <EntityLayout.Route
                    path="/some-other-path"
                    title="tabbed-test-title-2"
                  >
                    <div>tabbed-test-content-2</div>
                  </EntityLayout.Route>
                </EntityLayout>
              </EntityContext.Provider>
            </ApiProvider>
          }
        />
      </Routes>,
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });
});
