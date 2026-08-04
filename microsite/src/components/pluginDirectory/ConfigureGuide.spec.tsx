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
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { PluginData } from '../../pluginDirectory/manifest';
import { pluginManifestSchema } from '../../pluginDirectory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { load } from 'js-yaml';
import { ConfigureGuide } from './ConfigureGuide';

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
  setup: {
    config: {
      schema: {
        type: 'object',
        properties: {
          app: {
            type: 'object',
            'x-ui': { label: 'Plugin settings' },
            description: 'Settings used by the example plugin.',
            properties: {
              endpoint: {
                type: 'string',
                description: 'Base URL for the example service.',
                'x-ui': { label: 'API endpoint' },
              },
              mode: {
                type: 'string',
                enum: ['production', 'staging'],
                default: 'production',
                'x-ui': { label: 'Mode' },
              },
              retryCount: {
                type: 'integer',
                default: 3,
                'x-ui': { label: 'Retry count' },
              },
              sampleRate: {
                type: 'number',
                default: 0.5,
                'x-ui': { label: 'Sample rate' },
              },
              enabled: {
                type: 'boolean',
                default: false,
                'x-ui': { label: 'Enabled' },
              },
              apiToken: {
                type: 'string',
                description: 'Read from the environment at runtime.',
                'x-ui': {
                  label: 'API token',
                  secretEnv: 'EXAMPLE_TOKEN',
                },
              },
              clusters: {
                type: 'array',
                'x-ui': { label: 'Clusters' },
                items: {
                  type: 'object',
                  'x-ui': { label: 'Cluster' },
                  properties: {
                    name: { type: 'string', 'x-ui': { label: 'Cluster name' } },
                    role: {
                      type: 'string',
                      enum: ['primary', 'secondary'],
                      default: 'primary',
                      'x-ui': { label: 'Cluster role' },
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
              'apiToken',
              'clusters',
            ],
          },
        },
        required: ['app'],
      },
    },
  },
};

const kubernetesPlugin = pluginManifestSchema.parse(
  load(
    readFileSync(
      path.join(__dirname, '../../../data/plugins/backstage-kubernetes.yaml'),
      'utf8',
    ),
  ),
);

describe('ConfigureGuide', () => {
  it('renders recursive controls, validates inline, and updates deterministic YAML', async () => {
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

    const yamlCopy = screen.getByRole('button', { name: 'Copy generated YAML' });
    expect(yamlCopy).toBeDisabled();
    expect(screen.getAllByText('Required').length).toBeGreaterThanOrEqual(2);

    expect(screen.getByRole('group', { name: 'Plugin settings' })).toBeInTheDocument();
    expect(screen.getByLabelText('API endpoint').tagName).toBe('INPUT');
    expect(screen.getByLabelText('Mode').tagName).toBe('SELECT');
    expect(screen.getByLabelText('Retry count')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Sample rate')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Enabled')).toHaveAttribute('type', 'checkbox');
    expect(screen.queryByLabelText('API token')).not.toBeInTheDocument();
    expect(screen.getByText('${EXAMPLE_TOKEN}')).toBeInTheDocument();

    await user.type(screen.getByLabelText('API endpoint'), 'https://api.example.com');
    await user.selectOptions(screen.getByLabelText('Mode'), 'staging');
    await user.clear(screen.getByLabelText('Retry count'));
    await user.type(screen.getByLabelText('Retry count'), '5');
    await user.clear(screen.getByLabelText('Sample rate'));
    await user.type(screen.getByLabelText('Sample rate'), '0.75');
    await user.click(screen.getByLabelText('Enabled'));
    await user.click(screen.getByRole('button', { name: 'Add Cluster' }));
    await user.type(screen.getByLabelText('Cluster name'), 'production');
    await user.selectOptions(screen.getByLabelText('Cluster role'), 'secondary');

    expect(yamlCopy).toBeEnabled();
    const yaml = screen.getByLabelText('Generated app-config.yaml').textContent;
    expect(yaml).toBe(
      'app:\n' +
        '  endpoint: https://api.example.com\n' +
        '  mode: staging\n' +
        '  retryCount: 5\n' +
        '  sampleRate: 0.75\n' +
        '  enabled: true\n' +
        '  apiToken: ${EXAMPLE_TOKEN}\n' +
        '  clusters:\n' +
        '    - name: production\n' +
        '      role: secondary\n',
    );

    await user.click(yamlCopy);
    expect(copiedValues.at(-1)).toBe(yaml);
  });

  it('emits backend-valid service-account Kubernetes authentication only', async () => {
    const user = userEvent.setup();
    render(<ConfigureGuide plugin={kubernetesPlugin} />);

    await user.click(screen.getByRole('button', { name: 'Add Config locator' }));
    await user.click(screen.getByRole('button', { name: 'Add Cluster' }));

    const authProvider = screen.getByLabelText('Authentication provider');
    expect(authProvider.tagName).toBe('SELECT');
    expect(screen.queryByRole('option', { name: 'oidc' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Cluster name'), 'production');
    await user.type(
      screen.getByLabelText('API server URL'),
      'https://kubernetes.example.com',
    );

    const yaml = screen.getByLabelText('Generated app-config.yaml').textContent;
    expect(yaml).not.toContain('oidc');
    expect(yaml).toContain('serviceAccount');
  });

  it('renders an explicit fallback when setup metadata is absent', () => {
    render(<ConfigureGuide plugin={{ ...plugin, setup: undefined }} />);

    expect(screen.getByText('Setup guide not provided')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders an explicit message when no configuration schema is declared', () => {
    render(
      <ConfigureGuide
        plugin={{ ...plugin, setup: { ...plugin.setup, config: undefined } }}
      />,
    );

    expect(screen.getByText('No configuration schema provided.')).toBeInTheDocument();
  });
});
