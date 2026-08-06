/*
 * Copyright 2026 The Backstage Authors
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
import './testDom';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PackageSnapshot, PluginData } from '../../pluginDirectory/manifest';
import {
  getPackagePresentations,
  getPluginDecisionSummary,
} from './packagePresentation';

function packageSnapshot(
  npmPackageName: string,
  backstageRole?: string,
): PackageSnapshot {
  return {
    npmPackageName,
    npm: {
      status: 'fresh',
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      checkedAt: '2026-08-03T12:00:00.000Z',
      latestVersion: '2.0.7',
      lastPublishedAt: '2026-07-14T00:00:00.000Z',
      backstageRole,
    },
  };
}

const plugin: PluginData = {
  title: 'Backstage Software Catalog',
  author: 'Spotify',
  authorUrl: 'https://spotify.com',
  category: 'Core',
  description: 'Manage software components.',
  documentation: 'https://backstage.io/docs/features/software-catalog/',
  npmPackageName: '@backstage/plugin-catalog',
  addedDate: '2020-01-01',
  status: 'active',
  slug: 'backstage-software-catalog',
  isNew: false,
  capabilities: ['catalog-provider', 'entity-content'],
  snapshot: {
    backstage: {
      status: 'fresh',
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      checkedAt: '2026-08-03T12:00:00.000Z',
      version: '1.53.1',
      sourceUrl: 'https://github.com/backstage/backstage',
      sourcePath: '.',
    },
    packages: [
      packageSnapshot('@backstage/plugin-catalog', 'frontend-plugin'),
      packageSnapshot('@backstage/plugin-catalog-backend', 'backend-plugin'),
      packageSnapshot(
        '@backstage/plugin-catalog-backend-module-github',
        'backend-plugin-module',
      ),
      packageSnapshot('@backstage/plugin-catalog-react', 'web-library'),
    ],
  },
};

describe('getPackagePresentations', () => {
  it('groups and labels packages in a stable purpose-first order', () => {
    const presentations = getPackagePresentations(plugin);

    assert.deepEqual(
      presentations.map(({ label, groupLabel }) => ({ label, groupLabel })),
      [
        { label: 'Catalog frontend', groupLabel: 'Core experiences' },
        { label: 'Catalog backend', groupLabel: 'Core experiences' },
        { label: 'GitHub module', groupLabel: 'Extension modules' },
        { label: 'Catalog React', groupLabel: 'Shared libraries' },
      ],
    );
  });
});

describe('getPluginDecisionSummary', () => {
  it('presents release, Backstage source, and evidence-backed functionality', () => {
    assert.deepEqual(
      getPluginDecisionSummary(
        plugin,
        '1.53.1',
        new Date('2026-08-06T00:00:00.000Z'),
      ),
      {
        release: { status: 'fresh', version: '2.0.7', age: '23 days ago' },
        backstage: {
          status: 'fresh',
          version: '1.53.1',
          versionsBehind: 0,
        },
        functionality: [
          'Browse and inspect catalog entities',
          'Ingest metadata through providers and processors',
          'Extend catalog pages and entity experiences',
        ],
      },
    );
  });

  it('uses the authored description when capability metadata is unavailable', () => {
    const pluginWithoutSnapshot: PluginData = {
      ...plugin,
      capabilities: undefined,
      snapshot: undefined,
    };

    assert.deepEqual(getPluginDecisionSummary(pluginWithoutSnapshot, null), {
      release: { status: 'unavailable' },
      backstage: { status: 'unavailable' },
      functionality: ['Manage software components.'],
    });
  });
});
