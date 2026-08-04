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
import { PluginHeader } from './PluginHeader';

const fixedNow = new Date('2026-08-03T12:00:00.000Z');

const plugin: PluginData = {
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
      repository: { url: 'https://github.com/example/catalog-insights' },
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

describe('PluginHeader', () => {
  it('renders identity, description, compatibility badges, and resource links', () => {
    render(<PluginHeader plugin={plugin} now={fixedNow} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Catalog Insights',
    );
    expect(
      screen.getByRole('link', { name: 'Example Maintainers' }),
    ).toHaveAttribute('href', 'https://example.com');
    expect(
      screen.getByText('Adds operational context to catalog entities.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'npm 2.4.0' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Backstage 1.50.0' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Documentation/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /npm package/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Repository/ }),
    ).toBeInTheDocument();
  });
});
