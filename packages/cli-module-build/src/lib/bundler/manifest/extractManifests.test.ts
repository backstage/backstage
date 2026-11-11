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

import { extractManifests } from './extractManifests';

const fixtures = (name: string) => require.resolve(`./__fixtures__/${name}`);

describe('extractManifests', () => {
  it('extracts manifests in a child process and reports failures per package', async () => {
    const results = await extractManifests({
      appDir: __dirname,
      packages: [
        { key: 'pages', import: fixtures('pagesPlugin') },
        { key: 'empty', import: fixtures('emptyPlugin') },
        { key: 'throwing', import: fixtures('throwingPlugin') },
        { key: 'crashing', import: fixtures('crashingPlugin') },
        { key: 'after-crash', import: fixtures('pagesPlugin') },
      ],
    });

    expect(results.get('pages')).toEqual({
      manifest: expect.objectContaining({
        manifestVersion: 1,
        type: 'plugin',
        pluginId: 'fixture-pages',
        deferrable: true,
        extensions: [expect.objectContaining({ id: 'page:fixture-pages' })],
      }),
    });
    expect(results.get('empty')).toEqual({ skipped: 'no default export' });
    expect(results.get('throwing')).toEqual({
      error: expect.stringContaining('fixture plugin failed to load'),
    });
    // A crash is reported for the package that crashed and for all the
    // packages that never got to report a result
    for (const key of ['crashing', 'after-crash']) {
      expect(results.get(key)).toEqual({
        error: expect.stringContaining('exited with exit code 3'),
      });
    }
  });

  it('kills the child process when a package takes too long', async () => {
    const results = await extractManifests({
      appDir: __dirname,
      packageTimeoutMs: 500,
      packages: [{ key: 'hanging', import: fixtures('hangingPlugin') }],
    });

    expect(results.get('hanging')).toEqual({
      error: expect.stringMatching(/timed out after 500ms|signal SIGKILL/),
    });
  });
});
