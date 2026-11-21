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

const UNPKG_ORIGIN = 'https://unpkg.com';

// Hosts a README may load images from. Anything else would let a package
// author learn who is reading the page, so those images become links.
const ALLOWED_IMAGE_HOSTS = new Set([
  'unpkg.com',
  'raw.githubusercontent.com',
  'img.shields.io',
]);
const GITHUB_ATTACHMENTS_PATH = '/user-attachments/';

/** The address that relative links in a package's README are relative to. */
export function getReadmeBaseUrl(
  npmPackageName: string,
  version: string,
): string {
  return `${UNPKG_ORIGIN}/${npmPackageName}@${version}/`;
}

/**
 * Resolves a link or image address from a README against the package's files
 * on unpkg.com, so that relative addresses keep working away from the page
 * that the README is shown on. Pass in addresses that have already been
 * checked for dangerous schemes, as the empty string is returned as it is.
 */
export function resolveReadmeUrl(url: string, baseUrl: string): string {
  if (url === '' || url.startsWith('#')) {
    return url;
  }
  // `/docs/x.md` points into the package, not at the root of unpkg.com.
  const relative =
    url.startsWith('/') && !url.startsWith('//') ? url.slice(1) : url;
  try {
    return new URL(relative, baseUrl).href;
  } catch {
    return '';
  }
}

/** Whether a README image may be loaded when the page renders. */
export function isAllowedReadmeImage(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:' || parsed.port !== '') {
    return false;
  }
  return (
    ALLOWED_IMAGE_HOSTS.has(parsed.hostname) ||
    (parsed.hostname === 'github.com' &&
      parsed.pathname.startsWith(GITHUB_ATTACHMENTS_PATH))
  );
}
