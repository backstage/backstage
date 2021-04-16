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

import {
  ApiProvider,
  ApiRegistry,
  ConfigApi,
  configApiRef,
  ConfigReader,
  IdentityApi,
  identityApiRef,
} from '@backstage/core';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { CatalogIndexPage } from './CatalogIndexPage';

describe('CatalogIndexPage', () => {
  const identityApi: Partial<IdentityApi> = {
    getUserId: () => 'tools@example.com',
    getProfile: () => ({ displayName: 'Tools', email: 'tools@example.com' }),
  };

  const configApi: ConfigApi = new ConfigReader({
    organization: {
      name: 'My Company',
    },
  });

  const apis = ApiRegistry.from([
    [configApiRef, configApi],
    [identityApiRef, identityApi],
  ]);

  it('should render', async () => {
    const { queryByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CatalogIndexPage />
      </ApiProvider>,
    );

    expect(queryByText(/.*Service Catalog/)).toBeInTheDocument();
    expect(queryByText('derp')).not.toBeInTheDocument();
  });
});
