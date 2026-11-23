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
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import type { PluginData } from '../../pluginDirectory/plugin';
import { mockUnpkgReadmes } from '../../testUtils/mockUnpkg';
import { getPackagePresentations } from './packagePresentation';
import { PackageWorkspace } from './PackageWorkspace';

function packageSnapshot(
  npmPackageName: string,
  backstageRole: string,
): PackageSnapshot {
  return {
    npmPackageName,
    sourcePath: `plugins/${npmPackageName.split('/').at(-1)}`,
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
    ],
  },
};
const packages = getPackagePresentations(plugin);

function workspace(
  packageIndex: number,
  selectedTab: 'readme' | 'install' | 'configure',
  onSelectTab: (tab: 'readme' | 'install' | 'configure') => void = () => {},
) {
  return (
    <PackageWorkspace
      plugin={plugin}
      packages={packages}
      packagePresentation={packages[packageIndex]}
      selectedTab={selectedTab}
      onSelectPackage={mock.fn()}
      onSelectTab={onSelectTab}
    />
  );
}

describe('PackageWorkspace', () => {
  beforeEach(() => {
    mockUnpkgReadmes(name => `README for ${name}`);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('keeps package identity stable across controlled tabs and package changes', async () => {
    const user = userEvent.setup();
    const onSelectTab =
      mock.fn<(tab: 'readme' | 'install' | 'configure') => void>();
    const { rerender } = render(workspace(0, 'readme', onSelectTab));

    const frontendHeading = screen.getByRole('heading', {
      name: 'Catalog frontend',
    });
    assert.ok(frontendHeading);
    assert.notEqual(document.activeElement, frontendHeading);
    assert.ok(screen.getAllByText('@backstage/plugin-catalog').length > 0);
    assert.ok(screen.getByText('2.0.7'));
    assert.ok(screen.getByText('1.53.1'));
    assert.ok(await screen.findByText('README for @backstage/plugin-catalog'));

    await user.click(screen.getByRole('tab', { name: 'Install' }));
    assert.deepEqual(onSelectTab.mock.calls.at(-1)?.arguments, ['install']);

    rerender(workspace(1, 'readme', onSelectTab));
    const backendHeading = screen.getByRole('heading', {
      name: 'Catalog backend',
    });
    assert.equal(document.activeElement, backendHeading);
    assert.ok(
      await screen.findByText('README for @backstage/plugin-catalog-backend'),
    );

    rerender(workspace(1, 'install', onSelectTab));
    assert.ok(
      screen.getByText(
        'yarn --cwd packages/backend add @backstage/plugin-catalog-backend',
      ),
    );
    assert.ok(
      screen.getByText(
        "backend.add(import('@backstage/plugin-catalog-backend'));",
      ),
    );
  });
});
