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
// eslint-disable-next-line import/no-extraneous-dependencies
import { createDevApp, EntityGridItem } from '@backstage/dev-utils';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  EntityCodeClimateCard,
  MockCodeClimateApi,
  CodeClimateApi,
  codeClimateApiRef,
} from '../src';
import { CODECLIMATE_REPO_ID_ANNOTATION } from '../src/plugin';
import { Content, Header, Page } from '@backstage/core-components';

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [CODECLIMATE_REPO_ID_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: codeClimateApiRef,
    deps: {},
    factory: () =>
      ({
        fetchData: async (repoID: string) => {
          switch (repoID) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'no-values':
              return undefined;

            case 'with-values':
              return new MockCodeClimateApi().fetchData();

            default:
              return [];
          }
        },
      } as CodeClimateApi),
  })
  .addPage({
    title: 'Cards',
    element: (
      <Page themeId="home">
        <Header title="Code Climate" />
        <Content>
          <Grid container>
            <EntityGridItem xs={12} md={6} entity={entity('error')}>
              <EntityCodeClimateCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('never')}>
              <EntityCodeClimateCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('no-values')}>
              <EntityCodeClimateCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('with-values')}>
              <EntityCodeClimateCard />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();
