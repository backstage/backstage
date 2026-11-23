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
import type { PackagePresentation } from './packagePresentation';
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PackageNavigation } from './PackageNavigation';

function presentation(
  npmPackageName: string,
  label: string,
  group: PackagePresentation['group'],
  groupLabel: PackagePresentation['groupLabel'],
  maintainer?: PackagePresentation['maintainer'],
): PackagePresentation {
  return {
    npmPackageName,
    label,
    maintainer,
    group,
    groupLabel,
    functionality: undefined,
    snapshot: {
      npmPackageName,
      npm: {
        status: 'fresh',
        checkedAt: '2026-08-03T12:00:00.000Z',
        lastAttemptAt: '2026-08-03T12:00:00.000Z',
        latestVersion: '2.0.7',
        lastPublishedAt: '2026-07-14T00:00:00.000Z',
      },
    },
  };
}

const packages = [
  presentation(
    '@backstage/plugin-catalog',
    'Catalog frontend',
    'core',
    'Core experiences',
    'Core',
  ),
  presentation(
    '@backstage/plugin-catalog-backend',
    'Catalog backend',
    'core',
    'Core experiences',
    'Core',
  ),
  presentation(
    '@backstage/plugin-catalog-backend-module-github',
    'GitHub',
    'modules',
    'Extension modules',
  ),
  presentation(
    '@backstage-community/plugin-catalog-backend-module-ldap',
    'LDAP',
    'modules',
    'Extension modules',
    'Community',
  ),
  presentation(
    '@roadiehq/backstage-plugin-argo-cd',
    'Argo CD',
    'modules',
    'Extension modules',
    'Open source',
  ),
];

describe('PackageNavigation', () => {
  it('groups, filters, and selects packages without changing selection while searching', async () => {
    const user = userEvent.setup();
    const onSelectPackage = mock.fn();
    render(
      <PackageNavigation
        packages={packages}
        selectedPackageName="@backstage/plugin-catalog"
        onSelectPackage={onSelectPackage}
      />,
    );

    assert.ok(screen.getByRole('navigation', { name: 'Packages' }));
    assert.equal(
      screen
        .getByRole('button', { name: /Catalog frontend/ })
        .getAttribute('aria-current'),
      'page',
    );
    assert.ok(screen.getByRole('heading', { name: 'Core experiences' }));

    // Core and community packages carry a small badge, others have none.
    assert.ok(
      within(
        screen.getByRole('button', { name: /Catalog frontend/ }),
      ).getByText('Core'),
    );
    assert.ok(
      within(screen.getByRole('button', { name: /LDAP/ })).getByText(
        'Community',
      ),
    );
    assert.ok(
      within(screen.getByRole('button', { name: /Argo CD/ })).getByText(
        'Open source',
      ),
    );
    assert.equal(screen.getAllByText('Core').length, 2);
    assert.equal(screen.getAllByText('Community').length, 1);
    assert.equal(screen.getAllByText('Open source').length, 1);

    // Package names stay out of the list until a search is under way.
    assert.equal(screen.queryByText('@backstage/plugin-catalog-backend'), null);
    assert.ok(screen.getByRole('button', { name: 'GitHub' }));

    // Searching matches package names, which the label does not contain.
    await user.type(
      screen.getByRole('searchbox', { name: 'Search packages' }),
      'backend-module',
    );
    assert.ok(screen.getByRole('button', { name: /GitHub/ }));
    assert.ok(
      screen.getByText('@backstage/plugin-catalog-backend-module-github'),
    );
    assert.equal(
      screen.queryByRole('button', { name: /Catalog backend/ }),
      null,
    );
    assert.equal(onSelectPackage.mock.callCount(), 0);

    await user.click(screen.getByRole('button', { name: /GitHub/ }));
    assert.deepEqual(onSelectPackage.mock.calls.at(-1)?.arguments, [
      '@backstage/plugin-catalog-backend-module-github',
    ]);
  });

  it('reports an empty filtered result', async () => {
    const user = userEvent.setup();
    render(
      <PackageNavigation
        packages={packages}
        selectedPackageName="@backstage/plugin-catalog"
        onSelectPackage={mock.fn()}
      />,
    );
    await user.type(
      screen.getByRole('searchbox', { name: 'Search packages' }),
      'does-not-exist',
    );
    assert.ok(screen.getByText('No packages match your search'));
  });
});
