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
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PluginData } from '../../pluginDirectory/plugin';
import { routerMock } from '../../testUtils/docusaurusMocks/router';
import { mockUnpkgReadmes } from '../../testUtils/mockUnpkg';
import PluginDetailPage from './PluginDetailPage';

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

function location(search = '', hash = '') {
  return {
    pathname: '/plugins/example-plugin',
    search,
    hash,
  };
}

function renderPage() {
  return render(
    <PluginDetailPage
      plugin={plugin}
      latestBackstageVersion={{ version: null }}
    />,
  );
}

describe('PluginDetailPage', () => {
  beforeEach(() => {
    routerMock.reset(location());
    mockUnpkgReadmes(name => `README for ${name}`);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('opens the primary package workspace by default and switches packages', async () => {
    const user = userEvent.setup();
    const view = renderPage();

    assert.ok(
      screen
        .getByRole('heading', { level: 1 })
        .textContent?.includes('Example Plugin'),
    );
    assert.ok(screen.getByRole('navigation', { name: 'Packages' }));
    assert.ok(screen.getByLabelText('Search packages'));
    assert.equal(
      screen.getByRole('tab', { name: 'README' }).getAttribute('aria-selected'),
      'true',
    );
    assert.ok(screen.getByRole('heading', { name: 'Example frontend' }));
    assert.ok(await screen.findByText('README for @example/plugin-example'));
    assert.ok(
      screen
        .getByRole('navigation', { name: 'Breadcrumb' })
        .textContent?.includes(
          'Plugin directoryExample PluginExample frontend',
        ),
    );
    assert.equal(routerMock.push.mock.callCount(), 0);

    await user.click(screen.getByRole('button', { name: /Example backend/ }));
    assert.equal(routerMock.replace.mock.callCount(), 0);
    assert.deepEqual(routerMock.push.mock.calls.at(-1)?.arguments, [
      {
        pathname: '/plugins/example-plugin',
        search: '?package=%40example%2Fplugin-example-backend',
        hash: '',
      },
    ]);
    routerMock.location = location(
      '?package=%40example%2Fplugin-example-backend',
    );
    view.rerender(
      <PluginDetailPage
        plugin={plugin}
        latestBackstageVersion={{ version: null }}
      />,
    );
    assert.equal(
      document.activeElement,
      screen.getByRole('heading', { name: 'Example backend' }),
    );
    assert.ok(
      await screen.findByText('README for @example/plugin-example-backend'),
    );
  });

  it('switches tabs through the URL hash', async () => {
    const user = userEvent.setup();
    routerMock.location = location(
      '?package=%40example%2Fplugin-example',
      '#readme',
    );
    const view = renderPage();

    assert.equal(
      screen.getByRole('tab', { name: 'README' }).getAttribute('aria-selected'),
      'true',
    );
    assert.equal(screen.queryByRole('tab', { name: 'Configure' }), null);

    await user.click(screen.getByRole('tab', { name: 'Install' }));
    // Tab switches replace the history entry rather than adding one.
    assert.equal(routerMock.push.mock.callCount(), 0);
    assert.deepEqual(routerMock.replace.mock.calls.at(-1)?.arguments, [
      {
        pathname: '/plugins/example-plugin',
        search: '?package=%40example%2Fplugin-example',
        hash: '#install',
      },
    ]);
    routerMock.location = location(
      '?package=%40example%2Fplugin-example',
      '#install',
    );
    view.rerender(
      <PluginDetailPage
        plugin={plugin}
        latestBackstageVersion={{ version: null }}
      />,
    );
    assert.equal(
      screen
        .getByRole('tab', { name: 'Install' })
        .getAttribute('aria-selected'),
      'true',
    );
    assert.ok(
      screen.getByText('yarn --cwd packages/app add @example/plugin-example'),
    );
  });
});
