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
  },
};

describe('InstallGuide', () => {
  it('keeps install, route, and extension guidance in the declared order', () => {
    render(<InstallGuide plugin={plugin} />);

    expect(
      screen.getAllByRole('heading').map(heading => heading.textContent),
    ).toEqual(['Install', 'Integrate', 'Routes added', 'Extensions added']);

    expect(screen.getByText('yarn add @example/plugin-example')).toBeInTheDocument();
    expect(
      screen.getByText('yarn add @example/plugin-example-backend'),
    ).toBeInTheDocument();
    expect(screen.getByText('example')).toBeInTheDocument();
    expect(
      screen.getByText('entity-content:example/example'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("backend.add(import('@example/plugin-example-backend'));"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Language: ts')).toHaveTextContent('ts');
  });

  it('copies package commands and authored snippets and announces clipboard results', async () => {
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

    await user.click(
      screen.getByRole('button', {
        name: 'Copy Register the backend snippet',
      }),
    );
    expect(copiedValues.at(-1)).toBe(
      "backend.add(import('@example/plugin-example-backend'));\n",
    );
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

  it('renders an explicit fallback when setup metadata is absent', () => {
    render(<InstallGuide plugin={{ ...plugin, setup: undefined }} />);

    expect(screen.getByText('Setup guide not provided')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
