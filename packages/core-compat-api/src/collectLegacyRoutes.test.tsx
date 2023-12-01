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

import { FlatRoutes } from '@backstage/core-app-api';
import { PuppetDbPage } from '@backstage/plugin-puppetdb';
import { StackstormPage } from '@backstage/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import React from 'react';
import { Route } from 'react-router-dom';

import { collectLegacyRoutes } from './collectLegacyRoutes';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalBackstagePlugin } from '../../frontend-plugin-api/src/wiring/createPlugin';

describe('collectLegacyRoutes', () => {
  it('should collect legacy routes', () => {
    const collected = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/score-board" element={<ScoreBoardPage />} />
        <Route path="/stackstorm" element={<StackstormPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
      </FlatRoutes>,
    );

    expect(
      collected.map(p => ({
        id: p.id,
        extensions: toInternalBackstagePlugin(p).extensions.map(e => ({
          id: e.id,
          attachTo: e.attachTo,
          disabled: e.disabled,
          defaultConfig: e.configSchema?.parse({}),
        })),
      })),
    ).toEqual([
      {
        id: 'score-card',
        extensions: [
          {
            id: 'page:score-card',
            attachTo: { id: 'core/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'score-board' },
          },
          {
            id: 'api:plugin.scoringdata.service',
            attachTo: { id: 'core', input: 'apis' },
            disabled: false,
          },
        ],
      },
      {
        id: 'stackstorm',
        extensions: [
          {
            id: 'page:stackstorm',
            attachTo: { id: 'core/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'stackstorm' },
          },
          {
            id: 'api:plugin.stackstorm.service',
            attachTo: { id: 'core', input: 'apis' },
            disabled: false,
          },
        ],
      },
      {
        id: 'puppetDb',
        extensions: [
          {
            id: 'page:puppetDb',
            attachTo: { id: 'core/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'puppetdb' },
          },
          {
            id: 'page:puppetDb/2',
            attachTo: { id: 'core/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'puppetdb' },
          },
          {
            id: 'api:plugin.puppetdb.service',
            attachTo: { id: 'core', input: 'apis' },
            disabled: false,
          },
        ],
      },
    ]);
  });
});
