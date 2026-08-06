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
import {
  fetchPackageConfigSchema,
  fetchPackageReadme,
} from '../../pluginDirectory/npmRegistryClient';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PluginDetailPage from './PluginDetailPage';

const mockPush = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('@docusaurus/router', () => ({
  useHistory: () => ({ push: mockPush }),
  useLocation: () => mockUseLocation(),
}), { virtual: true });
jest.mock('../../pluginDirectory/npmRegistryClient');
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}));

const mockFetchPackageConfigSchema = fetchPackageConfigSchema as jest.MockedFunction<
  typeof fetchPackageConfigSchema
>;
const mockFetchPackageReadme = fetchPackageReadme as jest.MockedFunction<
  typeof fetchPackageReadme
>;

const endpointSchema = {
  type: 'object',
  properties: {
    endpoint: { type: 'string' },
  },
  required: ['endpoint'],
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
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      reason: 'repository-unsupported',
    },
    packages: [
      {
        npmPackageName: '@example/plugin-example',
        npm: {
          status: 'fresh',
          lastAttemptAt: '2026-08-03T12:00:00.000Z',
          checkedAt: '2026-08-03T12:00:00.000Z',
          latestVersion: '1.0.0',
          lastPublishedAt: '2026-07-01T00:00:00.000Z',
        },
      },
      {
        npmPackageName: '@example/plugin-example-backend',
        npm: {
          status: 'fresh',
          lastAttemptAt: '2026-08-03T12:00:00.000Z',
          checkedAt: '2026-08-03T12:00:00.000Z',
          latestVersion: '1.0.0',
          lastPublishedAt: '2026-07-01T00:00:00.000Z',
        },
      },
    ],
  },
};

function location(search = '') {
  return {
    pathname: '/plugins/example-plugin',
    search,
    hash: '',
  };
}

function renderPage() {
  return render(
    <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
  );
}

describe('PluginDetailPage', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockUseLocation.mockReturnValue(location());
    mockFetchPackageConfigSchema.mockReset();
    mockFetchPackageReadme.mockReset();
    mockFetchPackageConfigSchema.mockResolvedValue({
      status: 'ready',
      value: endpointSchema,
    });
    mockFetchPackageReadme.mockImplementation(async npmPackageName => ({
      status: 'ready',
      value: `README for ${npmPackageName}`,
    }));
  });

  it('navigates from the package browser to a shareable package workspace', async () => {
    const user = userEvent.setup();
    const view = renderPage();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Example Plugin',
    );
    expect(
      screen.getByRole('navigation', { name: 'Packages' }),
    ).toBeVisible();
    expect(screen.getByLabelText('Search packages')).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Should I adopt this plugin?' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Example frontend.*@example\/plugin-example/,
      }),
    );
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/plugins/example-plugin',
      search: '?package=%40example%2Fplugin-example&tab=readme',
      hash: '',
    });

    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example&tab=readme'),
    );
    view.rerender(
      <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
    );
    expect(screen.getByRole('tab', { name: 'README' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      await screen.findByText('README for @example/plugin-example'),
    ).toBeVisible();
    expect(
      screen.getByRole('navigation', { name: 'Packages' }),
    ).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent(
      'Plugin directoryExample PluginExample frontend',
    );

    await user.click(
      screen.getByRole('button', { name: /Example backend/ }),
    );
    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example-backend&tab=readme'),
    );
    view.rerender(
      <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Example backend' }),
    ).toHaveFocus();
    expect(
      await screen.findByText(
        'README for @example/plugin-example-backend',
      ),
    ).toBeVisible();
  });

  it('keeps configuration values while URL-driven tabs change', async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example&tab=readme'),
    );
    const view = renderPage();

    expect(
      await screen.findByText('README for @example/plugin-example'),
    ).toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'Configure' }));
    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example&tab=configure'),
    );
    view.rerender(
      <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
    );
    await user.type(
      await screen.findByLabelText(/^endpoint/),
      'https://api.example.com',
    );

    await user.click(screen.getByRole('tab', { name: 'README' }));
    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example&tab=readme'),
    );
    view.rerender(
      <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
    );
    await user.click(screen.getByRole('tab', { name: 'Configure' }));
    mockUseLocation.mockReturnValue(
      location('?package=%40example%2Fplugin-example&tab=configure'),
    );
    view.rerender(
      <PluginDetailPage plugin={plugin} latestBackstageVersion={null} />,
    );

    expect(screen.getByLabelText(/^endpoint/)).toHaveValue(
      'https://api.example.com',
    );
  });
});
