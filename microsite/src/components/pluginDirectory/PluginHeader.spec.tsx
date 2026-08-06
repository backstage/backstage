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
    backstage: {
      status: 'fresh',
      checkedAt: '2026-08-03T10:00:00.000Z',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      version: '1.50.0',
      sourceUrl:
        'https://github.com/example/catalog-insights/blob/main/package.json',
      sourcePath: 'package.json',
    },
    packages: [
      {
        npmPackageName: '@example/backstage-plugin-catalog-insights',
        npm: {
          status: 'fresh',
          checkedAt: '2026-08-03T10:00:00.000Z',
          lastAttemptAt: '2026-08-03T10:00:00.000Z',
          latestVersion: '2.4.0',
          lastPublishedAt: '2026-07-22T12:00:00.000Z',
          repository: { url: 'https://github.com/example/catalog-insights' },
        },
      },
    ],
  },
};

describe('PluginHeader', () => {
  it('renders identity, description, evaluation facts, and resource links', () => {
    render(
      <PluginHeader
        plugin={plugin}
        latestBackstageVersion="1.53.1"
        now={new Date('2026-08-06T00:00:00.000Z')}
      />,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Catalog Insights');
    expect(heading).not.toHaveTextContent('built with Backstage');
    expect(
      screen.getByRole('link', { name: 'Example Maintainers' }),
    ).toHaveAttribute('href', 'https://example.com');
    expect(
      screen.getByText('Adds operational context to catalog entities.'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Plugin evaluation summary'),
    ).toHaveTextContent(
      'Last updated2.4.014 days agoCurrent releaseBackstage sourceBuilt with Backstage 1.50.03 minor releases behindFunctionality1 adoption outcomes reported',
    );
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
