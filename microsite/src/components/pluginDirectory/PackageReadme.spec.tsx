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
import type { PackageSnapshot } from '../../pluginDirectory/manifest';
import { fetchPackageReadme } from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PackageReadme } from './PackageReadme';

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
  version = '1.0.0',
): PackageSnapshot {
  return {
    npmPackageName,
    npm: {
      status: 'fresh',
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      checkedAt: '2026-01-01T00:00:00.000Z',
      latestVersion: version,
      lastPublishedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

const frontendPackage = packageSnapshot('@example/plugin-example');
const backendPackage = packageSnapshot('@example/plugin-example-backend', '2.0.0');

describe('PackageReadme', () => {
  beforeEach(() => {
    mockFetchPackageReadme.mockReset();
  });

  it('loads only the supplied package and follows it across rerenders', async () => {
    mockFetchPackageReadme.mockImplementation(async npmPackageName => ({
      status: 'ready',
      value: `README for ${npmPackageName}`,
    }));

    const { rerender } = render(
      <PackageReadme packageSnapshot={frontendPackage} />,
    );
    expect(
      await screen.findByText('README for @example/plugin-example'),
    ).toBeInTheDocument();
    expect(mockFetchPackageReadme).toHaveBeenCalledWith(
      '@example/plugin-example',
      '1.0.0',
    );

    rerender(<PackageReadme packageSnapshot={backendPackage} />);
    expect(
      await screen.findByText('README for @example/plugin-example-backend'),
    ).toBeInTheDocument();
    expect(mockFetchPackageReadme).toHaveBeenLastCalledWith(
      '@example/plugin-example-backend',
      '2.0.0',
    );
    expect(
      screen.queryByRole('combobox', { name: 'Package' }),
    ).not.toBeInTheDocument();
  });

  it('distinguishes absent, unavailable, and failed README data', async () => {
    mockFetchPackageReadme.mockResolvedValueOnce({
      status: 'ready',
      value: undefined,
    });
    const { rerender } = render(
      <PackageReadme packageSnapshot={frontendPackage} />,
    );
    expect(
      await screen.findByText('No README is available for this package.'),
    ).toBeInTheDocument();

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchPackageReadme.mockResolvedValueOnce({
      status: 'error',
      error: new Error('boom'),
    });
    rerender(<PackageReadme packageSnapshot={backendPackage} />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The package README could not be loaded.',
    );
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();

    mockFetchPackageReadme.mockClear();
    const unavailablePackage: PackageSnapshot = {
      npmPackageName: '@example/plugin-unavailable',
      npm: {
        status: 'unavailable',
        lastAttemptAt: '2026-01-01T00:00:00.000Z',
        reason: 'npm-not-found',
      },
    };
    rerender(<PackageReadme packageSnapshot={unavailablePackage} />);
    expect(
      screen.getByText('No README is available for this package.'),
    ).toBeInTheDocument();
    expect(mockFetchPackageReadme).not.toHaveBeenCalled();
  });
});
