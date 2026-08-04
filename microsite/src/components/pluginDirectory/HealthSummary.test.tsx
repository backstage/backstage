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
import { closeTestDom } from './testDom';
import assert from 'node:assert/strict';
import { after, afterEach, describe, it } from 'node:test';
import type { PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { HealthSummary } from './HealthSummary';
import { formatReleaseAge } from './healthPresentation';

const fixedNow = new Date('2026-08-03T12:00:00.000Z');

const freshPlugin: PluginData = {
  title: 'Catalog Insights',
  author: 'Example Maintainers',
  authorUrl: 'https://example.com',
  category: 'Catalog',
  description: 'Adds operational context to catalog entities.',
  documentation: 'https://example.com/catalog-insights/docs',
  npmPackageName: '@example/backstage-plugin-catalog-insights',
  addedDate: '2026-01-20',
  status: 'active',
  capabilities: ['entity-card', 'standalone-page', 'catalog-provider'],
  slug: 'catalog-insights',
  isNew: false,
  snapshot: {
    npm: {
      status: 'fresh',
      checkedAt: '2026-08-03T10:00:00.000Z',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      latestVersion: '2.4.0',
      lastPublishedAt: '2026-07-22T12:00:00.000Z',
      repository: {
        url: 'https://github.com/example/catalog-insights',
      },
    },
    backstage: {
      status: 'fresh',
      checkedAt: '2026-08-03T10:00:00.000Z',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      version: '1.50.0',
      sourceUrl:
        'https://github.com/example/catalog-insights/blob/main/package.json',
      sourcePath: 'package.json',
    },
  },
};

const stalePlugin: PluginData = {
  ...freshPlugin,
  snapshot: {
    npm: {
      ...freshPlugin.snapshot!.npm,
      status: 'stale',
      checkedAt: '2026-07-20T10:00:00.000Z',
      reason: 'npm-timeout',
    },
    backstage: {
      ...freshPlugin.snapshot!.backstage,
      status: 'stale',
      checkedAt: '2026-07-20T10:00:00.000Z',
      reason: 'github-timeout',
    },
  },
};

const unavailablePlugin: PluginData = {
  ...freshPlugin,
  snapshot: {
    npm: {
      status: 'unavailable',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      reason: 'package-not-found',
    },
    backstage: {
      status: 'unavailable',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      reason: 'source-not-found',
    },
  },
};

afterEach(cleanup);
after(closeTestDom);

describe('HealthSummary', () => {
  it('presents fresh package, source, Backstage, and capability details', () => {
    render(<HealthSummary plugin={freshPlugin} now={fixedNow} />);

    const npmVersion = screen.getByRole('link', { name: '2.4.0' });
    assert.equal(
      npmVersion.getAttribute('href'),
      'https://www.npmjs.com/package/@example/backstage-plugin-catalog-insights',
    );
    assert.ok(screen.getByText('Released 12 days ago'));
    assert.equal(
      screen.getByRole('link', { name: 'Source repository' }).getAttribute(
        'href',
      ),
      'https://github.com/example/catalog-insights',
    );

    const backstageVersion = screen.getByRole('link', { name: '1.50.0' });
    assert.equal(
      backstageVersion.getAttribute('href'),
      'https://github.com/example/catalog-insights/blob/main/package.json',
    );
    assert.ok(
      screen.getByText(
        (_content, element) =>
          element?.tagName === 'P' &&
          element.textContent === 'Built with Backstage 1.50.0',
      ),
    );

    assert.ok(screen.getByText('Entity card'));
    assert.ok(screen.getByText('Standalone page'));
    assert.ok(screen.getByText('Catalog provider'));
    assert.equal(screen.queryByText(/Compatible with Backstage/i), null);
  });

  it('renders package health without repository links when npm omits repository metadata', () => {
    const tektonPlugin: PluginData = {
      ...freshPlugin,
      title: 'Tekton Pipelines',
      npmPackageName: '@jquad-group/plugin-tekton-pipelines',
      snapshot: {
        npm: {
          status: 'fresh',
          checkedAt: '2026-08-03T10:00:00.000Z',
          lastAttemptAt: '2026-08-03T10:00:00.000Z',
          latestVersion: '0.3.3',
          lastPublishedAt: '2023-05-07T14:51:25.719Z',
        },
        backstage: {
          status: 'unavailable',
          lastAttemptAt: '2026-08-03T10:00:00.000Z',
          reason: 'repository-unsupported',
        },
      },
    };

    render(<HealthSummary plugin={tektonPlugin} now={fixedNow} />);

    const npmVersion = screen.getByRole('link', { name: '0.3.3' });
    assert.equal(
      npmVersion.getAttribute('href'),
      'https://www.npmjs.com/package/@jquad-group/plugin-tekton-pipelines',
    );
    assert.ok(screen.getByText('Released 3 years ago'));
    assert.equal(
      screen.queryByRole('link', { name: 'Source repository' }),
      null,
    );
    assert.ok(screen.getByText('Current'));
    assert.ok(screen.getByText('Backstage source data is not available.'));
  });

  it('keeps stale verification state explicit and dated', () => {
    render(<HealthSummary plugin={stalePlugin} now={fixedNow} />);

    assert.equal(screen.getAllByText('Stale').length, 2);
    assert.equal(
      screen.getAllByText('Last verified July 20, 2026').length,
      2,
    );
    assert.ok(
      screen.getByText(
        (_content, element) =>
          element?.tagName === 'P' &&
          element.textContent === 'Built with Backstage 1.50.0',
      ),
    );
  });

  it('uses explicit unknown values when audit data is unavailable', () => {
    render(<HealthSummary plugin={unavailablePlugin} now={fixedNow} />);

    assert.equal(screen.getAllByText('Unavailable').length, 2);
    assert.equal(screen.getAllByText('Unknown').length, 2);
    assert.equal(screen.queryByText(/Built with Backstage/i), null);
  });

  it('explains when no capabilities have been declared', () => {
    render(
      <HealthSummary
        plugin={{ ...freshPlugin, capabilities: undefined }}
        now={fixedNow}
      />,
    );

    assert.ok(
      screen.getByText('No capabilities declared in the plugin manifest.'),
    );
    assert.equal(screen.queryByRole('list', { name: 'Capabilities' }), null);
  });
});

describe('formatReleaseAge', () => {
  it('uses deterministic day, month, and year thresholds', () => {
    assert.equal(
      formatReleaseAge('2026-08-02T12:00:00.000Z', fixedNow),
      '1 day ago',
    );
    assert.equal(
      formatReleaseAge('2026-07-05T12:00:00.000Z', fixedNow),
      '29 days ago',
    );
    assert.equal(
      formatReleaseAge('2026-07-04T12:00:00.000Z', fixedNow),
      '1 month ago',
    );
    assert.equal(
      formatReleaseAge('2025-08-03T12:00:00.000Z', fixedNow),
      '1 year ago',
    );
    assert.equal(
      formatReleaseAge('2024-08-03T12:00:00.000Z', fixedNow),
      '2 years ago',
    );
  });
});
