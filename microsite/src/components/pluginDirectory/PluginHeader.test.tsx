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
import type { PluginData } from '../../pluginDirectory/plugin';
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
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
  it('renders identity, description, and the supported Backstage version', () => {
    const { rerender } = render(
      <PluginHeader plugin={plugin} latestBackstageVersion="1.53.1" />,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    assert.ok(heading.textContent?.includes('Catalog Insights'));
    assert.ok(!heading.textContent?.includes('built with Backstage'));
    assert.equal(
      screen
        .getByRole('link', { name: 'Example Maintainers' })
        .getAttribute('href'),
      'https://example.com',
    );
    assert.ok(
      screen.getByText('Adds operational context to catalog entities.'),
    );
    // The npm release and the age of the check are not part of the header.
    const summary = screen.getByLabelText('Plugin summary');
    assert.ok(
      summary.textContent?.includes(
        'Supported Backstage versionv1.50.0(3 versions behind)LinksDocs ↗',
      ),
    );
    assert.ok(!summary.textContent?.includes('2.4.0'));
    assert.ok(!summary.textContent?.includes('ago'));
    const docs = screen.getByRole('link', { name: /Docs/ });
    assert.equal(
      docs.getAttribute('href'),
      'https://example.com/catalog-insights/docs',
    );
    assert.equal(docs.getAttribute('target'), '_blank');
    assert.equal(docs.getAttribute('rel'), 'noopener noreferrer');

    rerender(<PluginHeader plugin={plugin} latestBackstageVersion="1.50.4" />);
    assert.ok(summary.textContent?.includes('v1.50.0(up to date)'));

    rerender(<PluginHeader plugin={plugin} latestBackstageVersion="1.51.0" />);
    assert.ok(summary.textContent?.includes('v1.50.0(1 version behind)'));

    rerender(<PluginHeader plugin={plugin} latestBackstageVersion={null} />);
    assert.ok(
      summary.textContent?.includes(
        'Supported Backstage versionv1.50.0LinksDocs ↗',
      ),
    );
  });

  it('reports when the supported Backstage version is not known', () => {
    render(
      <PluginHeader
        plugin={{ ...plugin, snapshot: undefined }}
        latestBackstageVersion="1.53.1"
      />,
    );

    assert.ok(
      screen
        .getByLabelText('Plugin summary')
        .textContent?.includes(
          'Supported Backstage versionBackstage source not reportedLinksDocs ↗',
        ),
    );
  });
});
