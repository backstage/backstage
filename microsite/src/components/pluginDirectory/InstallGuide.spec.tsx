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
import { InstallGuide } from './InstallGuide';

const unavailableConfigSchema = {
  status: 'unavailable' as const,
  lastAttemptAt: '2026-08-03T12:00:00.000Z',
  reason: 'npm-data-unavailable' as const,
};

function freshNpm() {
  return {
    status: 'fresh' as const,
    checkedAt: '2026-08-03T12:00:00.000Z',
    lastAttemptAt: '2026-08-03T12:00:00.000Z',
    latestVersion: '1.0.0',
    lastPublishedAt: '2026-07-01T00:00:00.000Z',
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
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      reason: 'repository-unsupported',
    },
    packages: [
      {
        functionality: 'frontend',
        npmPackageName: '@example/plugin-example',
        npm: freshNpm(),
        configSchema: unavailableConfigSchema,
      },
      {
        functionality: 'backend',
        npmPackageName: '@example/plugin-example-backend',
        npm: freshNpm(),
        configSchema: unavailableConfigSchema,
      },
    ],
  },
};

describe('InstallGuide', () => {
  it('shows the first package selected by default and a picker for the rest', () => {
    render(<InstallGuide plugin={plugin} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Install');
    expect(
      screen.getByText('yarn add @example/plugin-example'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('yarn add @example/plugin-example-backend'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Package' }),
    ).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('switches the shown install command when a different package is selected', async () => {
    const user = userEvent.setup();
    render(<InstallGuide plugin={plugin} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      '@example/plugin-example-backend',
    );

    expect(
      screen.getByText('yarn add @example/plugin-example-backend'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('yarn add @example/plugin-example'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
  });

  it('copies the selected package command and announces clipboard results', async () => {
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
    render(<InstallGuide plugin={plugin} />);

    await user.click(
      screen.getByRole('button', { name: 'Copy frontend install command' }),
    );
    expect(copiedValues).toEqual(['yarn add @example/plugin-example']);
    expect(
      await screen.findByText('Copied frontend install command.'),
    ).toBeInTheDocument();
  });

  it('announces clipboard failures without changing the displayed code', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Clipboard permission denied');
        },
      },
    });
    render(<InstallGuide plugin={plugin} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      '@example/plugin-example-backend',
    );
    await user.click(
      screen.getByRole('button', { name: 'Copy backend install command' }),
    );

    expect(
      await screen.findByText('Could not copy backend install command.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('yarn add @example/plugin-example-backend'),
    ).toBeInTheDocument();
  });

  it('derives an install command from the npm package name when no snapshot is available', () => {
    render(<InstallGuide plugin={{ ...plugin, snapshot: undefined }} />);

    expect(
      screen.getByText(`yarn add ${plugin.npmPackageName}`),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Package' }),
    ).not.toBeInTheDocument();
  });

  it('infers the backend role for packages with a -backend name segment when the snapshot omits functionality', () => {
    render(
      <InstallGuide
        plugin={{
          ...plugin,
          npmPackageName: '@example/plugin-example-backend',
          snapshot: undefined,
        }}
      />,
    );

    expect(screen.getByText('backend')).toBeInTheDocument();
  });
});
