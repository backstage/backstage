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
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
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

function renderGuide(npmPackageName: string, backstageRole?: string) {
  return render(
    <InstallGuide
      packageSnapshot={packageSnapshot(npmPackageName, backstageRole)}
      primaryNpmPackageName={primaryNpmPackageName}
    />,
  );
}

describe('InstallGuide', () => {
  it('installs frontend packages into the app and explains how they are picked up', () => {
    for (const role of ['frontend-plugin', 'frontend-plugin-module']) {
      const { unmount } = renderGuide(primaryNpmPackageName, role);

      assert.ok(screen.getByRole('heading', { name: '1. Add the package' }));
      assert.ok(
        screen.getByText(
          `yarn --cwd packages/app add ${primaryNpmPackageName}`,
        ),
      );
      assert.ok(screen.getByRole('heading', { name: '2. Add it to the app' }));
      assert.ok(screen.getByText('feature discovery', { exact: false }));
      assert.ok(screen.getByText('packages/app/src/App.tsx'));
      assert.equal(
        screen
          .getByRole('link', { name: 'the package README' })
          .getAttribute('href'),
        `https://www.npmjs.com/package/${primaryNpmPackageName}#readme`,
      );
      assert.equal(screen.queryByText('packages/backend/src/index.ts'), null);
      assert.equal(screen.queryByRole('combobox', { name: 'Package' }), null);
      unmount();
    }

    // The role falls back to the package name when it isn't declared.
    renderGuide(primaryNpmPackageName);
    assert.ok(
      screen.getByText(`yarn --cwd packages/app add ${primaryNpmPackageName}`),
    );
  });

  it('installs backend plugins and modules into the backend and registers them', () => {
    const { rerender } = renderGuide(
      '@example/plugin-example-backend',
      'backend-plugin',
    );
    assert.ok(
      screen.getByText(
        'yarn --cwd packages/backend add @example/plugin-example-backend',
      ),
    );
    assert.ok(
      screen.getByRole('heading', { name: '2. Add it to the backend' }),
    );
    assert.ok(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend'));",
      ),
    );
    assert.equal(screen.queryByText('packages/app/src/App.tsx'), null);

    rerender(
      <InstallGuide
        packageSnapshot={packageSnapshot(
          '@example/plugin-example-backend-module-foo',
        )}
        primaryNpmPackageName={primaryNpmPackageName}
      />,
    );
    assert.ok(
      screen.getByText(
        'yarn --cwd packages/backend add @example/plugin-example-backend-module-foo',
      ),
    );
    assert.ok(
      screen.getByText(
        "backend.add(import('@example/plugin-example-backend-module-foo'));",
      ),
    );
  });

  it('points library packages at the package that uses them', () => {
    for (const [name, role] of [
      ['@example/plugin-example-common', undefined],
      ['@example/plugin-example-node', 'node-library'],
      ['@example/plugin-example-react', 'web-library'],
    ] as const) {
      const { unmount } = renderGuide(name, role);

      assert.ok(
        screen.getByText(
          'This is a library package; add it to the package that uses it.',
          { exact: false },
        ),
      );
      assert.ok(screen.getByText(`yarn --cwd <package-dir> add ${name}`));
      assert.equal(screen.queryByText('packages/app/src/App.tsx'), null);
      assert.equal(screen.queryByText('packages/backend/src/index.ts'), null);
      assert.equal(
        screen.queryByRole('link', { name: 'the package README' }),
        null,
      );
      unmount();
    }
  });

  it('never guesses a frontend install for an unknown role', () => {
    renderGuide('@example/unrelated-package');

    assert.ok(screen.getByText('This is a library package', { exact: false }));
    assert.ok(
      screen.getByText(
        'yarn --cwd <package-dir> add @example/unrelated-package',
      ),
    );
    assert.ok(screen.getByRole('link', { name: 'the package README' }));
    assert.equal(screen.queryByText('packages/app/src/App.tsx'), null);
    assert.equal(screen.queryByText('packages/backend/src/index.ts'), null);
  });

  it('copies the install command and announces the result', async () => {
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
    renderGuide(primaryNpmPackageName, 'frontend-plugin');

    await user.click(
      screen.getByRole('button', {
        name: 'Copy frontend-plugin install command',
      }),
    );
    assert.deepEqual(copiedValues, [
      `yarn --cwd packages/app add ${primaryNpmPackageName}`,
    ]);
    assert.ok(
      await screen.findByText('Copied frontend-plugin install command.'),
    );
  });
});
