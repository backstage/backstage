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
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { HomePage } from './HomePage';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { Entity, EntityMeta } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';

describe('HomePage', () => {
  it('should render', async () => {
    const catalogApi: Partial<CatalogApi> = {
      getEntities: () => {
        const testMeta: EntityMeta = { name: 'testComponent' };
        const testEntity: Entity = {
          metadata: testMeta,
          apiVersion: '0',
          kind: 'Component',
          spec: { owner: 'owner' },
        };
        return Promise.resolve({
          items: [testEntity] as Entity[],
        });
      },
    };

    const rendered = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.from([[catalogApiRef, catalogApi]])}>
        <HomePage />
      </ApiProvider>,
    );

    expect(await rendered.findAllByText('testComponent')).toBeInTheDocument();
  });
});
