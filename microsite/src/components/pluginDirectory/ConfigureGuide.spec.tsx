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
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  snapshot: {
    backstage: {
      status: 'unavailable',
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      reason: 'repository-unsupported',
    },
    packages: [
      {
        npmPackageName: '@example/plugin-example',
        npm: {
          status: 'fresh',
          lastAttemptAt: '2026-01-01T00:00:00.000Z',
          checkedAt: '2026-01-01T00:00:00.000Z',
          latestVersion: '1.0.0',
          lastPublishedAt: '2026-01-01T00:00:00.000Z',
        },
        configSchema: {
          status: 'fresh',
          lastAttemptAt: '2026-01-01T00:00:00.000Z',
          checkedAt: '2026-01-01T00:00:00.000Z',
          schema: {
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
          },
        },
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

    const yamlCopy = screen.getByRole('button', { name: 'Copy @example/plugin-example generated YAML' });
    expect(yamlCopy).toBeDisabled();

    expect(screen.getByRole('group', { name: 'app' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^endpoint/).tagName).toBe('INPUT');
    expect(screen.getByLabelText(/^mode/).tagName).toBe('SELECT');
    expect(screen.getByLabelText(/^retryCount/)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/^sampleRate/)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/^enabled/)).toHaveAttribute('type', 'checkbox');

    await user.type(screen.getByLabelText(/^endpoint/), 'https://api.example.com');
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
    const yaml = screen.getByLabelText('@example/plugin-example generated YAML').textContent;
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
    render(
      <ConfigureGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                ...plugin.snapshot!.packages[0],
                configSchema: {
                  status: 'fresh',
                  lastAttemptAt: '2026-01-01T00:00:00.000Z',
                  checkedAt: '2026-01-01T00:00:00.000Z',
                  schema: anyOfSchema,
                },
              },
            ],
          },
        }}
      />,
    );

    expect(screen.queryByText(/"anyOf"/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Cron expression' }),
    ).toBeInTheDocument();

    const yamlCopy = screen.getByRole('button', {
      name: 'Copy @example/plugin-example generated YAML',
    });
    expect(yamlCopy).toBeDisabled();
  });

  it('renders an explicit message when no package snapshot is available', () => {
    render(<ConfigureGuide plugin={{ ...plugin, snapshot: undefined }} />);

    expect(screen.getByText('No configuration schema provided.')).toBeInTheDocument();
  });
});
