import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import React from 'react';
import { render, screen } from '@testing-library/react';
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import { mockUnpkgReadmes } from '../../testUtils/mockUnpkg';
import { PackageReadme } from './PackageReadme';

function packageSnapshot(
  npmPackageName: string,
  version = '1.0.0',
): PackageSnapshot {
  return {
    npmPackageName,
    npm: {
      status: 'fresh',
      lastAttemptAt: '2026-01-01T00:00:00.000Z',
      checkedAt: '2026-01-01T00:00:00.000Z',
      latestVersion: version,
      lastPublishedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

const frontendPackage = packageSnapshot('@example/plugin-example');
const backendPackage = packageSnapshot(
  '@example/plugin-example-backend',
  '2.0.0',
);

afterEach(() => {
  mock.restoreAll();
});

describe('PackageReadme', () => {
  it('loads only the supplied package and follows it across rerenders', async () => {
    const fetchMock = mockUnpkgReadmes(name => `README for ${name}`);

    const { rerender } = render(
      <PackageReadme packageSnapshot={frontendPackage} />,
    );
    assert.ok(await screen.findByText('README for @example/plugin-example'));
    assert.equal(
      String(fetchMock.mock.calls[0].arguments[0]),
      'https://unpkg.com/@example/plugin-example@1.0.0/?meta',
    );

    // The previous README is replaced by the loading state straight away.
    rerender(<PackageReadme packageSnapshot={backendPackage} />);
    assert.equal(
      screen.queryByText('README for @example/plugin-example'),
      null,
    );
    assert.ok(screen.getByRole('status'));
    assert.ok(
      await screen.findByText('README for @example/plugin-example-backend'),
    );
    assert.equal(
      String(fetchMock.mock.calls.at(-1)?.arguments[0]),
      'https://unpkg.com/@example/plugin-example-backend@2.0.0/README.md',
    );
    assert.equal(screen.queryByRole('combobox', { name: 'Package' }), null);
  });

  it('distinguishes absent, unavailable, and failed README data', async () => {
    const readmes = new Map<string, string | undefined | Error>([
      ['@example/plugin-example', undefined],
      ['@example/plugin-example-backend', new Error('boom')],
    ]);
    const fetchMock = mockUnpkgReadmes(name => readmes.get(name));
    const consoleError = mock.method(console, 'error', () => {});

    const { rerender } = render(
      <PackageReadme packageSnapshot={frontendPackage} />,
    );
    assert.ok(
      await screen.findByText('No README is available for this package.'),
    );

    rerender(<PackageReadme packageSnapshot={backendPackage} />);
    assert.equal(
      (await screen.findByRole('alert')).textContent,
      'The package README could not be loaded.',
    );
    assert.equal(consoleError.mock.callCount(), 1);

    fetchMock.mock.resetCalls();
    const unavailablePackage: PackageSnapshot = {
      npmPackageName: '@example/plugin-unavailable',
      npm: {
        status: 'unavailable',
        lastAttemptAt: '2026-01-01T00:00:00.000Z',
        reason: 'npm-not-found',
      },
    };
    rerender(<PackageReadme packageSnapshot={unavailablePackage} />);
    assert.ok(screen.getByText('No README is available for this package.'));
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('resolves relative links and only loads images from allowed hosts', async () => {
    mockUnpkgReadmes(() =>
      [
        '[Guide](docs/guide.md) [Site](https://example.com/) [Bad](javascript:alert(1))',
        '',
        '![Relative](docs/screenshot.png)',
        '![Badge](https://img.shields.io/npm/v/x.svg)',
        '![Tracker](https://tracker.example.com/pixel.png)',
        '[![Linked tracker](https://tracker.example.com/linked.png)](https://example.com/page)',
      ].join('\n'),
    );

    const { container } = render(
      <PackageReadme packageSnapshot={frontendPackage} />,
    );
    const guide = await screen.findByRole('link', { name: 'Guide' });

    assert.equal(
      guide.getAttribute('href'),
      'https://unpkg.com/@example/plugin-example@1.0.0/docs/guide.md',
    );
    assert.equal(
      screen.getByRole('link', { name: 'Site' }).getAttribute('href'),
      'https://example.com/',
    );
    assert.ok(!screen.getByText('Bad').closest('a')?.getAttribute('href'));

    const images = [...container.querySelectorAll('img')].map(img => [
      img.getAttribute('alt'),
      img.getAttribute('src'),
    ]);
    assert.deepEqual(images, [
      [
        'Relative',
        'https://unpkg.com/@example/plugin-example@1.0.0/docs/screenshot.png',
      ],
      ['Badge', 'https://img.shields.io/npm/v/x.svg'],
    ]);

    // Other images become links, except inside a link where that isn't valid.
    assert.equal(
      screen.getByRole('link', { name: 'Tracker' }).getAttribute('href'),
      'https://tracker.example.com/pixel.png',
    );
    assert.equal(container.querySelector('a a'), null);
    assert.equal(
      screen.getByText('Linked tracker').closest('a')?.getAttribute('href'),
      'https://example.com/page',
    );
  });
});
