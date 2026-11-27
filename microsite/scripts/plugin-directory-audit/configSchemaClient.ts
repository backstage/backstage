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

import {
  ConfigSchemaLimitError,
  sanitizeConfigSchema,
} from './sanitizeConfigSchema';
import { fetchTimeoutSignal } from './fetchTimeout';

const UNPKG_HOST = 'unpkg.com';
const MAX_FILE_BYTES = 1024 * 1024;

const PACKAGE_NAME_PATTERN =
  /^(@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*$/;
const VERSION_PATTERN = /^[0-9A-Za-z][0-9A-Za-z.+-]*$/;

export type ConfigSchemaResult =
  | { status: 'fresh'; schema: Record<string, unknown> | undefined }
  | { status: 'unavailable'; reason: string };

class FileTooLargeError extends Error {}
class FileNotFoundError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Turns the path a package.json declares into URL path segments, or returns
// undefined for anything that is not a plain relative path inside the package.
function toPathSegments(declaredPath: string): string[] | undefined {
  const segments = declaredPath.replace(/^\.\//, '').split('/');
  const isPlain = segments.every(
    segment =>
      segment.length > 0 &&
      segment !== '.' &&
      segment !== '..' &&
      !/[\\:?#%]/.test(segment),
  );
  return isPlain ? segments : undefined;
}

// Reads a response body as text, giving up as soon as it grows past the limit.
async function readLimitedText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (declaredLength > MAX_FILE_BYTES) {
    throw new FileTooLargeError();
  }
  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).length > MAX_FILE_BYTES) {
      throw new FileTooLargeError();
    }
    return text;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.length;
    if (total > MAX_FILE_BYTES) {
      await reader.cancel();
      throw new FileTooLargeError();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(bytes);
}

async function fetchUnpkgFile(
  packageName: string,
  version: string,
  segments: string[],
  fetchImpl: typeof fetch,
): Promise<string> {
  if (
    !PACKAGE_NAME_PATTERN.test(packageName) ||
    !VERSION_PATTERN.test(version)
  ) {
    throw new Error(`Invalid package ${packageName}@${version}`);
  }
  const url = new URL(
    `https://${UNPKG_HOST}/${packageName}@${version}/${segments
      .map(encodeURIComponent)
      .join('/')}`,
  );
  if (url.protocol !== 'https:' || url.hostname !== UNPKG_HOST) {
    throw new Error(`Refusing to download from ${url.host}`);
  }

  const response = await fetchImpl(url, { signal: fetchTimeoutSignal() });
  if (response.url && new URL(response.url).hostname !== UNPKG_HOST) {
    throw new Error(`Refusing a response from ${new URL(response.url).host}`);
  }
  if (response.status === 404) {
    throw new FileNotFoundError();
  }
  if (!response.ok) {
    throw new Error(`unpkg.com responded ${response.status}`);
  }
  return readLimitedText(response);
}

/**
 * Reads the JSON config schema a package declares through the `configSchema`
 * field of its package.json from unpkg.com, and returns it sanitized for
 * storage. A package that declares no JSON schema yields a fresh result
 * without a schema.
 */
export async function fetchConfigSchema(
  packageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ConfigSchemaResult> {
  let packageJson: unknown;
  try {
    packageJson = JSON.parse(
      await fetchUnpkgFile(packageName, version, ['package.json'], fetchImpl),
    );
  } catch {
    return { status: 'unavailable', reason: 'config-schema-fetch-failed' };
  }

  const declaredPath = isRecord(packageJson)
    ? packageJson.configSchema
    : undefined;
  if (typeof declaredPath !== 'string' || !declaredPath.endsWith('.json')) {
    return { status: 'fresh', schema: undefined };
  }
  const segments = toPathSegments(declaredPath);
  if (!segments) {
    return { status: 'unavailable', reason: 'config-schema-invalid' };
  }

  let source: string;
  try {
    source = await fetchUnpkgFile(packageName, version, segments, fetchImpl);
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return { status: 'fresh', schema: undefined };
    }
    return {
      status: 'unavailable',
      reason:
        error instanceof FileTooLargeError
          ? 'config-schema-too-large'
          : 'config-schema-fetch-failed',
    };
  }

  try {
    return {
      status: 'fresh',
      schema: sanitizeConfigSchema(JSON.parse(source)),
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
