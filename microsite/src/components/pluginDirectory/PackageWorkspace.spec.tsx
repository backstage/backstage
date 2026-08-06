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
import { fetchPackageReadme } from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPackagePresentations } from './packagePresentation';
import { PackageWorkspace } from './PackageWorkspace';

jest.mock('../../pluginDirectory/npmRegistryClient');
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}));

const mockFetchPackageReadme = fetchPackageReadme as jest.MockedFunction<
  typeof fetchPackageReadme
>;

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
  onSelectTab = jest.fn(),
) {
  return (
    <PackageWorkspace
      plugin={plugin}
      packages={packages}
      packagePresentation={packages[packageIndex]}
      selectedTab={selectedTab}
      onSelectPackage={jest.fn()}
      onSelectTab={onSelectTab}
    />
  );
}

describe('PackageWorkspace', () => {
  beforeEach(() => {
    mockFetchPackageReadme.mockReset();
    mockFetchPackageReadme.mockImplementation(async npmPackageName => ({
      status: 'ready',
      value: `README for ${npmPackageName}`,
    }));
  });

  it('keeps package identity stable across controlled tabs and package changes', async () => {
    const user = userEvent.setup();
    const onSelectTab = jest.fn();
    const { rerender } = render(workspace(0, 'readme', onSelectTab));

    const frontendHeading = screen.getByRole('heading', {
      name: 'Catalog frontend',
    });
    expect(frontendHeading).toBeVisible();
    expect(frontendHeading).not.toHaveFocus();
    expect(screen.getAllByText('@backstage/plugin-catalog').length).toBeGreaterThan(0);
    expect(screen.getByText('2.0.7')).toBeVisible();
    expect(screen.getByText('Built with Backstage 1.53.1')).toBeVisible();
    expect(
      await screen.findByText('README for @backstage/plugin-catalog'),
    ).toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'Install' }));
    expect(onSelectTab).toHaveBeenCalledWith('install');

    rerender(workspace(1, 'readme', onSelectTab));
    const backendHeading = screen.getByRole('heading', {
      name: 'Catalog backend',
    });
    expect(backendHeading).toHaveFocus();
    expect(
      await screen.findByText('README for @backstage/plugin-catalog-backend'),
    ).toBeVisible();

    rerender(workspace(1, 'install', onSelectTab));
    expect(
      screen.getByText('yarn add @backstage/plugin-catalog-backend'),
    ).toBeVisible();
    expect(
      screen.getByText(
        "backend.add(import('@backstage/plugin-catalog-backend'));",
      ),
    ).toBeVisible();
  });
});
