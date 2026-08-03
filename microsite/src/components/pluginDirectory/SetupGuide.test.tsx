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
import { closeTestDom } from './testDom';
import assert from 'node:assert/strict';
import { after, afterEach, beforeEach, describe, it } from 'node:test';
import type { PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetupGuide } from './SetupGuide';

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
    packages: [
      { name: '@example/plugin-example', role: 'frontend' },
      { name: '@example/plugin-example-backend', role: 'backend' },
    ],
    frontend: {
      routes: [
        {
          name: 'example',
          type: 'provided',
          description: 'Provides the example page route.',
        },
      ],
      extensions: [
        {
          id: 'entity-content:example/example',
          kind: 'entity-content',
          description: 'Adds example content to catalog entities.',
          enabledByDefault: true,
        },
      ],
    },
    integration: [
      {
        title: 'Register the backend',
        explanation: 'Register the backend plugin before starting Backstage.',
        language: 'ts',
        source: "backend.add(import('@example/plugin-example-backend'));\n",
      },
    ],
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
                    name: {
                      type: 'string',
                      'x-ui': { label: 'Cluster name' },
                    },
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

let copiedValues: string[];

beforeEach(() => {
  copiedValues = [];
});

afterEach(cleanup);
after(closeTestDom);

describe('SetupGuide', () => {
  it('keeps install, route, extension, and configuration guidance in the declared order', () => {
    render(<SetupGuide plugin={plugin} />);

    assert.deepEqual(
      screen.getAllByRole('heading').map(heading => heading.textContent),
      ['Install', 'Integrate', 'Routes added', 'Extensions added', 'Configure'],
    );

    assert.ok(screen.getByText('yarn add @example/plugin-example'));
    assert.ok(
      screen.getByText('yarn add @example/plugin-example-backend'),
    );
    assert.ok(screen.getByText('example'));
    assert.ok(screen.getByText('entity-content:example/example'));
    assert.ok(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend'));",
      ),
    );
  });

  it('copies package commands and authored snippets and announces clipboard results', async () => {
    const user = userEvent.setup({ document });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedValues.push(value);
        },
      },
    });
    render(<SetupGuide plugin={plugin} />);

    await user.click(
      screen.getByRole('button', {
        name: 'Copy frontend install command',
      }),
    );
    assert.deepEqual(copiedValues, [
      'yarn add @example/plugin-example',
    ]);
    assert.ok(
      await screen.findByText('Copied frontend install command.'),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Copy Register the backend snippet',
      }),
    );
    assert.equal(
      copiedValues.at(-1),
      "backend.add(import('@example/plugin-example-backend'));\n",
    );
  });

  it('announces clipboard failures without changing the displayed code', async () => {
    const user = userEvent.setup({ document });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Clipboard permission denied');
        },
      },
    });
    render(<SetupGuide plugin={plugin} />);

    await user.click(
      screen.getByRole('button', {
        name: 'Copy backend install command',
      }),
    );

    assert.ok(
      await screen.findByText('Could not copy backend install command.'),
    );
    assert.ok(
      screen.getByText('yarn add @example/plugin-example-backend'),
    );
  });

  it('renders recursive controls, validates inline, and updates deterministic YAML', async () => {
    const user = userEvent.setup({ document });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedValues.push(value);
        },
      },
    });
    render(<SetupGuide plugin={plugin} />);

    const yamlCopy = screen.getByRole('button', {
      name: 'Copy generated YAML',
    });
    assert.equal(yamlCopy.hasAttribute('disabled'), true);
    assert.ok(screen.getAllByText('Required').length >= 2);

    assert.ok(screen.getByRole('group', { name: 'Plugin settings' }));
    assert.equal(screen.getByLabelText('API endpoint').tagName, 'INPUT');
    assert.equal(screen.getByLabelText('Mode').tagName, 'SELECT');
    assert.equal(screen.getByLabelText('Retry count').getAttribute('type'), 'number');
    assert.equal(screen.getByLabelText('Sample rate').getAttribute('type'), 'number');
    assert.equal(screen.getByLabelText('Enabled').getAttribute('type'), 'checkbox');
    assert.equal(screen.queryByLabelText('API token'), null);
    assert.ok(screen.getByText('${EXAMPLE_TOKEN}'));

    await user.type(screen.getByLabelText('API endpoint'), 'https://api.example.com');
    await user.selectOptions(screen.getByLabelText('Mode'), 'staging');
    await user.clear(screen.getByLabelText('Retry count'));
    await user.type(screen.getByLabelText('Retry count'), '5');
    await user.clear(screen.getByLabelText('Sample rate'));
    await user.type(screen.getByLabelText('Sample rate'), '0.75');
    await user.click(screen.getByLabelText('Enabled'));
    await user.click(screen.getByRole('button', { name: 'Add Cluster' }));
    assert.ok(screen.getByRole('group', { name: 'Cluster 1' }));
    assert.ok(
      screen.getByRole('button', { name: 'Remove Cluster 1' }),
    );
    await user.type(screen.getByLabelText('Cluster name'), 'production');
    await user.selectOptions(screen.getByLabelText('Cluster role'), 'secondary');

    assert.equal(yamlCopy.hasAttribute('disabled'), false);
    const yaml = screen.getByLabelText('Generated app-config.yaml').textContent;
    assert.equal(
      yaml,
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
    assert.equal(copiedValues.at(-1), yaml);

    await user.click(
      screen.getByRole('button', { name: 'Remove Cluster 1' }),
    );
    assert.equal(screen.queryByLabelText('Cluster name'), null);
    assert.equal(
      screen.getByLabelText('Generated app-config.yaml').textContent,
      'app:\n' +
        '  endpoint: https://api.example.com\n' +
        '  mode: staging\n' +
        '  retryCount: 5\n' +
        '  sampleRate: 0.75\n' +
        '  enabled: true\n' +
        '  apiToken: ${EXAMPLE_TOKEN}\n' +
        '  clusters: []\n',
    );
  });

  it('renders an explicit fallback when setup metadata is absent', () => {
    render(<SetupGuide plugin={{ ...plugin, setup: undefined }} />);

    assert.ok(screen.getByText('Setup guide not provided'));
    assert.equal(screen.queryByRole('heading'), null);
  });
});
