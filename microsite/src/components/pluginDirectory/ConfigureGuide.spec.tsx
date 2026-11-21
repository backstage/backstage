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
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigureGuide } from './ConfigureGuide';

function packageSnapshot(
  npmPackageName: string,
  options: {
    internalDependencies?: string[];
    configSchema?: Record<string, unknown>;
  } = {},
): PackageSnapshot {
  return {
    npmPackageName,
    ...options,
    npm: {
      status: 'fresh',
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      checkedAt: '2026-01-01T00:00:00.000Z',
      latestVersion: '1.0.0',
      lastPublishedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

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
const backendSchema = {
  type: 'object',
  properties: {
    backendOnly: { type: 'string' },
  },
};

const frontendPackage = packageSnapshot('@example/plugin-example', {
  internalDependencies: ['@example/plugin-example-common'],
  configSchema: endpointSchema,
});
const commonPackage = packageSnapshot('@example/plugin-example-common', {
  configSchema: enabledSchema,
});
const backendPackage = packageSnapshot('@example/plugin-example-backend', {
  configSchema: backendSchema,
});
const packages = [frontendPackage, commonPackage, backendPackage];
const primaryNpmPackageName = '@example/plugin-example';

describe('ConfigureGuide', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders the selected package and its direct internal dependencies from the snapshot without fetching', async () => {
    render(
      <ConfigureGuide
        packageSnapshot={frontendPackage}
        packages={packages}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    expect(await screen.findByLabelText(/^endpoint/)).toBeVisible();
    expect(screen.getByLabelText(/^enabled/)).toBeVisible();
    expect(screen.queryByLabelText(/^backendOnly/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Package' }),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validates required values before generating copyable YAML', async () => {
    const user = userEvent.setup();
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
    await user.type(
      screen.getByLabelText(/^endpoint/),
      'https://api.example.com',
    );
    expect(copyButton).toBeEnabled();
    expect(
      screen.getByLabelText('@example/plugin-example generated YAML'),
    ).toHaveTextContent('endpoint: https://api.example.com');
  });

  it('explains when a package stores no configuration schema', async () => {
    const withoutSchema = packageSnapshot('@example/plugin-example-backend');
    render(
      <ConfigureGuide
        packageSnapshot={withoutSchema}
        packages={[withoutSchema]}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    expect(
      await screen.findByText(
        'This package does not provide a configuration schema.',
      ),
    ).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('allows adding, renaming, and removing entries in a bare object schema', async () => {
    const user = userEvent.setup();
    const bareObjectPackage = packageSnapshot(
      '@example/plugin-example-backend',
      {
        configSchema: {
          type: 'object',
          properties: {
            entityOverrides: {
              type: 'object',
              description: 'Properties to override on the final entity object.',
            },
          },
        },
      },
    );
    render(
      <ConfigureGuide
        packageSnapshot={bareObjectPackage}
        packages={[bareObjectPackage]}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    await user.click(
      await screen.findByRole('button', { name: 'Add property' }),
    );
    const keyInput = screen.getByLabelText('Property name');
    await user.clear(keyInput);
    await user.type(keyInput, 'metadata.name');
    await user.tab();
    const valueInput = screen.getByLabelText('metadata.name');
    await user.clear(valueInput);
    await user.type(valueInput, 'my-component');

    expect(
      screen.getByLabelText('@example/plugin-example-backend generated YAML'),
    ).toHaveTextContent('entityOverrides:');
    expect(
      screen.getByLabelText('@example/plugin-example-backend generated YAML'),
    ).toHaveTextContent('metadata.name: my-component');

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.queryByLabelText('metadata.name')).not.toBeInTheDocument();
  });
});
