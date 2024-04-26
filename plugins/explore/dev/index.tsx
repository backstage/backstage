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
import { createDevApp } from '@backstage/dev-utils';
import { CatalogEntityPage, EntityLayout } from '@backstage/plugin-catalog';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';
import React from 'react';
import { ExplorePage, explorePlugin } from '../src';
import { exampleTools } from '../src/util/examples';

const catalogApi: Partial<CatalogApi> = {
  async getEntityByRef(): Promise<Entity | undefined> {
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'example',
        annotations: {
          'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
        },
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'guest',
      },
    } as Entity;
  },
  async getEntities() {
    const domainNames = [
      'playback',
      'artists',
      'payments',
      'analytics',
      'songs',
      'devops',
    ];
    return {
      items: domainNames.map(
        (n, i) =>
          ({
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Domain',
            metadata: {
              name: n,
              description: `Everything about ${n}`,
              tags: i % 2 === 0 ? [n] : undefined,
            },
            spec: {
              owner: `${n}@example.com`,
            },
          } as Entity),
      ),
    };
  },
};

createDevApp()
  .registerPlugin(explorePlugin)
  .registerApi({
    api: exploreToolsConfigRef,
    deps: {},
    factory: () => ({
      async getTools() {
        return exampleTools;
      },
    }),
  })
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () => catalogApi as CatalogApi,
  })
  .addPage({ element: <ExplorePage />, title: 'Explore' })
  .addPage({
    path: '/catalog/:namespace/:kind/:name',
    element: <CatalogEntityPage />,
    children: (
      <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
          <h1>Some Content Here</h1>
        </EntityLayout.Route>
      </EntityLayout>
    ),
  })
  .render();
