/*
 * Copyright 2020 The Backstage Authors
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
import { setupServer } from 'msw/node';
import {
  setupRequestMockHandlers,
  TestApiRegistry,
} from '@backstage/test-utils';
import { ComponentEntity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { EntityVaultTable } from './EntityVaultTable';
import { ApiProvider, UrlPatternDiscovery } from '@backstage/core-app-api';
import { VaultSecret, vaultApiRef, VaultClient } from '../../api';
import { rest } from 'msw';

describe('EntityVaultTable', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  let apis: TestApiRegistry;
  const mockBaseUrl = 'https://api-vault.com/api/vault';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const entityOk: ComponentEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test',
      description: 'This is the description',
      annotations: {
        'vault.io/secrets-path': 'test/success',
      },
    },
    spec: {
      lifecycle: 'production',
      owner: 'owner',
      type: 'service',
    },
  };

  const entityNotOk: ComponentEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test',
      description: 'This is the description',
      annotations: {
        'vault.io/secrets-path': 'test/error',
      },
    },
    spec: {
      lifecycle: 'production',
      owner: 'owner',
      type: 'service',
    },
  };

  const mockSecretsResult: VaultSecret[] = [
    {
      name: 'secret::one',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::one`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::one`,
    },
    {
      name: 'secret::two',
      editUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/edit/test/success/secret::two`,
      showUrl: `${mockBaseUrl}/ui/vault/secrets/secrets/show/test/success/secret::two`,
    },
  ];

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/v1/secrets/:path`, (req, res, ctx) => {
        const { path } = req.params;
        if (path === 'test/success') {
          return res(ctx.json(mockSecretsResult));
        } else if (path === 'test/error') {
          return res(ctx.json([]));
        }
        return res(ctx.status(400));
      }),
    );
  };

  beforeEach(() => {
    apis = TestApiRegistry.from([
      vaultApiRef,
      new VaultClient({ discoveryApi }),
    ]);
  });

  it('should render secrets', async () => {
    setupHandlers();
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityVaultTable entity={entityOk} />
      </ApiProvider>,
    );

    expect(await rendered.findAllByText(/secret::one/)).toBeDefined();
    expect(await rendered.findAllByText(/secret::two/)).toBeDefined();
  });

  it('should render no secrets found', async () => {
    setupHandlers();
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityVaultTable entity={entityNotOk} />
      </ApiProvider>,
    );

    expect(rendered.getByText(/No secrets found/)).toBeInTheDocument();
  });
});
