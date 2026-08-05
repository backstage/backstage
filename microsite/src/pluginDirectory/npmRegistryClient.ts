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
import { ungzip } from 'pako';
import { parseTar } from './tar';

// The literal string the npm registry returns in place of a real README when
// a package has none.
const README_PLACEHOLDER = 'ERROR: No README data found!';

export type RegistryResult<T> =
  | { status: 'ready'; value: T | undefined } // undefined = declared-none-found
  | { status: 'error'; error: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function fetchVersionDoc(
  npmPackageName: string,
  version: string,
  fetchImpl: typeof fetch,
): Promise<unknown> {
  const response = await fetchImpl(
    `https://registry.npmjs.org/${encodeURIComponent(
      npmPackageName,
    )}/${encodeURIComponent(version)}`,
  );
  if (!response.ok) {
    throw new Error(
      `registry.npmjs.org responded ${response.status} for ${npmPackageName}@${version}`,
    );
  }
  return await response.json();
}

export async function fetchPackageReadme(
  npmPackageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RegistryResult<string>> {
  try {
    const versionDoc = await fetchVersionDoc(
      npmPackageName,
      version,
      fetchImpl,
    );
    const readme = isRecord(versionDoc) ? versionDoc.readme : undefined;
    if (
      typeof readme !== 'string' ||
      readme.length === 0 ||
      readme === README_PLACEHOLDER
    ) {
      return { status: 'ready', value: undefined };
    }
    return { status: 'ready', value: readme };
  } catch (error) {
    return { status: 'error', error };
  }
}

export async function fetchPackageConfigSchema(
  npmPackageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RegistryResult<unknown>> {
  try {
    const versionDoc = await fetchVersionDoc(
      npmPackageName,
      version,
      fetchImpl,
    );
    const tarballUrl =
      isRecord(versionDoc) && isRecord(versionDoc.dist)
        ? versionDoc.dist.tarball
        : undefined;
    if (typeof tarballUrl !== 'string' || tarballUrl.length === 0) {
      throw new Error(
        `registry.npmjs.org version doc for ${npmPackageName}@${version} has no dist.tarball`,
      );
    }

    const tarballResponse = await fetchImpl(tarballUrl);
    if (!tarballResponse.ok) {
      throw new Error(
        `Failed to download tarball for ${npmPackageName}@${version}: ${tarballResponse.status}`,
      );
    }
    const gzipped = new Uint8Array(await tarballResponse.arrayBuffer());
    const entries = parseTar(ungzip(gzipped));

    const packageJsonBytes = entries.get('package/package.json');
    if (!packageJsonBytes) {
      return { status: 'ready', value: undefined };
    }
    const packageJson = JSON.parse(new TextDecoder().decode(packageJsonBytes));
    const configSchemaPath = isRecord(packageJson)
      ? packageJson.configSchema
      : undefined;
    if (
      typeof configSchemaPath !== 'string' ||
      !configSchemaPath.endsWith('.json')
    ) {
      return { status: 'ready', value: undefined };
    }

    const normalizedPath = configSchemaPath.replace(/^\.\//, '');
    const schemaBytes = entries.get(`package/${normalizedPath}`);
    if (!schemaBytes) {
      return { status: 'ready', value: undefined };
    }
    return {
      status: 'ready',
      value: JSON.parse(new TextDecoder().decode(schemaBytes)),
    };
  } catch (error) {
    return { status: 'error', error };
  }
}
