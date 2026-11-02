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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { copyPnpmWorkspaceFiles } from './pnpmWorkspaceFiles';

describe('copyPnpmWorkspaceFiles', () => {
  const mockDir = createMockDirectory();

  const copy = (settings: {
    patchedDependencies?: unknown;
    pnpmfile?: unknown;
  }) =>
    copyPnpmWorkspaceFiles({
      workspaceRootDir: mockDir.resolve('project'),
      targetDir: mockDir.resolve('target'),
      settings,
      targetName: 'the target',
    });

  it('copies patches and pnpmfiles under names that do not collide', async () => {
    mockDir.setContent({
      'shared-a/fix.patch': 'a',
      'shared-b/Fix.patch': 'b',
      'shared-b/hooks.cjs': 'outside hooks',
      'project/patches/fix.patch': 'inside',
      'project/hooks/hooks.cjs': 'inside hooks',
      'project/.pnpmfile.cjs': 'default hooks',
      target: { 'fix.patch': 'unrelated' },
    });

    await expect(
      copy({
        patchedDependencies: {
          'a@1.0.0': '../shared-a/fix.patch',
          'a@2.0.0': '../shared-a/fix.patch',
          'b@1.0.0': mockDir.resolve('shared-b/Fix.patch'),
          'c@1.0.0': 'patches/fix.patch',
          'd@1.0.0': 'patches/missing.patch',
          'e@1.0.0': true,
        },
        pnpmfile: ['hooks/hooks.cjs', '../shared-b/hooks.cjs', 'missing.cjs'],
      }),
    ).resolves.toEqual({
      files: [
        'patches/fix.patch',
        'hooks/hooks.cjs',
        'patches/fix-2.patch',
        'patches/Fix-3.patch',
        'hooks.cjs',
      ],
      patchedDependencies: {
        'a@1.0.0': 'patches/fix-2.patch',
        'a@2.0.0': 'patches/fix-2.patch',
        'b@1.0.0': 'patches/Fix-3.patch',
        'c@1.0.0': 'patches/fix.patch',
      },
      missingPatches: [
        {
          name: 'd@1.0.0',
          path: mockDir.resolve('project/patches/missing.patch'),
        },
      ],
      pnpmfile: ['hooks/hooks.cjs', 'hooks.cjs'],
    });
    expect(mockDir.content({ path: 'target', shouldReadAsText: true })).toEqual(
      {
        'fix.patch': 'unrelated',
        patches: {
          'fix.patch': 'inside',
          'fix-2.patch': 'a',
          'Fix-3.patch': 'b',
        },
        hooks: { 'hooks.cjs': 'inside hooks' },
        'hooks.cjs': 'outside hooks',
      },
    );

    // A single pnpmfile setting stays a single path, and copying again into
    // the same directory gives the same names
    mockDir.setContent({
      'shared/hooks.mjs': 'hooks',
      target: { 'hooks.mjs': 'earlier copy' },
    });
    await expect(copy({ pnpmfile: '../shared/hooks.mjs' })).resolves.toEqual({
      files: ['hooks.mjs'],
      patchedDependencies: {},
      missingPatches: [],
      pnpmfile: 'hooks.mjs',
    });

    // Without the setting, pnpm loads .pnpmfile.mjs, or else .pnpmfile.cjs,
    // which keep their names
    mockDir.setContent({
      'project/.pnpmfile.cjs': 'cjs',
      'project/.pnpmfile.mjs': 'mjs',
      target: {},
    });
    await expect(copy({})).resolves.toEqual({
      files: ['.pnpmfile.mjs'],
      patchedDependencies: {},
      missingPatches: [],
      pnpmfile: undefined,
    });
    mockDir.setContent({ 'project/.pnpmfile.cjs': 'cjs', target: {} });
    await expect(copy({})).resolves.toMatchObject({
      files: ['.pnpmfile.cjs'],
    });
  });

  it('fails when a pnpmfile loads other local files', async () => {
    mockDir.setContent({
      'project/.pnpmfile.cjs': `// require('./commented-out.cjs')
const path = require('node:path');
const { readPackage } = require('./hooks/read-package.cjs');
module.exports = { hooks: { readPackage } };
`,
      target: {},
    });
    await expect(copy({})).rejects.toThrow(
      'The pnpmfile .pnpmfile.cjs loads ./hooks/read-package.cjs, but only the pnpmfile itself is copied into the target. Move that code into the pnpmfile.',
    );

    mockDir.setContent({
      'project/hooks.mjs': `import lodash from 'lodash';
import { a } from "../shared/a.mjs";
export const hooks = { readPackage: pkg => import('./b.mjs').then(() => pkg) };
`,
      target: {},
    });
    await expect(copy({ pnpmfile: ['hooks.mjs'] })).rejects.toThrow(
      'The pnpmfile hooks.mjs loads ../shared/a.mjs, ./b.mjs, but only the pnpmfile itself is copied',
    );

    // Packages and imports in comments are fine
    mockDir.setContent({
      'project/hooks.cjs': `/* const local = require('./local.cjs'); */
const lodash = require('lodash'); // require('./local.cjs')
module.exports = { hooks: {} };
`,
      target: {},
    });
    await expect(copy({ pnpmfile: 'hooks.cjs' })).resolves.toMatchObject({
      files: ['hooks.cjs'],
    });
  });
});
