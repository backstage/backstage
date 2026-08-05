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
import { fetchPackageConfigSchema } from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigureGuide } from './ConfigureGuide';

jest.mock('../../pluginDirectory/npmRegistryClient');

const mockFetchPackageConfigSchema = fetchPackageConfigSchema as jest.MockedFunction<
  typeof fetchPackageConfigSchema
>;

// Maps npmPackageName -> schema (or undefined for "declared none"). Every
// package referenced by a test's fixture must appear here, even with an
// undefined value, so the mock doesn't silently resolve to "not mocked".
function mockConfigSchemas(schemasByPackage: Record<string, unknown>) {
  mockFetchPackageConfigSchema.mockImplementation(async npmPackageName => ({
    status: 'ready',
    value: schemasByPackage[npmPackageName],
  }));
}

function npmSnapshot(backstageRole?: string) {
  return {
    status: 'fresh' as const,
    lastAttemptAt: '2026-01-01T00:00:00.000Z',
    checkedAt: '2026-01-01T00:00:00.000Z',
    latestVersion: '1.0.0',
    lastPublishedAt: '2026-01-01T00:00:00.000Z',
    ...(backstageRole ? { backstageRole } : {}),
  };
}

const appSchema = {
  type: 'object',
  properties: {
    app: {
      type: 'object',
      description: 'Settings used by the example plugin.',
      properties: {
        endpoint: {
          type: 'string',
          description: 'Base URL for the example service.',
        },
        mode: {
          type: 'string',
          enum: ['production', 'staging'],
          default: 'production',
        },
        retryCount: {
          type: 'integer',
          default: 3,
        },
        sampleRate: {
          type: 'number',
          default: 0.5,
        },
        enabled: {
          type: 'boolean',
          default: false,
        },
        clusters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: {
                type: 'string',
                enum: ['primary', 'secondary'],
                default: 'primary',
              },
            },
            required: ['name', 'role'],
          },
        },
      },
      required: [
        'endpoint',
        'mode',
        'retryCount',
        'sampleRate',
        'enabled',
        'clusters',
      ],
    },
  },
  required: ['app'],
};

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
      {
        npmPackageName: '@example/plugin-example',
        npm: npmSnapshot(),
      },
    ],
  },
};

const anyOfSchema = {
  type: 'object',
  properties: {
    schedule: {
      type: 'object',
      properties: {
        frequency: {
          anyOf: [
            { type: 'string', title: 'Cron expression' },
            {
              type: 'object',
              title: 'Duration',
              properties: {
                minutes: { type: 'number' },
              },
            },
          ],
        },
      },
      required: ['frequency'],
    },
  },
  required: ['schedule'],
};

