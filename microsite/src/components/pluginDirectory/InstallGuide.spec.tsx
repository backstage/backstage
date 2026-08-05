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

function freshNpm(backstageRole?: string) {
  return {
    status: 'fresh' as const,
    checkedAt: '2026-08-03T12:00:00.000Z',
    lastAttemptAt: '2026-08-03T12:00:00.000Z',
    latestVersion: '1.0.0',
    lastPublishedAt: '2026-07-01T00:00:00.000Z',
    ...(backstageRole ? { backstageRole } : {}),
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
        npmPackageName: '@example/plugin-example',
        npm: freshNpm('frontend'),
      },
      {
        npmPackageName: '@example/plugin-example-backend',
        npm: freshNpm('backend'),
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

  it('shows how to wire a backend package into packages/backend/src/index.ts', async () => {
    const user = userEvent.setup();
    render(<InstallGuide plugin={plugin} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package' }),
      '@example/plugin-example-backend',
    );

    expect(
      screen.getByText('packages/backend/src/index.ts', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend'));",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Copy backend wiring command' }),
    ).toBeInTheDocument();
  });

  it('does not show backend wiring instructions for a frontend package', () => {
    render(<InstallGuide plugin={plugin} />);

    expect(
      screen.queryByText('packages/backend/src/index.ts', { exact: false }),
    ).not.toBeInTheDocument();
  });

  it('shows backend wiring instructions for a backend module package', () => {
    render(
      <InstallGuide
        plugin={{
          ...plugin,
          npmPackageName: '@example/plugin-example-backend-module-foo',
          snapshot: undefined,
        }}
      />,
    );

    expect(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend-module-foo'));",
      ),
    ).toBeInTheDocument();
  });

  it('omits packages listed as an internalDependency of another package, since they install transitively', () => {
    render(
      <InstallGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                ...plugin.snapshot!.packages[0],
                internalDependencies: ['@example/plugin-example-react'],
              },
              {
                ...plugin.snapshot!.packages[1],
                internalDependencies: [
                  '@example/plugin-example-common',
                  '@example/plugin-example-node',
                ],
              },
              {
                npmPackageName: '@example/plugin-example-common',
                npm: freshNpm(),
              },
              {
                npmPackageName: '@example/plugin-example-node',
                npm: freshNpm(),
              },
              {
                npmPackageName: '@example/plugin-example-react',
                npm: freshNpm(),
              },
              {
                npmPackageName: '@example/plugin-example-backend-module-foo',
                npm: freshNpm(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByRole('combobox', { name: 'Package' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /plugin-example \(frontend\)/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: /plugin-example-backend \(backend\)/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /backend-module-foo/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /-common/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /-node/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /-react/ }),
    ).not.toBeInTheDocument();
  });

  it('keeps a same-named package in the picker when nothing lists it as a dependency, even if it looks like a library', () => {
    render(
      <InstallGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              ...plugin.snapshot!.packages,
              {
                npmPackageName: '@example/plugin-example-common',
                npm: freshNpm(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByRole('option', { name: /plugin-example-common/ }),
    ).toBeInTheDocument();
  });

  it('falls back to the unfiltered package list when filtering would leave nothing to show', () => {
    render(
      <InstallGuide
        plugin={{
          ...plugin,
          snapshot: {
            ...plugin.snapshot!,
            packages: [
              {
                npmPackageName: '@example/plugin-a',
                internalDependencies: ['@example/plugin-b'],
                npm: freshNpm(),
              },
              {
                npmPackageName: '@example/plugin-b',
                internalDependencies: ['@example/plugin-a'],
                npm: freshNpm(),
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByRole('option', { name: /plugin-a/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /plugin-b/ }),
    ).toBeInTheDocument();
  });
});
