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
import { SonarQubeCard } from '../src';
import { FindingSummary, SonarQubeApi, sonarQubeApiRef } from '../src/api';
import { SONARQUBE_PROJECT_KEY_ANNOTATION } from '../src/components/useProjectKey';

createDevApp()
  .registerApi({
    api: sonarQubeApiRef,
    deps: {},
    factory: () =>
      ({
        getFindingSummary: async componentKey => {
          switch (componentKey) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'not-computed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  bugs: '0',
                  reliability_rating: '1.0',
                  vulnerabilities: '0',
                  security_rating: '1.0',
                  code_smells: '0',
                  sqale_rating: '1.0',
                  coverage: '0.0',
                  duplicated_lines_density: '0.0',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
              } as FindingSummary;

            case 'failed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  alert_status: 'FAILED',
                  bugs: '4',
                  reliability_rating: '2.0',
                  vulnerabilities: '18',
                  security_rating: '3.0',
                  code_smells: '22',
                  sqale_rating: '5.0',
                  coverage: '15.7',
                  duplicated_lines_density: '15.6',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
              } as FindingSummary;

            case 'passed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  alert_status: 'OK',
                  bugs: '0',
                  reliability_rating: '1.0',
                  vulnerabilities: '0',
                  security_rating: '1.0',
                  code_smells: '0',
                  sqale_rating: '1.0',
                  coverage: '100.0',
                  duplicated_lines_density: '0.0',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
              } as FindingSummary;

            default:
              return undefined;
          }
        },
      } as SonarQubeApi),
  })
  .registerPlugin(
    createPlugin({
      id: 'defectdojo-demo',
      register({ router }) {
        const entity = (name?: string) =>
          ({
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              annotations: {
                [SONARQUBE_PROJECT_KEY_ANNOTATION]: name,
              },
              name: name,
            },
          } as Entity);

        const ExamplePage = () => (
          <Page themeId="home">
            <Header title="SonarQube" />
            <Content>
              <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('empty')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('error')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('never')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('not-computed')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('failed')} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SonarQubeCard entity={entity('passed')} />
                </Grid>
                <Grid item xs={12}>
                  <SonarQubeCard entity={entity(undefined)} />
                </Grid>
              </Grid>
            </Content>
          </Page>
        );

        router.addRoute(
          createRouteRef({ path: '/', title: 'SonarQube' }),
          ExamplePage,
        );
      },
    }),
  )
  .render();
