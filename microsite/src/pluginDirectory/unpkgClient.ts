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
const UNPKG_HOST = 'unpkg.com';
const MAX_BYTES = 1024 * 1024;

const PACKAGE_NAME_PATTERN =
  /^(@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*$/;
const VERSION_PATTERN = /^[0-9A-Za-z][0-9A-Za-z.+-]*$/;

export type RegistryResult<T> =
  | { status: 'ready'; value: T | undefined } // undefined = declared-none-found
  | { status: 'error'; error: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Reads a response body as text, giving up as soon as it grows past the limit
// rather than buffering whatever the server decides to send.
async function readLimitedText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (declaredLength > MAX_BYTES) {
    throw new Error('Response is too large');
  }
  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).length > MAX_BYTES) {
      throw new Error('Response is too large');
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
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new Error('Response is too large');
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

async function fetchUnpkg(
  packageUrl: string,
  suffix: string,
  fetchImpl: typeof fetch,
): Promise<string> {
  const url = new URL(`${packageUrl}${suffix}`);
  if (url.protocol !== 'https:' || url.hostname !== UNPKG_HOST) {
    throw new Error(`Refusing to download from ${url.host}`);
  }
  // The addresses built here are for exact versions, which unpkg.com serves
  // directly. Refusing redirects stops a request from being sent anywhere else.
  const response = await fetchImpl(url, { redirect: 'error' });
  if (!response.ok) {
    throw new Error(
      `unpkg.com responded ${response.status} for ${url.pathname}`,
    );
  }
  return readLimitedText(response);
}

// Finds the README at the top level of the package, with its size, from the
// recursive file listing that unpkg.com serves for `?meta`.
function findReadme(
  listing: unknown,
): { name: string; size: number } | undefined {
  const files =
    isRecord(listing) && Array.isArray(listing.files) ? listing.files : [];
  for (const file of files) {
    if (
      isRecord(file) &&
      typeof file.path === 'string' &&
      typeof file.size === 'number'
    ) {
      const match = /^\/(readme(?:\.md)?)$/i.exec(file.path);
      if (match) {
        return { name: match[1], size: file.size };
      }
    }
  }
  return undefined;
}

/**
 * Loads the top-level README of a published package from unpkg.com. Nothing
 * is requested until this is called, and neither the listing nor the README
 * may be larger than 1 MiB.
 */
export async function fetchPackageReadme(
  npmPackageName: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RegistryResult<string>> {
  try {
    if (
      !PACKAGE_NAME_PATTERN.test(npmPackageName) ||
      !VERSION_PATTERN.test(version)
    ) {
      throw new Error(`Invalid package ${npmPackageName}@${version}`);
    }
    const packageUrl = `https://${UNPKG_HOST}/${npmPackageName}@${version}/`;

    const listing: unknown = JSON.parse(
      await fetchUnpkg(packageUrl, '?meta', fetchImpl),
    );
    const readme = findReadme(listing);
    if (!readme) {
      return { status: 'ready', value: undefined };
    }
    if (readme.size > MAX_BYTES) {
      throw new Error(`README is too large (${readme.size} bytes)`);
    }

    const text = await fetchUnpkg(packageUrl, readme.name, fetchImpl);
    return { status: 'ready', value: text.length > 0 ? text : undefined };
  } catch (error) {
    return { status: 'error', error };
  }
}
