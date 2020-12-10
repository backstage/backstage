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
import {
  Content,
  createPlugin,
  createRouteRef,
  Header,
  Page,
} from '@backstage/core';
import { createDevApp } from '@backstage/dev-utils';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  MockSentryApi,
  SentryApi,
  sentryApiRef,
  SentryIssuesWidget,
} from '../src';
import { SENTRY_PROJECT_SLUG_ANNOTATION } from '../src/components/useProjectSlug';

createDevApp()
  .registerApi({
    api: sentryApiRef,
    deps: {},
    factory: () =>
      ({
        fetchIssues: async (project: string) => {
          switch (project) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'with-values':
              return new MockSentryApi().fetchIssues();

            default:
              return [];
          }
        },
      } as SentryApi),
  })
  .registerPlugin(
    createPlugin({
      id: 'sentry-demo',
      register({ router }) {
        const entity = (name?: string) =>
          ({
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              annotations: {
                [SENTRY_PROJECT_SLUG_ANNOTATION]: name,
              },
              name: name,
            },
          } as Entity);

        const ExamplePage = () => (
          <Page themeId="home">
            <Header title="Sentry" />
            <Content>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <SentryIssuesWidget entity={entity('error')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SentryIssuesWidget entity={entity('empty')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SentryIssuesWidget entity={entity('never')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SentryIssuesWidget entity={entity('with-values')} />
                </Grid>
                <Grid item xs={12}>
                  <SentryIssuesWidget entity={entity(undefined)} />
                </Grid>
              </Grid>
            </Content>
          </Page>
        );

        router.addRoute(
          createRouteRef({ path: '/', title: 'Sentry' }),
          ExamplePage,
        );
      },
    }),
  )
  .render();
