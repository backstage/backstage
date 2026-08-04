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
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extract } from 'tar';
import type { ConfigSchemaSnapshot } from '../../src/pluginDirectory/manifest';

type UnavailableReason = Extract<
  ConfigSchemaSnapshot,
  { status: 'unavailable' }
>['reason'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unavailable(
  lastAttemptAt: string,
  reason: UnavailableReason,
): ConfigSchemaSnapshot {
  return { status: 'unavailable', lastAttemptAt, reason };
}

export async function fetchConfigSchemaSnapshot(
  packageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ConfigSchemaSnapshot> {
  const lastAttemptAt = new Date().toISOString();

  let versionResponse: Response;
  try {
    versionResponse = await fetchImpl(
      `https://registry.npmjs.org/${encodeURIComponent(
        packageName,
      )}/${encodeURIComponent(version)}`,
    );
  } catch {
    return unavailable(lastAttemptAt, 'npm-request-failed');
  }

  if (!versionResponse.ok) {
    return unavailable(
      lastAttemptAt,
      versionResponse.status === 404 ? 'npm-not-found' : 'npm-invalid-response',
    );
  }

  let versionBody: unknown;
  try {
    versionBody = await versionResponse.json();
  } catch {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  if (!isRecord(versionBody) || !isRecord(versionBody.dist)) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  const tarballUrl = versionBody.dist.tarball;
  if (typeof tarballUrl !== 'string' || tarballUrl.length === 0) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  let tarballBuffer: Buffer;
  try {
    const tarballResponse = await fetchImpl(tarballUrl);
    if (!tarballResponse.ok) {
      return unavailable(lastAttemptAt, 'tarball-download-failed');
    }
    tarballBuffer = Buffer.from(await tarballResponse.arrayBuffer());
  } catch {
    return unavailable(lastAttemptAt, 'tarball-download-failed');
  }

  const packageDirectory = await mkdtemp(
    join(tmpdir(), 'plugin-config-schema-'),
  );
  try {
    const tarballPath = join(packageDirectory, 'package.tgz');
    await writeFile(tarballPath, Uint8Array.from(tarballBuffer));

    try {
      await extract({ file: tarballPath, cwd: packageDirectory });
    } catch {
      return unavailable(lastAttemptAt, 'tarball-extract-failed');
    }

    let packageJson: unknown;
    try {
      packageJson = JSON.parse(
        await readFile(
          join(packageDirectory, 'package', 'package.json'),
          'utf8',
        ),
      );
    } catch {
      return unavailable(lastAttemptAt, 'tarball-extract-failed');
    }

    if (!isRecord(packageJson)) {
      return unavailable(lastAttemptAt, 'tarball-extract-failed');
    }

    const configSchemaPath = packageJson.configSchema;
    if (
      typeof configSchemaPath !== 'string' ||
      configSchemaPath.length === 0
    ) {
      return unavailable(lastAttemptAt, 'config-schema-not-declared');
    }

    if (!configSchemaPath.endsWith('.json')) {
      return unavailable(lastAttemptAt, 'config-schema-not-json');
    }

    let schema: unknown;
    try {
      schema = JSON.parse(
        await readFile(
          join(packageDirectory, 'package', configSchemaPath),
          'utf8',
        ),
      );
    } catch {
      return unavailable(lastAttemptAt, 'config-schema-read-failed');
    }

    return {
      status: 'fresh',
      lastAttemptAt,
      checkedAt: lastAttemptAt,
      schema,
    };
  } finally {
    await rm(packageDirectory, { recursive: true, force: true });
  }
}
