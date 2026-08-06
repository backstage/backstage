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
import userEvent from '@testing-library/user-event';
import { PluginOverview } from './PluginOverview';

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

describe('PluginOverview', () => {
  it('answers adoption questions and opens a selected package', async () => {
    const user = userEvent.setup();
    const onSelectPackage = jest.fn();
    render(
      <PluginOverview
        plugin={plugin}
        latestBackstageVersion="1.53.1"
        now={new Date('2026-08-06T00:00:00Z')}
        onSelectPackage={onSelectPackage}
      />,
    );

    expect(
      screen.getByLabelText('Plugin evaluation summary'),
    ).toBeVisible();
    expect(screen.getByText('23 days ago')).toBeVisible();
    expect(screen.getAllByText('2.0.7').length).toBeGreaterThan(0);
    expect(screen.getByText('Built with Backstage 1.53.1')).toBeVisible();
    expect(screen.getByText('Current release')).toBeVisible();
    expect(
      screen.getByText('Browse and inspect catalog entities'),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'README' }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Catalog frontend.*@backstage\/plugin-catalog/,
      }),
    );
    expect(onSelectPackage).toHaveBeenCalledWith('@backstage/plugin-catalog');
    expect(
      screen.getByRole('heading', { name: 'Core experiences' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Extension modules' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Shared libraries' }),
    ).toBeVisible();
  });

  it('reports unavailable evidence without inventing functionality', () => {
    render(
      <PluginOverview
        plugin={{ ...plugin, capabilities: undefined, snapshot: undefined }}
        latestBackstageVersion={null}
        onSelectPackage={jest.fn()}
      />,
    );

    expect(screen.getAllByText('Not reported')).toHaveLength(3);
    expect(screen.getByText('No package details reported.')).toBeVisible();
    expect(
      screen.queryByText('Browse and inspect catalog entities'),
    ).not.toBeInTheDocument();
  });
});
