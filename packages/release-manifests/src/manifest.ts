/*
 * Copyright 2022 The Backstage Authors
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

const VERSIONS_BASE_URL = 'https://versions.backstage.io';
const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/backstage/versions/main';

/**
 * Contains mapping between Backstage release and package versions.
 * @public
 */
export type ReleaseManifest = {
  releaseVersion: string;
  packages: { name: string; version: string }[];
};

/**
 * Options for {@link getManifestByVersion}.
 * @public
 */
export type GetManifestByVersionOptions = {
  version: string;
  fetch?: (
    url: string,
    options?: { signal?: AbortSignal },
  ) => Promise<Pick<Response, 'status' | 'json' | 'url'>>;
};

// Wait for waitMs, or until signal is aborted.
function wait(waitMs: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!signal.aborted) {
        resolve();
      }
    }, waitMs);
    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Aborted'));
    });
  });
}

// Run fn1 and then fn2 after fallbackDelayMs. Whichever one finishes
// first wins, and the other one is aborted through the provided signal.
export async function withFallback<T>(
  fn1: (signal: AbortSignal) => Promise<T>,
  fn2: (signal: AbortSignal) => Promise<T>,
  fallbackDelayMs: number,
): Promise<T> {
  const c1 = new AbortController();
  const c2 = new AbortController();

  const promise1 = fn1(c1.signal).then(res => {
    c2.abort();
    return res;
  });
  const promise2 = wait(fallbackDelayMs, c2.signal)
    .then(() => fn2(c2.signal))
    .then(res => {
      c1.abort();
      return res;
    });

  return Promise.any([promise1, promise2]).catch(() => promise1);
}

/**
 * Returns a release manifest based on supplied version.
 * @public
 */
export async function getManifestByVersion(
  options: GetManifestByVersionOptions,
): Promise<ReleaseManifest> {
  const versionEnc = encodeURIComponent(options.version);

  const fetchFn = options.fetch ?? fetch;

  const res = await withFallback(
    signal =>
      fetchFn(`${VERSIONS_BASE_URL}/v1/releases/${versionEnc}/manifest.json`, {
        signal,
      }),
    signal =>
      fetchFn(
        `${GITHUB_RAW_BASE_URL}/v1/releases/${versionEnc}/manifest.json`,
        {
          signal,
        },
      ),
    500,
  );
  if (res.status === 404) {
    throw new Error(`No release found for ${options.version} version`);
  }
  if (res.status !== 200) {
    throw new Error(
      `Unexpected response status ${res.status} when fetching release from ${res.url}.`,
    );
  }
  return res.json();
}

/**
 * Options for {@link getManifestByReleaseLine}.
 * @public
 */
export type GetManifestByReleaseLineOptions = {
  releaseLine: string;
};

/**
 * Returns a release manifest based on supplied release line.
 * @public
 */
export async function getManifestByReleaseLine(
  options: GetManifestByReleaseLineOptions,
): Promise<ReleaseManifest> {
  const releaseEnc = encodeURIComponent(options.releaseLine);
  const res = await withFallback(
    signal =>
      fetch(`${VERSIONS_BASE_URL}/v1/tags/${releaseEnc}/manifest.json`, {
        signal,
      }),
    async signal => {
      // The release tags are symlinks, which we need to follow manually when fetching from GitHub.
      const baseUrl = `${GITHUB_RAW_BASE_URL}/v1/tags/${releaseEnc}`;
      const linkRes = await fetch(baseUrl, { signal });
      if (!linkRes.ok) {
        return linkRes;
      }
      const link = (await linkRes.text()).trim();
      return fetch(new URL(`${link}/manifest.json`, baseUrl), { signal });
    },
    1000,
  );
  if (res.status === 404) {
    throw new Error(`No '${options.releaseLine}' release line found`);
  }
  if (res.status !== 200) {
    throw new Error(
      `Unexpected response status ${res.status} when fetching release from ${res.url}.`,
    );
  }
  return res.json();
}
