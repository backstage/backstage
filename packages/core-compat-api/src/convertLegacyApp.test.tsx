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

import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { PuppetDbPage } from '@backstage/plugin-puppetdb';
import { StackstormPage } from '@backstage/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { convertLegacyApp } from './convertLegacyApp';

const Root = ({ children }: { children: ReactNode }) => <>{children}</>;

describe('convertLegacyApp', () => {
  it('should find and extract root and routes', () => {
    const collected = convertLegacyApp(
      <>
        <div />
        <span />
        <AppRouter>
          <div />
          <Root>
            <FlatRoutes>
              <Route path="/score-board" element={<ScoreBoardPage />} />
              <Route path="/stackstorm" element={<StackstormPage />} />
              <Route path="/puppetdb" element={<PuppetDbPage />} />
              <Route path="/puppetdb" element={<PuppetDbPage />} />
            </FlatRoutes>
          </Root>
        </AppRouter>
      </>,
    );

    expect(
      collected.map((p: any /* TODO */) => ({
        id: p.id,
        extensions: p.extensions.map((e: any) => ({
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
            id: 'page:puppetDb/1',
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
      {
        id: undefined,
        extensions: [
          {
            id: 'core/layout',
            attachTo: { id: 'core', input: 'root' },
            disabled: false,
          },
          {
            id: 'core/nav',
            attachTo: { id: 'core/layout', input: 'nav' },
            disabled: true,
          },
        ],
      },
    ]);
  });
});
