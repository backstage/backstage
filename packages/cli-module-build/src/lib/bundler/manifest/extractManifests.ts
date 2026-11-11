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

import spawn from 'cross-spawn';
import { dirname } from 'node:path';
import { MANIFEST_RESULT_MARKER, ManifestWorkerInput } from './protocol';

/**
 * A subset of the manifest type from `@backstage/frontend-app-api/alpha`. The
 * type is not imported since the app is the one that decides which version of
 * the manifest code is used.
 */
export interface ExtractedManifest {
  manifestVersion: 1;
  type: 'plugin' | 'module';
  pluginId: string;
  deferrable: boolean;
  notDeferrableReason?: string;
  [key: string]: unknown;
}

export type ExtractionResult =
  | { manifest: ExtractedManifest }
  | { skipped: string }
  | { error: string };

export interface ExtractManifestsOptions {
  /** The directory of the app, used to resolve the packages to extract */
  appDir: string;
  /** The packages to extract manifests from, `key` identifies the result */
  packages: Array<{ key: string; import: string; syncImport?: string }>;
  /** The time to allow for each package, in milliseconds */
  packageTimeoutMs?: number;
}

const DEFAULT_PACKAGE_TIMEOUT_MS = 30_000;

/**
 * Extracts manifests for the given packages in a single child Node.js process.
 *
 * @remarks
 *
 * This never throws. Packages that did not report a result, for example
 * because the process crashed or timed out, get an error result.
 */
export async function extractManifests(
  options: ExtractManifestsOptions,
): Promise<Map<string, ExtractionResult>> {
  const timeoutMs = options.packageTimeoutMs ?? DEFAULT_PACKAGE_TIMEOUT_MS;
  const results = new Map<string, ExtractionResult>();
  if (options.packages.length === 0) {
    return results;
  }

  let failure: string | undefined;
  try {
    failure = await runChild(options, timeoutMs, results);
  } catch (error) {
    failure = String(error);
  }

  for (const pkg of options.packages) {
    if (!results.has(pkg.key)) {
      results.set(pkg.key, {
        error: failure ?? 'no result was reported for the package',
      });
    }
  }
  return results;
}

function runChild(
  options: ExtractManifestsOptions,
  timeoutMs: number,
  results: Map<string, ExtractionResult>,
): Promise<string | undefined> {
  const nodeTransformPath = require.resolve(
    '@backstage/cli-node/config/nodeTransform.cjs',
  );
  // Resolves to the source file in the workspace and the built file when
  // published, see the exports of this package.
  const workerPath = require.resolve(
    '@backstage/cli-module-build/manifestWorker',
  );
  const input: ManifestWorkerInput = {
    appDir: options.appDir,
    transformDir: dirname(nodeTransformPath),
    packages: options.packages,
    timeoutMs,
  };
  return new Promise(resolve => {
    const child = spawn(
      process.execPath,
      ['--require', nodeTransformPath, workerPath],
      {
        cwd: options.appDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: 'development',
          BACKSTAGE_MANIFEST_INPUT: JSON.stringify(input),
        },
      },
    );

    let buffer = '';
    let stderr = '';
    const handleLine = (line: string) => {
      if (!line.startsWith(MANIFEST_RESULT_MARKER)) {
        return;
      }
      try {
        const { key, ...result } = JSON.parse(
          line.slice(MANIFEST_RESULT_MARKER.length),
        );
        results.set(key, result);
      } catch {
        // ignore malformed lines, the package will be reported as failed
      }
    };

    child.stdout?.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      lines.forEach(handleLine);
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      if (stderr.length < 2000) {
        stderr += chunk.toString('utf8');
      }
    });

    // A synchronous hang inside plugin code can't be caught in the child, so
    // there's also an overall limit after which the child is killed.
    const overall = setTimeout(() => {
      child.kill('SIGKILL');
    }, timeoutMs * (options.packages.length + 1));

    child.on('error', error => {
      clearTimeout(overall);
      resolve(`failed to start manifest extraction: ${error.message}`);
    });
    child.on('close', (code, signal) => {
      clearTimeout(overall);
      handleLine(buffer);
      if (code === 0) {
        resolve(undefined);
      } else {
        const reason = signal ? `signal ${signal}` : `exit code ${code}`;
        resolve(
          `manifest extraction exited with ${reason}${
            stderr
              ? `: ${stderr.trim().split('\n').slice(0, 3).join(' | ')}`
              : ''
          }`,
        );
      }
    });
  });
}
