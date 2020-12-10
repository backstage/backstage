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

import { createDevApp } from '@backstage/dev-utils';
import {
  Content,
  createPlugin,
  createRouteRef,
  Header,
  Page,
} from '@backstage/core';
import React from 'react';
import { Grid } from '@material-ui/core';
import { FossaApi, fossaApiRef } from '../src/api';
import { FossaCard } from '../src';
import { Entity } from '@backstage/catalog-model';
import { FOSSA_PROJECT_NAME_ANNOTATION } from '../src/components/useProjectName';

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
  .registerPlugin(
    createPlugin({
      id: 'fossa-demo',
      register({ router }) {
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

        const ExamplePage = () => (
          <Page themeId="home">
            <Header title="Fossa" />
            <Content>
              <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('empty')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('error')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('never')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('zero-deps')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('issues')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FossaCard entity={entity('no-issues')} />
                </Grid>
                <Grid item xs={12}>
                  <FossaCard entity={entity(undefined)} />
                </Grid>
              </Grid>
            </Content>
          </Page>
        );

        router.addRoute(
          createRouteRef({ path: '/', title: 'Fossa' }),
          ExamplePage,
        );
      },
    }),
  )
  .render();
