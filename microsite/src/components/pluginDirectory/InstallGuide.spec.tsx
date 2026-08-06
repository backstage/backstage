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
import type { PackageSnapshot } from '../../pluginDirectory/manifest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallGuide } from './InstallGuide';

function packageSnapshot(
  npmPackageName: string,
  backstageRole?: string,
): PackageSnapshot {
  return {
    npmPackageName,
    npm: {
      status: 'fresh',
      checkedAt: '2026-08-03T12:00:00.000Z',
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      latestVersion: '1.0.0',
      lastPublishedAt: '2026-07-01T00:00:00.000Z',
      backstageRole,
    },
  };
}

const primaryNpmPackageName = '@example/plugin-example';

describe('InstallGuide', () => {
  it('shows a focused frontend install step without package selection', () => {
    render(
      <InstallGuide
        packageSnapshot={packageSnapshot(
          primaryNpmPackageName,
          'frontend-plugin',
        )}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    expect(
      screen.getByRole('heading', { name: '1. Add the package' }),
    ).toBeVisible();
    expect(
      screen.getByText(`yarn add ${primaryNpmPackageName}`),
    ).toBeVisible();
    expect(
      screen.queryByText('packages/backend/src/index.ts', { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Package' }),
    ).not.toBeInTheDocument();
  });

  it('adds the backend wiring step for backend plugins and modules', () => {
    const backendPackage = packageSnapshot(
      '@example/plugin-example-backend',
      'backend-plugin',
    );
    const { rerender } = render(
      <InstallGuide
        packageSnapshot={backendPackage}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    expect(
      screen.getByRole('heading', { name: '2. Add it to the backend' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend'));",
      ),
    ).toBeVisible();

    rerender(
      <InstallGuide
        packageSnapshot={packageSnapshot(
          '@example/plugin-example-backend-module-foo',
        )}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );
    expect(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend-module-foo'));",
      ),
    ).toBeVisible();
  });

  it('copies the selected package command and announces the result', async () => {
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
    render(
      <InstallGuide
        packageSnapshot={packageSnapshot(
          primaryNpmPackageName,
          'frontend-plugin',
        )}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Copy frontend-plugin install command' }),
    );
    expect(copiedValues).toEqual([`yarn add ${primaryNpmPackageName}`]);
    expect(
      await screen.findByText('Copied frontend-plugin install command.'),
    ).toBeVisible();
  });
});
