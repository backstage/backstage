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
import { fetchPackageConfigSchema } from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigureGuide } from './ConfigureGuide';

jest.mock('../../pluginDirectory/npmRegistryClient');

const mockFetchPackageConfigSchema = fetchPackageConfigSchema as jest.MockedFunction<
  typeof fetchPackageConfigSchema
>;

function packageSnapshot(
  npmPackageName: string,
  internalDependencies?: string[],
): PackageSnapshot {
  return {
    npmPackageName,
    internalDependencies,
    npm: {
      status: 'fresh',
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      checkedAt: '2026-01-01T00:00:00.000Z',
      latestVersion: '1.0.0',
      lastPublishedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

const frontendPackage = packageSnapshot('@example/plugin-example', [
  '@example/plugin-example-common',
]);
const commonPackage = packageSnapshot('@example/plugin-example-common');
const backendPackage = packageSnapshot('@example/plugin-example-backend');
const packages = [frontendPackage, commonPackage, backendPackage];
const primaryNpmPackageName = '@example/plugin-example';

const endpointSchema = {
  type: 'object',
  properties: {
    endpoint: { type: 'string' },
  },
  required: ['endpoint'],
};
const enabledSchema = {
  type: 'object',
  properties: {
    enabled: { type: 'boolean', default: false },
  },
};

describe('ConfigureGuide', () => {
  beforeEach(() => {
    mockFetchPackageConfigSchema.mockReset();
  });

  it('loads only the selected package and its direct internal dependencies', async () => {
    mockFetchPackageConfigSchema.mockImplementation(async npmPackageName => ({
      status: 'ready',
      value:
        npmPackageName === frontendPackage.npmPackageName
          ? endpointSchema
          : enabledSchema,
    }));

    render(
      <ConfigureGuide
        packageSnapshot={frontendPackage}
        packages={packages}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    expect(await screen.findByLabelText(/^endpoint/)).toBeVisible();
    expect(screen.getByLabelText(/^enabled/)).toBeVisible();
    expect(mockFetchPackageConfigSchema).toHaveBeenCalledWith(
      '@example/plugin-example',
      '1.0.0',
    );
    expect(mockFetchPackageConfigSchema).toHaveBeenCalledWith(
      '@example/plugin-example-common',
      '1.0.0',
    );
    expect(mockFetchPackageConfigSchema).not.toHaveBeenCalledWith(
      '@example/plugin-example-backend',
      expect.anything(),
    );
    expect(
      screen.queryByRole('combobox', { name: 'Package' }),
    ).not.toBeInTheDocument();
  });

  it('validates required values before generating copyable YAML', async () => {
    const user = userEvent.setup();
    mockFetchPackageConfigSchema.mockResolvedValue({
      status: 'ready',
      value: endpointSchema,
    });
    render(
      <ConfigureGuide
        packageSnapshot={frontendPackage}
        packages={packages}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    const copyButton = await screen.findByRole('button', {
      name: 'Copy @example/plugin-example generated YAML',
    });
    expect(copyButton).toBeDisabled();
    await user.type(screen.getByLabelText(/^endpoint/), 'https://api.example.com');
    expect(copyButton).toBeEnabled();
    expect(
      screen.getByLabelText('@example/plugin-example generated YAML'),
    ).toHaveTextContent('endpoint: https://api.example.com');
  });

  it('distinguishes an absent schema from a fetch failure', async () => {
    mockFetchPackageConfigSchema.mockResolvedValueOnce({
      status: 'ready',
      value: undefined,
    });
    const { rerender } = render(
      <ConfigureGuide
        packageSnapshot={backendPackage}
        packages={packages}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );
    expect(
      await screen.findByText(
        'This package does not provide a configuration schema.',
      ),
    ).toBeVisible();

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchPackageConfigSchema.mockResolvedValueOnce({
      status: 'error',
      error: new Error('network failure'),
    });
    rerender(
      <ConfigureGuide
        packageSnapshot={frontendPackage}
        packages={[frontendPackage]}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The package configuration could not be loaded.',
    );
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
