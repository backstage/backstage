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

import { Inflate } from 'pako';
import { parseTar } from '../../src/pluginDirectory/tar';
import {
  ConfigSchemaLimitError,
  sanitizeConfigSchema,
} from './sanitizeConfigSchema';

const REGISTRY_HOST = 'registry.npmjs.org';
const MAX_TARBALL_BYTES = 10 * 1024 * 1024;
const MAX_UNPACKED_BYTES = 64 * 1024 * 1024;
const MAX_CONFIG_SCHEMA_SOURCE_BYTES = 1024 * 1024;

export type ConfigSchemaResult =
  | { status: 'fresh'; schema: Record<string, unknown> | undefined }
  | { status: 'unavailable'; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function gunzipWithLimit(gzipped: Uint8Array, maxBytes: number): Uint8Array {
  const chunks: Uint8Array[] = [];
  let total = 0;
  const inflate = new Inflate();
  inflate.onData = (chunk: Uint8Array) => {
    total += chunk.length;
    if (total > maxBytes) {
      throw new Error('Tarball is too large once unpacked');
    }
    chunks.push(chunk);
  };
  inflate.push(gzipped, true);
  if (inflate.err) {
    throw new Error(inflate.msg || 'Failed to unpack tarball');
  }

  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function fetchTarball(
  packageName: string,
  version: string,
  fetchImpl: typeof fetch,
): Promise<Uint8Array> {
  const versionResponse = await fetchImpl(
    `https://${REGISTRY_HOST}/${encodeURIComponent(
      packageName,
    )}/${encodeURIComponent(version)}`,
  );
  if (!versionResponse.ok) {
    throw new Error(`Registry responded ${versionResponse.status}`);
  }
  const versionDoc: unknown = await versionResponse.json();
  const tarballUrl =
    isRecord(versionDoc) && isRecord(versionDoc.dist)
      ? versionDoc.dist.tarball
      : undefined;
  if (typeof tarballUrl !== 'string') {
    throw new Error('Version document has no dist.tarball');
  }
  const parsedUrl = new URL(tarballUrl);
  if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== REGISTRY_HOST) {
    throw new Error(`Refusing to download a tarball from ${parsedUrl.host}`);
  }

  const tarballResponse = await fetchImpl(parsedUrl);
  if (!tarballResponse.ok) {
    throw new Error(`Tarball download responded ${tarballResponse.status}`);
  }
  const declaredLength = Number(tarballResponse.headers.get('content-length'));
  if (declaredLength > MAX_TARBALL_BYTES) {
    throw new Error('Tarball is too large');
  }
  const gzipped = new Uint8Array(await tarballResponse.arrayBuffer());
  if (gzipped.length > MAX_TARBALL_BYTES) {
    throw new Error('Tarball is too large');
  }
  return gunzipWithLimit(gzipped, MAX_UNPACKED_BYTES);
}

/**
 * Reads the JSON config schema a package declares through the `configSchema`
 * field of its package.json, and returns it sanitized for storage. A package
 * that declares no JSON schema yields a fresh result without a schema.
 */
export async function fetchConfigSchema(
  packageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ConfigSchemaResult> {
  let entries: Map<string, Uint8Array>;
  try {
    entries = parseTar(await fetchTarball(packageName, version, fetchImpl));
  } catch {
    return { status: 'unavailable', reason: 'config-schema-fetch-failed' };
  }

  try {
    const packageJsonBytes = entries.get('package/package.json');
    const packageJson: unknown = packageJsonBytes
      ? JSON.parse(new TextDecoder().decode(packageJsonBytes))
      : undefined;
    const declaredPath = isRecord(packageJson)
      ? packageJson.configSchema
      : undefined;
    if (typeof declaredPath !== 'string' || !declaredPath.endsWith('.json')) {
      return { status: 'fresh', schema: undefined };
    }

    const schemaBytes = entries.get(
      `package/${declaredPath.replace(/^\.\//, '')}`,
    );
    if (!schemaBytes) {
      return { status: 'fresh', schema: undefined };
    }
    if (schemaBytes.length > MAX_CONFIG_SCHEMA_SOURCE_BYTES) {
      return { status: 'unavailable', reason: 'config-schema-too-large' };
    }

    return {
      status: 'fresh',
      schema: sanitizeConfigSchema(
        JSON.parse(new TextDecoder().decode(schemaBytes)),
      ),
    };
  } catch (error) {
    return {
      status: 'unavailable',
      reason:
        error instanceof ConfigSchemaLimitError
          ? error.reason
          : 'config-schema-invalid',
    };
  }
}
