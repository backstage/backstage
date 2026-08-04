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
import { readFileSync } from 'node:fs';
import { after, afterEach, beforeEach, describe, it } from 'node:test';
import type { PluginData } from '../../pluginDirectory/manifest';
import { pluginManifestSchema } from '../../pluginDirectory/manifest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { load } from 'js-yaml';
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


const kubernetesPlugin = pluginManifestSchema.parse(
  load(
    readFileSync(
      new URL('../../../data/plugins/backstage-kubernetes.yaml', import.meta.url),
      'utf8',
    ),
  ),
);

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
    assert.ok(screen.getByText('ts'));
    assert.equal(screen.getByLabelText('Language: ts').textContent, 'ts');
    const authoredCode = screen
      .getByText("backend.add(import('@example/plugin-example-backend'));")
      .closest('code');
    assert.ok(authoredCode);
    assert.equal(
      authoredCode.textContent,
      "backend.add(import('@example/plugin-example-backend'));\n",
    );
    assert.equal(authoredCode.classList.contains('language-ts'), true);
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

  it('emits backend-valid service-account Kubernetes authentication only', async () => {
    const user = userEvent.setup({ document });
    render(<SetupGuide plugin={kubernetesPlugin} />);

    await user.click(
      screen.getByRole('button', { name: 'Add Config locator' }),
    );
    await user.click(screen.getByRole('button', { name: 'Add Cluster' }));

    const authProvider = screen.getByLabelText('Authentication provider');
    assert.equal(authProvider.tagName, 'SELECT');
    assert.equal(
      screen.queryByRole('option', { name: 'oidc' }),
      null,
    );
    assert.deepEqual(
      Array.from((authProvider as HTMLSelectElement).options).map(
        option => option.value,
      ),
      ['', 'serviceAccount'],
    );

    await user.type(screen.getByLabelText('Cluster name'), 'production');
    await user.type(
      screen.getByLabelText('API server URL'),
      'https://kubernetes.example.com',
    );

    const yaml = screen.getByLabelText('Generated app-config.yaml').textContent;
    assert.equal(
      yaml,
      'kubernetes:\n' +
        '  serviceLocatorMethod:\n' +
        '    type: multiTenant\n' +
        '  clusterLocatorMethods:\n' +
        '    - type: config\n' +
        '      clusters:\n' +
        '        - name: production\n' +
        '          url: https://kubernetes.example.com\n' +
        '          authProvider: serviceAccount\n' +
        '          serviceAccountToken: ${K8S_SERVICE_ACCOUNT_TOKEN}\n' +
        '          skipTLSVerify: false\n' +
        '          skipMetricsLookup: false\n',
    );
    assert.equal(yaml?.includes('oidc'), false);
  });

  it('keeps required Boolean controls explicitly valid without requiring them to be checked', async () => {
    const user = userEvent.setup({ document });
    const booleanPlugin: PluginData = {
      ...plugin,
      setup: {
        ...plugin.setup,
        config: {
          schema: {
            type: 'object',
      properties: {
        requiredWithoutDefault: {
          type: 'boolean',
          'x-ui': { label: 'Required without default' },
        },
        requiredWithFalseDefault: {
          type: 'boolean',
          default: false,
          'x-ui': { label: 'Required with false default' },
        },
        requiredWithDefault: {
          type: 'boolean',
          default: true,
          'x-ui': { label: 'Required with default' },
        },
        flags: {
          type: 'array',
          'x-ui': { label: 'Flags' },
          items: {
            type: 'boolean',
            'x-ui': { label: 'Feature flag' },
          },
        },
      },
      required: [
        'requiredWithoutDefault',
        'requiredWithFalseDefault',
        'requiredWithDefault',
        'flags',
      ],
          },
        },
      },
    };
    render(<SetupGuide plugin={booleanPlugin} />);

    const falseCheckbox = screen.getByLabelText('Required without default');
    const defaultFalseCheckbox = screen.getByLabelText(
      'Required with false default',
    );
    const trueCheckbox = screen.getByLabelText('Required with default');
    assert.equal((falseCheckbox as HTMLInputElement).checked, false);
    assert.equal((defaultFalseCheckbox as HTMLInputElement).checked, false);
    assert.equal((trueCheckbox as HTMLInputElement).checked, true);
    assert.equal(falseCheckbox.hasAttribute('required'), false);
    assert.equal(defaultFalseCheckbox.hasAttribute('required'), false);
    assert.equal((falseCheckbox as HTMLInputElement).checkValidity(), true);
    assert.equal(
      (defaultFalseCheckbox as HTMLInputElement).checkValidity(),
      true,
    );
    assert.equal((trueCheckbox as HTMLInputElement).checkValidity(), true);

    await user.click(screen.getByRole('button', { name: 'Add Feature flag' }));
    const arrayCheckbox = screen.getByLabelText('Feature flag 1');
    assert.equal((arrayCheckbox as HTMLInputElement).checked, false);
    assert.equal(arrayCheckbox.hasAttribute('required'), false);
    assert.equal((arrayCheckbox as HTMLInputElement).checkValidity(), true);
    assert.equal(
      screen
        .getByRole('form', { name: 'Plugin configuration' })
        .checkValidity(),
      true,
    );
    assert.equal(
      screen.getByRole('button', { name: 'Copy generated YAML' }).hasAttribute(
        'disabled',
      ),
      false,
    );
    assert.equal(
      screen.getByLabelText('Generated app-config.yaml').textContent,
      'requiredWithoutDefault: false\n' +
        'requiredWithFalseDefault: false\n' +
        'requiredWithDefault: true\n' +
        'flags:\n' +
        '  - false\n',
    );
  });

  it('uses unique associations and preserves array item control IDs after removal', async () => {
    const user = userEvent.setup({ document });
    const identityPlugin: PluginData = {
      ...plugin,
      setup: {
        ...plugin.setup,
        config: {
          schema: {
            type: 'object',
      description: 'Root configuration help.',
      properties: {
        'a.b': {
          type: 'string',
          description: 'Help for dotted property.',
          'x-ui': { label: 'Dotted property' },
        },
        'a-b': {
          type: 'string',
          description: 'Help for dashed property.',
          'x-ui': { label: 'Dashed property' },
        },
        root: {
          type: 'string',
          description: 'Help for root property.',
          'x-ui': { label: 'Root property' },
        },
        rows: {
          type: 'array',
          'x-ui': { label: 'Rows' },
          items: {
            type: 'object',
            'x-ui': { label: 'Row' },
            properties: {
              value: {
                type: 'string',
                description: 'Value for this row.',
                'x-ui': { label: 'Row value' },
              },
            },
            required: ['value'],
          },
        },
      },
      required: ['a.b', 'a-b', 'root', 'rows'],
          },
        },
      },
    };
    render(<SetupGuide plugin={identityPlugin} />);

    const rootGroup = screen.getByRole('group', {
      name: 'Configuration fields',
    });
    const rootDescriptionId = rootGroup.getAttribute('aria-describedby');
    assert.ok(rootDescriptionId);
    assert.equal(
      document.querySelectorAll(`[id="${rootDescriptionId}"]`).length,
      1,
    );

    const associatedText = (control: HTMLElement) =>
      (control.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map(id => document.getElementById(id)?.textContent);
    const collidingControls = [
      screen.getByLabelText('Dotted property'),
      screen.getByLabelText('Dashed property'),
      screen.getByLabelText('Root property'),
    ];
    assert.equal(
      new Set(collidingControls.map(control => control.id)).size,
      collidingControls.length,
    );
    assert.deepEqual(associatedText(collidingControls[0]), [
      'Help for dotted property.',
      'Required',
    ]);
    assert.deepEqual(associatedText(collidingControls[1]), [
      'Help for dashed property.',
      'Required',
    ]);
    assert.deepEqual(associatedText(collidingControls[2]), [
      'Help for root property.',
      'Required',
    ]);

    await user.click(screen.getByRole('button', { name: 'Add Row' }));
    await user.click(screen.getByRole('button', { name: 'Add Row' }));
    const rowControls = screen.getAllByLabelText('Row value');
    await user.type(rowControls[0], 'first');
    const survivingControlId = rowControls[1].id;
    const survivingDescribedBy = rowControls[1].getAttribute(
      'aria-describedby',
    );
    assert.deepEqual(associatedText(rowControls[1]), [
      'Value for this row.',
      'Required',
    ]);

    await user.click(screen.getByRole('button', { name: 'Remove Row 1' }));
    const remainingControl = screen.getByLabelText('Row value');
    assert.equal(remainingControl.id, survivingControlId);
    assert.equal(
      remainingControl.getAttribute('aria-describedby'),
      survivingDescribedBy,
    );
    assert.deepEqual(associatedText(remainingControl), [
      'Value for this row.',
      'Required',
    ]);
    assert.equal(
      screen.getByText('Row value', { selector: 'label' }).getAttribute('for'),
      survivingControlId,
    );
  });

  it('renders an explicit fallback when setup metadata is absent', () => {
    render(<SetupGuide plugin={{ ...plugin, setup: undefined }} />);

    assert.ok(screen.getByText('Setup guide not provided'));
    assert.equal(screen.queryByRole('heading'), null);
  });
});
