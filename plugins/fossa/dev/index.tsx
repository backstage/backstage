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

import { Entity } from '@backstage/catalog-model';
import { Content, Header, Page } from '@backstage/core';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import { EntityFossaCard } from '../src';
import { FossaApi, fossaApiRef } from '../src/api';
import { FOSSA_PROJECT_NAME_ANNOTATION } from '../src/components/useProjectName';

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [FOSSA_PROJECT_NAME_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: fossaApiRef,
    deps: {},
    factory: () =>
      ({
        getFindingSummary: async projectTitle => {
          switch (projectTitle) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'zero-deps':
              return {
                timestamp: new Date().toISOString(),
                issueCount: 0,
                dependencyCount: 0,
                projectDefaultBranch: 'master',
                projectUrl: `/#${projectTitle}`,
              };

            case 'issues':
              return {
                timestamp: new Date().toISOString(),
                issueCount: 5,
                dependencyCount: 100,
                projectDefaultBranch: 'develop',
                projectUrl: `/#${projectTitle}`,
              };

            case 'no-issues':
              return {
                timestamp: new Date().toISOString(),
                issueCount: 0,
                dependencyCount: 150,
                projectDefaultBranch: 'feat/fossa',
                projectUrl: `/#${projectTitle}`,
              };

            default:
              return undefined;
          }
        },
      } as FossaApi),
  })
  .addPage({
    title: 'Entity Content',
    element: (
      <Page themeId="home">
        <Header title="Fossa" />
        <Content>
          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('empty')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('error')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('never')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('zero-deps')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('issues')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <EntityProvider entity={entity('no-issues')}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
            <Grid item xs={12}>
              <EntityProvider entity={entity(undefined)}>
                <EntityFossaCard />
              </EntityProvider>
            </Grid>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();
