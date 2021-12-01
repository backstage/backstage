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
import { CatalogListResponse } from '@backstage/catalog-client';
import {
  Entity,
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Content, Header, Page } from '@backstage/core-components';
import { createDevApp } from '@backstage/dev-utils';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
  EntityCatalogGraphCard,
} from '../src';

type DataRelation = [string, string, string];
type DataEntity = [string, string, DataRelation[]];

const entities = (
  [
    [
      'Domain',
      'wayback',
      [
        [RELATION_OWNED_BY, 'Group', 'team-a'],
        [RELATION_HAS_PART, 'System', 'wayback'],
      ],
    ],
    [
      'System',
      'wayback',
      [
        [RELATION_OWNED_BY, 'Group', 'team-a'],
        [RELATION_PART_OF, 'Domain', 'wayback'],
        [RELATION_HAS_PART, 'Component', 'wayback-archive'],
        [RELATION_HAS_PART, 'Component', 'wayback-search'],
        [RELATION_HAS_PART, 'API', 'wayback-api'],
      ],
    ],
    [
      'Component',
      'wayback-archive',
      [
        [RELATION_OWNED_BY, 'Group', 'team-a'],
        [RELATION_PART_OF, 'System', 'wayback'],
        [RELATION_PROVIDES_API, 'API', 'wayback-api'],
      ],
    ],
    [
      'Component',
      'wayback-search',
      [
        [RELATION_OWNED_BY, 'Group', 'team-a'],
        [RELATION_PART_OF, 'System', 'wayback'],
        [RELATION_CONSUMES_API, 'API', 'wayback-api'],
      ],
    ],
    [
      'API',
      'wayback-api',
      [
        [RELATION_OWNED_BY, 'Group', 'team-a'],
        [RELATION_PART_OF, 'System', 'wayback'],
        [RELATION_API_PROVIDED_BY, 'Component', 'wayback-archive'],
        [RELATION_API_CONSUMED_BY, 'Component', 'wayback-search'],
      ],
    ],
    [
      'Group',
      'team-a',
      [
        [RELATION_OWNER_OF, 'Component', 'wayback-archive'],
        [RELATION_OWNER_OF, 'Component', 'wayback-search'],
        [RELATION_OWNER_OF, 'API', 'wayback-api'],
        [RELATION_OWNER_OF, 'Domain', 'wayback'],
        [RELATION_OWNER_OF, 'System', 'wayback'],
      ],
    ],
  ] as DataEntity[]
).reduce((o, d) => {
  const [kind, name, relations] = d;

  const entity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind,
    metadata: {
      name,
    },
    relations: relations.map(([type, k, n]) => ({
      target: { kind: k, name: n, namespace: ENTITY_DEFAULT_NAMESPACE },
      type,
    })),
  };
  const entityRef = stringifyEntityRef(entity);
  o[entityRef] = entity;
  return o;
}, {} as { [entityRef: string]: Entity });

createDevApp()
  .registerPlugin(catalogGraphPlugin)
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory() {
      return {
        async getEntityByName(name: EntityName): Promise<Entity | undefined> {
          return entities[stringifyEntityRef(name)];
        },
        async getEntities(): Promise<CatalogListResponse<Entity>> {
          return { items: Object.values(entities) };
        },
      } as Partial<CatalogApi> as unknown as CatalogApi;
    },
  })
  .addPage({
    title: 'Graph Card',
    element: (
      <Page themeId="home">
        <Header title="Graph Card" />
        <Content>
          <Grid container>
            <Grid item xs={12}>
              <EntityProvider
                entity={entities['component:default/wayback-archive']}
              >
                <EntityCatalogGraphCard />
              </EntityProvider>
            </Grid>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .addPage({
    element: <CatalogGraphPage />,
  })
  .render();
