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

import { Entity } from '@backstage/catalog-model';
import { Content, Header, HeaderLabel, Page } from '@backstage/core-components';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import { Box, Typography } from '@material-ui/core';
import SomeIcon from '@material-ui/icons/Storage';
import React from 'react';
import { VaultApi, vaultApiRef } from '../src/api';
import { EntityVaultCard } from '../src/components/EntityVaultCard';
import { EntityVaultTable } from '../src/components/EntityVaultTable';
import { VAULT_SECRET_PATH_ANNOTATION } from '../src/constants';
import { vaultPlugin } from '../src/plugin';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    annotations: { [VAULT_SECRET_PATH_ANNOTATION]: 'a/b' },
  },
  spec: {
    type: 'service',
  },
};

const mockedApi: VaultApi = {
  async listSecrets() {
    return [
      {
        name: 'a::b',
        editUrl: 'https://example.com',
        showUrl: 'https://example.com',
      },
      {
        name: 'c::d',
        editUrl: 'https://example.com',
        showUrl: 'https://example.com',
      },
    ];
  },
};

createDevApp()
  .registerPlugin(vaultPlugin)
  .addPage({
    element: (
      <TestApiProvider apis={[[vaultApiRef, mockedApi]]}>
        <EntityProvider entity={entity}>
          <Page themeId="service">
            <Header title="Mocked Vault">
              <HeaderLabel label="Mode" value="Development" />
            </Header>
            <Content>
              <Typography variant="h3">As a card</Typography>
              <EntityVaultCard />
              <Box mt={4} />
              <Typography variant="h3">As a table</Typography>
              <EntityVaultTable entity={entity} />
            </Content>
          </Page>
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Vault',
    icon: SomeIcon,
  })
  .render();
