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
    ],
  },
};

describe('PluginDetailPage', () => {
  beforeEach(() => {
    mockFetchPackageConfigSchema.mockReset();
    mockFetchPackageReadme.mockReset();
    mockFetchPackageConfigSchema.mockResolvedValue({
      status: 'ready',
      value: endpointSchema,
    });
    mockFetchPackageReadme.mockResolvedValue({
      status: 'ready',
      value: undefined,
    });
  });

  it('renders the header and all three tabs', async () => {
    render(<PluginDetailPage plugin={plugin} latestBackstageVersion={null} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Example Plugin',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configure' })).toBeInTheDocument();
    // Both tabs' schema/README fetches settle in the background even though
    // only Overview is visible (Tabs mounts all TabItems); wait for them so
    // the test doesn't finish before act() sees the resulting state update.
    await screen.findByLabelText(/^endpoint/);
  });

  it('keeps configuration form values after switching tabs away and back', async () => {
    const user = userEvent.setup();
    render(<PluginDetailPage plugin={plugin} latestBackstageVersion={null} />);

    await user.click(screen.getByRole('tab', { name: 'Configure' }));
    await user.type(
      await screen.findByLabelText(/^endpoint/),
      'https://api.example.com',
    );

    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    await user.click(screen.getByRole('tab', { name: 'Configure' }));

    expect(screen.getByLabelText(/^endpoint/)).toHaveValue(
      'https://api.example.com',
    );
  });
});
