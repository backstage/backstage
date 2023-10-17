/*
 * Copyright 2023 The Backstage Authors
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
import { FlatRoutes } from '@backstage/core-app-api';
import { createPageExtension } from '@backstage/frontend-plugin-api';
import { PuppetDbPage } from '@backstage/plugin-puppetdb';
import { StackstormPage } from '@backstage/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import { Route } from 'react-router-dom';

import { getComponentData } from '@backstage/core-plugin-api';
import { collectLegacyRoutes } from './collectLegacyRoutes';

jest.mock('@backstage/frontend-plugin-api', () => ({
  ...jest.requireActual('@backstage/frontend-plugin-api'),
  createPageExtension: opts => opts,
}));

describe('collectLegacyRoutes', () => {
  it('should collect legacy routes', () => {
    const collected = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/score-board" element={<ScoreBoardPage />} />
        <Route path="/stackstorm" element={<StackstormPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
      </FlatRoutes>,
    );

    expect(collected).toEqual([
      createPageExtension({
        id: 'plugin.score-card.page',
        defaultPath: 'score-board',
        routeRef: getComponentData(<ScoreBoardPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      createPageExtension({
        id: 'plugin.stackstorm.page',
        defaultPath: 'stackstorm',
        routeRef: getComponentData(<StackstormPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      createPageExtension({
        id: 'plugin.puppetDb.page',
        defaultPath: 'puppetdb',
        routeRef: getComponentData(<PuppetDbPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      // ??????????????
    ]);
  });
});
