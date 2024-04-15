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

import { ApiEntity, Entity } from '@backstage/catalog-model';
import { Content, Header, Page } from '@backstage/core-components';
import { createDevApp } from '@backstage/dev-utils';
import { CatalogEntityPage } from '@backstage/plugin-catalog';
import { catalogApiRef, EntityProvider } from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  apiDocsConfigRef,
  apiDocsPlugin,
  ApiExplorerPage,
  defaultDefinitionWidgets,
  EntityApiDefinitionCard,
} from '../src';
import asyncapiApiEntity from './asyncapi-example-api.yaml';
import graphqlApiEntity from './graphql-example-api.yaml';
import invalidLanguageApiEntity from './invalid-language-example-api.yaml';
import openapiApiEntity from './openapi-example-api.yaml';
import otherApiEntity from './other-example-api.yaml';
import trpcApiEntity from './trpc-example-api.yaml';

const mockEntities = [
  openapiApiEntity,
  asyncapiApiEntity,
  graphqlApiEntity,
  invalidLanguageApiEntity,
  otherApiEntity,
  trpcApiEntity,
] as unknown as Entity[];

createDevApp()
  .registerPlugin(apiDocsPlugin)
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      ({
        async getEntities() {
          return {
            items: mockEntities.slice(),
          };
        },
        async getEntityByRef(ref: string) {
          return mockEntities.find(e => e.metadata.name === ref);
        },
      }) as unknown as typeof catalogApiRef.T,
  })
  .registerApi({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      const definitionWidgets = defaultDefinitionWidgets();
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  })
  .addPage({ element: <CatalogEntityPage /> })
  .addPage({ title: 'API Explorer', element: <ApiExplorerPage /> })
  .addPage({
    title: 'OpenAPI',
    element: (
      <Page themeId="home">
        <Header title="OpenAPI" />
        <Content>
          <EntityProvider entity={openapiApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'AsyncAPI',
    element: (
      <Page themeId="home">
        <Header title="AsyncAPI" />
        <Content>
          <EntityProvider entity={asyncapiApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'GraphQL',
    element: (
      <Page themeId="home">
        <Header title="GraphQL" />
        <Content>
          <EntityProvider entity={graphqlApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'Invalid Language',
    element: (
      <Page themeId="home">
        <Header title="Invalid Language" />
        <Content>
          <EntityProvider entity={invalidLanguageApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'Other',
    element: (
      <Page themeId="home">
        <Header title="Other" />
        <Content>
          <EntityProvider entity={otherApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'tRPC',
    element: (
      <Page themeId="home">
        <Header title="tRPC" />
        <Content>
          <EntityProvider entity={trpcApiEntity as any as Entity}>
            <EntityApiDefinitionCard />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .render();