describe('ConfigureGuide', () => {
  beforeEach(() => {
    mockFetchPackageConfigSchema.mockReset();
  });

  it('renders recursive controls, validates inline, and updates deterministic YAML', async () => {
    mockConfigSchemas({ '@example/plugin-example': appSchema });
    const user = userEvent.setup();
    const copiedValues: string[] = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedValues.push(value);
        },
      },
    });
    render(<ConfigureGuide plugin={plugin} />);

    const yamlCopy = await screen.findByRole('button', {
      name: 'Copy @example/plugin-example generated YAML',
    });
    expect(yamlCopy).toBeDisabled();

    expect(screen.getByRole('group', { name: 'app' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^endpoint/).tagName).toBe('INPUT');
    expect(screen.getByLabelText(/^mode/).tagName).toBe('SELECT');
    expect(screen.getByLabelText(/^retryCount/)).toHaveAttribute(
      'type',
      'number',
    );
    expect(screen.getByLabelText(/^sampleRate/)).toHaveAttribute(
      'type',
      'number',
    );
    expect(screen.getByLabelText(/^enabled/)).toHaveAttribute(
      'type',
      'checkbox',
    );

    await user.type(
      screen.getByLabelText(/^endpoint/),
      'https://api.example.com',
    );
    await user.selectOptions(screen.getByLabelText(/^mode/), 'staging');
    await user.clear(screen.getByLabelText(/^retryCount/));
    await user.type(screen.getByLabelText(/^retryCount/), '5');
    await user.clear(screen.getByLabelText(/^sampleRate/));
    await user.type(screen.getByLabelText(/^sampleRate/), '0.75');
    await user.click(screen.getByLabelText(/^enabled/));
    await user.click(screen.getByRole('button', { name: 'Add Item' }));
    await user.type(screen.getByLabelText(/^name/), 'production');
    await user.selectOptions(screen.getByLabelText(/^role/), 'secondary');

    expect(yamlCopy).toBeEnabled();
    const yaml = screen.getByLabelText(
      '@example/plugin-example generated YAML',
    ).textContent;
    expect(yaml).toContain('endpoint: https://api.example.com');
    expect(yaml).toContain('mode: staging');
    expect(yaml).toContain('retryCount: 5');
    expect(yaml).toContain('sampleRate: 0.75');
    expect(yaml).toContain('enabled: true');
    expect(yaml).toContain('name: production');
    expect(yaml).toContain('role: secondary');

    await user.click(yamlCopy);
    expect(copiedValues.at(-1)).toBe(yaml);
  });

  it('renders an interactive form for anyOf fields instead of a read-only dump', async () => {
    mockConfigSchemas({ '@example/plugin-example': anyOfSchema });

    render(<ConfigureGuide plugin={plugin} />);

    expect(
      await screen.findByRole('option', { name: 'Cron expression' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/"anyOf"/)).not.toBeInTheDocument();

    const yamlCopy = screen.getByRole('button', {
      name: 'Copy @example/plugin-example generated YAML',
    });
    expect(yamlCopy).toBeDisabled();
  });

  it('renders an explicit message when no package snapshot is available', async () => {
    render(<ConfigureGuide plugin={{ ...plugin, snapshot: undefined }} />);

    expect(
      await screen.findByText('No configuration schema provided.'),
    ).toBeInTheDocument();
    expect(mockFetchPackageConfigSchema).not.toHaveBeenCalled();
  });

  it('still lists a package with no config schema of its own, showing an explicit message when selected', async () => {
    mockConfigSchemas({
      '@example/plugin-example': appSchema,
      '@example/plugin-example-common': undefined,
    });
    const user = userEvent.setup();
    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              plugin.snapshot!.packages[0],
              {
                npmPackageName: '@example/plugin-example-common',
                npm: npmSnapshot(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      await screen.findByRole('option', {
        name: '@example/plugin-example-common (common)',
      }),
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      '@example/plugin-example-common',
    );

    expect(
      await screen.findByText('No configuration schema provided.'),
    ).toBeInTheDocument();
  });

  it("merges a frontend package with no schema of its own into its dependency's schema", async () => {
    mockConfigSchemas({
      '@example/plugin-frontend': undefined,
      '@example/plugin-react': {
        type: 'object',
        properties: {
          featureFlag: { type: 'boolean' },
        },
        required: ['featureFlag'],
      },
      '@example/plugin-extra-module': {
        type: 'object',
        properties: {
          path: { type: 'string' },
        },
        required: ['path'],
      },
    });

    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/plugin-frontend',
                internalDependencies: ['@example/plugin-react'],
                npm: npmSnapshot('frontend-plugin'),
              },
              {
                npmPackageName: '@example/plugin-react',
                npm: npmSnapshot(),
              },
              {
                npmPackageName: '@example/plugin-extra-module',
                npm: npmSnapshot('module'),
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByRole('option', { name: 'Frontend' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: '@example/plugin-extra-module (module)',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /plugin-react/ }),
    ).not.toBeInTheDocument();
    expect(await screen.findByLabelText(/^featureFlag/)).toHaveAttribute(
      'type',
      'checkbox',
    );
  });

  it("merges a shared dependency's schema into both Frontend and Backend sections", async () => {
    mockConfigSchemas({
      '@example/plugin-frontend': {
        type: 'object',
        properties: { frontendField: { type: 'string' } },
        required: ['frontendField'],
      },
      '@example/plugin-backend': {
        type: 'object',
        properties: { backendField: { type: 'string' } },
        required: ['backendField'],
      },
      '@example/plugin-common': {
        type: 'object',
        properties: { sharedField: { type: 'string' } },
        required: ['sharedField'],
      },
    });
    const user = userEvent.setup();
    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/plugin-frontend',
                internalDependencies: ['@example/plugin-common'],
                npm: npmSnapshot('frontend-plugin'),
              },
              {
                npmPackageName: '@example/plugin-backend',
                internalDependencies: ['@example/plugin-common'],
                npm: npmSnapshot('backend-plugin'),
              },
              {
                npmPackageName: '@example/plugin-common',
                npm: npmSnapshot('common'),
              },
            ],
          },
        }}
      />,
    );

    expect(await screen.findByLabelText(/^frontendField/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^sharedField/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^backendField/)).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      'Backend',
    );

    expect(await screen.findByLabelText(/^backendField/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^sharedField/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^frontendField/)).not.toBeInTheDocument();
  });

  it('merges a package whose backstage.role is "frontend-plugin" with its dependency\'s schema into a Frontend section', async () => {
    mockConfigSchemas({
      '@example/plugin-frontend': undefined,
      '@example/plugin-react': {
        type: 'object',
        properties: {
          featureFlag: { type: 'boolean' },
        },
        required: ['featureFlag'],
      },
    });

    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/plugin-frontend',
                internalDependencies: ['@example/plugin-react'],
                npm: npmSnapshot('frontend-plugin'),
              },
              {
                npmPackageName: '@example/plugin-react',
                npm: npmSnapshot(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.queryByRole('option', { name: /plugin-react/ }),
    ).not.toBeInTheDocument();
    expect(await screen.findByLabelText(/^featureFlag/)).toHaveAttribute(
      'type',
      'checkbox',
    );
    // Confirms the merge actually happened under the frontend-role package's
    // own identity, rather than the dependency's schema merely surviving on
    // its own as an unmerged fallback entry keyed by `@example/plugin-react`.
    expect(
      screen.getByRole('button', {
        name: 'Copy @example/plugin-frontend generated YAML',
      }),
    ).toBeInTheDocument();
  });

  it('merges two schemas that share the same top-level object property key with disjoint sub-properties', async () => {
    mockConfigSchemas({
      '@example/kubernetes-backend': {
        type: 'object',
        properties: {
          kubernetes: {
            type: 'object',
            properties: {
              serviceLocatorMethod: { type: 'string' },
            },
            required: ['serviceLocatorMethod'],
          },
        },
        required: ['kubernetes'],
      },
      '@example/kubernetes-react': {
        type: 'object',
        properties: {
          kubernetes: {
            type: 'object',
            properties: {
              customResources: { type: 'string' },
            },
            required: ['customResources'],
          },
        },
        required: ['kubernetes'],
      },
    });

    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/kubernetes-backend',
                internalDependencies: ['@example/kubernetes-react'],
                npm: npmSnapshot('backend-plugin'),
              },
              {
                npmPackageName: '@example/kubernetes-react',
                npm: npmSnapshot('module'),
              },
            ],
          },
        }}
      />,
    );

    expect(
      await screen.findByLabelText(/^serviceLocatorMethod/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^customResources/)).toBeInTheDocument();
  });
});
