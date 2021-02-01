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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Content, Header, Page } from '@backstage/core';
import { createDevApp } from '@backstage/dev-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  AnalyzeResult,
  CatalogImportApi,
  catalogImportApiRef,
  ImportStepper,
} from '../src';
import { ImportComponentPage } from '../src/components/ImportComponentPage';

const getEntityNames = (url: string): EntityName[] => [
  {
    kind: 'Component',
    namespace: url.replace(/^.*(folder-[^/]+).*|.*()$/, '$1') || 'default',
    name: 'component-a',
  },
  {
    kind: 'API',
    namespace: url.replace(/^.*(folder-[^/]+).*|.*()$/, '$1') || 'default',
    name: 'api-a',
  },
];

const getEntities = (url: string): Entity[] => [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      namespace: url.replace(/^.*(folder-[^/]+).*|.*()$/, '$1') || 'default',
      name: 'component-a',
    },
  },
  {
    apiVersion: '1',
    kind: 'API',
    metadata: {
      namespace: url.replace(/^.*(folder-[^/]+).*|.*()$/, '$1') || 'default',
      name: 'api-a',
    },
  },
];

createDevApp()
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      ({
        getEntities: async () => {
          await new Promise(r => setTimeout(r, 1000));

          return {
            items: [
              {
                apiVersion: '1',
                kind: 'Group',
                metadata: {
                  name: 'group-a',
                  namespace: 'default',
                },
                spec: {
                  profile: {
                    displayName: 'Group A',
                  },
                },
              },
              {
                apiVersion: '1',
                kind: 'Group',
                metadata: {
                  name: 'group-b',
                  namespace: 'default',
                },
                spec: {
                  profile: {
                    displayName: 'Group B',
                  },
                },
              },
              {
                apiVersion: '1',
                kind: 'Group',
                metadata: {
                  name: 'group-a',
                  namespace: 'other',
                },
                spec: {
                  profile: {
                    displayName: 'Group A',
                  },
                },
              },
            ] as Entity[],
          };
        },

        addLocation: async location => {
          await new Promise(r => setTimeout(r, 1000));

          return {
            location,
            entities: getEntities(location.target),
          };
        },
      } as CatalogApi),
  })
  .registerApi({
    api: catalogImportApiRef,
    deps: {},
    factory: () =>
      ({
        analyzeUrl: async (url: string): Promise<AnalyzeResult> => {
          await new Promise(r => setTimeout(r, 500));

          switch (url) {
            case 'https://0':
              return {
                type: 'repository',
                url,
                integrationType: 'github',
                generatedEntities: getEntities(url),
              };

            case 'https://1':
            case 'https://2/catalog-info.yaml':
            case 'https://2/folder-a/catalog-info.yaml':
            case 'https://2/folder-b/catalog-info.yaml':
              return {
                type: 'locations',
                locations: [
                  {
                    target: url.includes('/catalog-info.yaml')
                      ? url
                      : `${url}/catalog-info.yaml`,
                    entities: getEntityNames(url),
                  },
                ],
              };

            case 'https://2': {
              const urls = [
                `${url}/catalog-info.yaml`,
                `${url}/folder-a/catalog-info.yaml`,
                `${url}/folder-b/catalog-info.yaml`,
              ];

              return {
                type: 'locations',
                locations: urls.map(u => ({
                  target: u,
                  entities: getEntityNames(u),
                })),
              };
            }

            default:
              throw new Error(`Invalid url ${url}`);
          }
        },

        submitPullRequest: async ({
          repositoryUrl,
        }): Promise<{
          link: string;
          location: string;
        }> => {
          await new Promise(r => setTimeout(r, 2500));

          return {
            link: `${repositoryUrl}/pulls/1`,
            location: `${repositoryUrl}/blob/catalog-info.yaml`,
          };
        },
      } as CatalogImportApi),
  })
  .addPage({
    title: 'Catalog Import',
    element: <ImportComponentPage />,
  })
  .addPage({
    title: 'Catalog Import 2',
    element: (
      <Page themeId="home">
        <Header title="Catalog Import" />
        <Content>
          <Grid container>
            <Grid item xs={12} md={6}>
              <ImportStepper initialUrl="https://0" variant="gridItem" />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImportStepper initialUrl="https://1" variant="gridItem" />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImportStepper initialUrl="https://2" variant="gridItem" />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImportStepper initialUrl="https://3" variant="gridItem" />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImportStepper />
            </Grid>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();
