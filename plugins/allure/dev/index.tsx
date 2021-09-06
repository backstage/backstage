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
import { createDevApp } from '@backstage/dev-utils';
import { EntityAllureReportContent } from '../src/plugin';
import { Content, Header, Page } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

import exampleEntity from './example-entity.yaml';
import { allureApiRef } from '../src/api';

createDevApp()
  .registerApi({
    api: allureApiRef,
    deps: {},
    factory: () =>
      ({
        async getReportUrl(projectId: string) {
          return Promise.resolve(
            // Follow the instructions from https://github.com/fescobar/allure-docker-service-ui
            // to setup Allure service locally
            `http://localhost:5050/allure-docker-service/projects/${projectId}/reports/latest/index.html`,
          );
        },
      } as unknown as typeof allureApiRef.T),
  })
  .addPage({
    element: (
      <Page themeId="home">
        <Header title="Allure Report" />
        <Content>
          <EntityProvider entity={exampleEntity as any as Entity}>
            <EntityAllureReportContent />
          </EntityProvider>
        </Content>
      </Page>
    ),
    title: 'Allure Report',
    path: '/allure',
  })
  .render();
