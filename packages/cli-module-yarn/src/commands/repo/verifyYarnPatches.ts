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

import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { cli } from 'cleye';
import {
  verifyYarnPatches,
  type PatchVerificationError,
} from '../../lib/verifyYarnPatches';

function formatPatchReferenceCount(patchCount: number): string {
  return `${patchCount} patch reference${patchCount === 1 ? '' : 's'}`;
}

function formatError(error: PatchVerificationError): string {
  const location = error.location ? `${error.location} ` : '';
  return `  ${location}[${error.kind}]: ${error.message}\n`;
}

export default async ({ args, info }: CliCommandContext) => {
  cli({ name: info.usage }, undefined, args);

  const result = await verifyYarnPatches({
    rootDir: targetPaths.dir,
    env: process.env,
    fetch: globalThis.fetch,
  });

  if (result.errors.length > 0) {
    process.stderr.write('Yarn patch verification failed:\n');
    for (const error of result.errors) {
      process.stderr.write(formatError(error));
    }
    throw new Error('Yarn patch verification failed');
  }

  const patchSummary =
    result.patchCount === 0
      ? 'no patch references found'
      : `${formatPatchReferenceCount(result.patchCount)} verified`;
  const backstageSummary =
    result.backstageCheck === 'verified'
      ? 'Backstage release validation passed'
      : 'Backstage release validation was skipped';
  process.stdout.write(
    `Yarn patch verification passed: ${patchSummary}. ${backstageSummary}.\n`,
  );
};
