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

import fetch from 'cross-fetch';

const VERSIONS_DOMAIN = 'https://versions.backstage.io';

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
};

/**
 * Returns a release manifest based on supplied version.
 * @public
 */
export async function getManifestByVersion(
  options: GetManifestByVersionOptions,
): Promise<ReleaseManifest> {
  const url = `${VERSIONS_DOMAIN}/v1/releases/${encodeURIComponent(
    options.version,
  )}/manifest.json`;
  const response = await fetch(url);
  if (response.status === 404) {
    throw new Error(`No release found for ${options.version} version`);
  }
  if (response.status !== 200) {
    throw new Error(
      `Unexpected response status ${response.status} when fetching release from ${url}.`,
    );
  }
  return await response.json();
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
  const url = `${VERSIONS_DOMAIN}/v1/tags/${encodeURIComponent(
    options.releaseLine,
  )}/manifest.json`;
  const response = await fetch(url);
  if (response.status === 404) {
    throw new Error(`No '${options.releaseLine}' release line found`);
  }
  if (response.status !== 200) {
    throw new Error(
      `Unexpected response status ${response.status} when fetching release from ${url}.`,
    );
  }
  return await response.json();
}
