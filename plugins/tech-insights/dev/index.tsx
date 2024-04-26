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
  techInsightsPlugin,
  EntityTechInsightsScorecardContent,
  techInsightsApiRef,
  TechInsightsApi,
  Check,
} from '../src';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { checkResultRenderers, runChecksResponse } from './mocks';

const entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'random-name',
  },
} as Entity;

createDevApp()
  .registerPlugin(techInsightsPlugin)
  .registerApi({
    api: techInsightsApiRef,
    deps: {},
    factory: () =>
      ({
        getCheckResultRenderers: (_: string[]) => checkResultRenderers,
        getAllChecks: async () => [],
        runChecks: async (_: CompoundEntityRef, __?: string[]) =>
          runChecksResponse,
        runBulkChecks: async (_: CompoundEntityRef[], __?: Check[]) =>
          '' as any,
        getFacts: async (_: CompoundEntityRef, __: string[]) => '' as any,
        getFactSchemas: async () => [],
      } as TechInsightsApi),
  })
  .addPage({
    element: (
      <EntityProvider entity={entity}>
        <EntityTechInsightsScorecardContent title="Test scorecard" />
      </EntityProvider>
    ),
    title: 'Root Page',
    path: '/tech-insight-scorecard',
  })
  .render();
