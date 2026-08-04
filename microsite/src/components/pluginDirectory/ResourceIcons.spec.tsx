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
import type { PackageSnapshot, PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourceIcons } from './ResourceIcons';

const basePackageSnapshot: PackageSnapshot = {
  npmPackageName: '@example/plugin-example',
  npm: {
    status: 'fresh',
    checkedAt: '2026-08-03T10:00:00.000Z',
    lastAttemptAt: '2026-08-03T10:00:00.000Z',
    latestVersion: '2.4.0',
    lastPublishedAt: '2026-07-22T12:00:00.000Z',
  },
  configSchema: {
    status: 'unavailable',
    lastAttemptAt: '2026-08-03T10:00:00.000Z',
    reason: 'npm-data-unavailable',
  },
};

const basePlugin: PluginData = {
  title: 'Example Plugin',
  author: 'Example Maintainers',
  authorUrl: 'https://example.com',
  category: 'Tooling',
  description: 'Adds example features to Backstage.',
  documentation: 'https://example.com/docs',
  npmPackageName: '@example/plugin-example',
  addedDate: '2026-01-20',
  status: 'active',
  slug: 'example-plugin',
  isNew: false,
  snapshot: {
    backstage: {
      status: 'unavailable',
      lastAttemptAt: '2026-08-03T10:00:00.000Z',
      reason: 'source-not-found',
    },
    packages: [basePackageSnapshot],
  },
};

describe('ResourceIcons', () => {
  it('always links documentation and the npm package', () => {
    render(<ResourceIcons plugin={basePlugin} />);

    expect(screen.getByRole('link', { name: /Documentation/ })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    );
    expect(screen.getByRole('link', { name: /npm package/ })).toHaveAttribute(
      'href',
      'https://www.npmjs.com/package/@example/plugin-example',
    );
    expect(
      screen.queryByRole('link', { name: /Repository/ }),
    ).not.toBeInTheDocument();
  });

  it('links the repository when npm metadata resolves one', () => {
    render(
      <ResourceIcons
        plugin={{
          ...basePlugin,
          snapshot: {
            ...basePlugin.snapshot,
            packages: [
              {
                ...basePackageSnapshot,
                npm: {
                  status: 'fresh',
                  checkedAt: '2026-08-03T10:00:00.000Z',
                  lastAttemptAt: '2026-08-03T10:00:00.000Z',
                  latestVersion: '2.4.0',
                  lastPublishedAt: '2026-07-22T12:00:00.000Z',
                  repository: {
                    url: 'https://github.com/example/plugin-example',
                  },
                },
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getByRole('link', { name: /Repository/ })).toHaveAttribute(
      'href',
      'https://github.com/example/plugin-example',
    );
  });

  it('omits the repository link when npm metadata is unavailable', () => {
    render(
      <ResourceIcons
        plugin={{
          ...basePlugin,
          snapshot: {
            ...basePlugin.snapshot,
            packages: [
              {
                ...basePackageSnapshot,
                npm: {
                  status: 'unavailable',
                  lastAttemptAt: '2026-08-03T10:00:00.000Z',
                  reason: 'package-not-found',
                },
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.queryByRole('link', { name: /Repository/ }),
    ).not.toBeInTheDocument();
  });
});
