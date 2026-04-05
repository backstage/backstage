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

import { runCheck } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';

function includesAnyOf(hayStack: string[], ...needles: string[]) {
  for (const needle of needles) {
    if (hayStack.includes(needle)) {
      return true;
    }
  }
  return false;
}

export default async ({ args }: CliCommandContext) => {
  if (
    !process.env.CI &&
    !includesAnyOf(args, '--coverage', '--coverage.enabled') &&
    !includesAnyOf(args, '--run') &&
    !includesAnyOf(args, '--watch')
  ) {
    const isGitRepo = () =>
      runCheck(['git', 'rev-parse', '--is-inside-work-tree']);
    const isMercurialRepo = () => runCheck(['hg', '--cwd', '.', 'root']);

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      args.push('--watch');
    }
  }

  if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test';
  }

  if (!process.env.TZ) {
    process.env.TZ = 'UTC';
  }

  if (!process.env.NODE_OPTIONS?.includes('--node-snapshot')) {
    process.env.NODE_OPTIONS = `${
      process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ''
    }--no-node-snapshot`;
  }

  try {
    require.resolve('vitest');
  } catch {
    console.error(
      [
        'No Vitest installation found in this project.',
        '',
        'The Backstage CLI expects Vitest to be installed as a devDependency.',
        'Run: yarn add --dev vitest',
      ].join('\n'),
    );
    process.exit(1);
  }

  // eslint-disable-next-line @backstage/no-undeclared-imports
  const { parseCLI, startVitest } = await import('vitest/node');

  const { options, filter } = parseCLI(['vitest', ...args]);

  const vitest = await startVitest('test', filter, {
    passWithNoTests: true,
    ...options,
  });

  if (vitest) {
    await vitest.close();
  }
};
