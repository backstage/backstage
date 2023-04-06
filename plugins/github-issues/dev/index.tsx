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
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { githubIssuesPlugin, GithubIssuesPage } from '../src';
import { GithubIssuesApi, githubIssuesApiRef } from '../src/api';

import testData from './__fixtures__/component-issues-data.json';

createDevApp()
  .registerPlugin(githubIssuesPlugin)
  .registerApi({
    api: githubIssuesApiRef,
    deps: {},
    factory: () =>
      ({
        fetchIssuesByRepoFromGithub: async () => testData,
      } as GithubIssuesApi),
  })
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      ({
        getEntities: () => ({}),
      } as CatalogApi),
  })
  .addPage({
    title: 'Component Issues',
    element: (
      <EntityProvider
        entity={{
          metadata: {
            annotations: {
              'github.com/project-slug': 'backstage/backstage',
            },
            name: 'backstage',
          },
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
        }}
      >
        <GithubIssuesPage />
      </EntityProvider>
    ),
  })
  .render();
