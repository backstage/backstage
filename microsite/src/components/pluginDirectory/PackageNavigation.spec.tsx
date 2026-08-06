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
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PackageNavigation } from './PackageNavigation';

function presentation(
  npmPackageName: string,
  label: string,
  group: PackagePresentation['group'],
  groupLabel: PackagePresentation['groupLabel'],
): PackagePresentation {
  return {
    npmPackageName,
    label,
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
  ),
  presentation(
    '@backstage/plugin-catalog-backend',
    'Catalog backend',
    'core',
    'Core experiences',
  ),
  presentation(
    '@backstage/plugin-catalog-backend-module-github',
    'GitHub module',
    'modules',
    'Extension modules',
  ),
];

describe('PackageNavigation', () => {
  it('groups, filters, and selects packages without changing selection while searching', async () => {
    const user = userEvent.setup();
    const onSelectPackage = jest.fn();
    render(
      <PackageNavigation
        packages={packages}
        selectedPackageName="@backstage/plugin-catalog"
        onSelectPackage={onSelectPackage}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Packages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Catalog frontend/ }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('heading', { name: 'Core experiences' }),
    ).toBeVisible();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search packages' }),
      'github',
    );
    expect(
      screen.getByRole('button', { name: /GitHub module/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /Catalog backend/ }),
    ).not.toBeInTheDocument();
    expect(onSelectPackage).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /GitHub module/ }));
    expect(onSelectPackage).toHaveBeenCalledWith(
      '@backstage/plugin-catalog-backend-module-github',
    );
  });

  it('reports an empty filtered result', async () => {
    const user = userEvent.setup();
    render(
      <PackageNavigation
        packages={packages}
        selectedPackageName="@backstage/plugin-catalog"
        onSelectPackage={jest.fn()}
      />,
    );
    await user.type(
      screen.getByRole('searchbox', { name: 'Search packages' }),
      'does-not-exist',
    );
    expect(screen.getByText('No packages match your search')).toBeVisible();
  });
});
