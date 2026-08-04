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
import type { PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CompatibilityBadges } from './CompatibilityBadges';

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

describe('CompatibilityBadges', () => {
  it('links each fresh badge to its source and shows release age as a tooltip', () => {
    render(<CompatibilityBadges plugin={freshPlugin} now={fixedNow} />);

    const npmBadge = screen.getByRole('link', { name: 'npm 2.4.0' });
    expect(npmBadge).toHaveAttribute(
      'href',
      'https://www.npmjs.com/package/@example/backstage-plugin-catalog-insights',
    );
    expect(npmBadge).toHaveAttribute('title', 'Released 12 days ago');

    const backstageBadge = screen.getByRole('link', {
      name: 'Backstage 1.50.0',
    });
    expect(backstageBadge).toHaveAttribute(
      'href',
      'https://github.com/example/catalog-insights/blob/main/package.json',
    );
  });

  it('renders unavailable badges as non-linking text', () => {
    render(<CompatibilityBadges plugin={unavailablePlugin} now={fixedNow} />);

    expect(screen.getByText('npm Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Backstage Unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /npm/ })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Backstage/ }),
    ).not.toBeInTheDocument();
  });
});
