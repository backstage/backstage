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
import { fetchPackageReadme } from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PackageReadme } from './PackageReadme';

jest.mock('../../pluginDirectory/npmRegistryClient');
// react-markdown's markdown parsing is upstream's responsibility, not this
// feature's; its ESM-only dependency tree also breaks this package's
// swc/jest transformIgnorePatterns, so stub it with a plain passthrough.
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}));

const mockFetchPackageReadme = fetchPackageReadme as jest.MockedFunction<
  typeof fetchPackageReadme
>;

function npmSnapshot(version = '1.0.0') {
  return {
    status: 'fresh' as const,
    lastAttemptAt: '2026-01-01T00:00:00.000Z',
    checkedAt: '2026-01-01T00:00:00.000Z',
    latestVersion: version,
    lastPublishedAt: '2026-01-01T00:00:00.000Z',
  };
}

const plugin: PluginData = {
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
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      reason: 'repository-unsupported',
    },
    packages: [
      { npmPackageName: '@example/plugin-example', npm: npmSnapshot() },
    ],
  },
};

describe('PackageReadme', () => {
  beforeEach(() => {
    mockFetchPackageReadme.mockReset();
  });

  it('renders the fetched README content', async () => {
    mockFetchPackageReadme.mockResolvedValue({
      status: 'ready',
      value: '# Hello\n\nSome bold text.',
    });

    render(<PackageReadme plugin={plugin} />);

    expect(await screen.findByText(/Hello/)).toBeInTheDocument();
    expect(mockFetchPackageReadme).toHaveBeenCalledWith(
      '@example/plugin-example',
      '1.0.0',
    );
  });

  it('shows a fallback message when npm has no README', async () => {
    mockFetchPackageReadme.mockResolvedValue({
      status: 'ready',
      value: undefined,
    });

    render(<PackageReadme plugin={plugin} />);

    expect(
      await screen.findByText('No README available for this package.'),
    ).toBeInTheDocument();
  });

  it('shows a distinct error message when the fetch fails', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockFetchPackageReadme.mockResolvedValue({
      status: 'error',
      error: new Error('boom'),
    });

    render(<PackageReadme plugin={plugin} />);

    expect(
      await screen.findByText("Couldn't load this package's README."),
    ).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it('shows the unavailable message without fetching when no npm version is known', () => {
    render(
      <PackageReadme
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/plugin-example',
                npm: {
                  status: 'unavailable',
                  lastAttemptAt: '2026-01-01T00:00:00.000Z',
                  reason: 'npm-not-found',
                },
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByText('No README available for this package.'),
    ).toBeInTheDocument();
    expect(mockFetchPackageReadme).not.toHaveBeenCalled();
  });

  it('renders a package selector and refetches when the selection changes', async () => {
    const user = userEvent.setup();
    mockFetchPackageReadme.mockImplementation(async npmPackageName => ({
      status: 'ready',
      value: `README for ${npmPackageName}`,
    }));

    render(
      <PackageReadme
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              plugin.snapshot!.packages[0],
              {
                npmPackageName: '@example/plugin-example-backend',
                npm: npmSnapshot(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      await screen.findByText('README for @example/plugin-example'),
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      '@example/plugin-example-backend',
    );

    expect(
      await screen.findByText('README for @example/plugin-example-backend'),
    ).toBeInTheDocument();
  });
});
