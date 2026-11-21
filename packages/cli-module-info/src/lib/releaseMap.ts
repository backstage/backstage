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

import fs from 'fs-extra';
import semver from 'semver';
import {
  getManifestByReleaseLine,
  getManifestByVersion,
  ReleaseManifest,
} from '@backstage/release-manifests';

export type PackageReleaseInfo = {
  version: string;
  release?: string;
  isNewer?: boolean;
};

export type ReleaseMapResult = {
  packageReleases: Map<string, PackageReleaseInfo[]>;
  mostCommonRelease?: string;
  newerPackages: Array<{ name: string; version: string; release: string }>;
};

export type FetchReleaseManifestsOptions = {
  manifestFile?: string;
  versionsBaseUrl?: string;
  backstageVersion?: string;
};

/**
 * Fetches release manifests for the latest ~10 release lines.
 */
export async function fetchReleaseManifests(
  options?: FetchReleaseManifestsOptions,
): Promise<ReleaseManifest[]> {
  const manifestFile =
    options?.manifestFile ?? process.env.BACKSTAGE_MANIFEST_FILE;
  if (manifestFile) {
    const manifest: ReleaseManifest = await fs.readJson(manifestFile);
    return [manifest];
  }

  const versionsBaseUrl =
    options?.versionsBaseUrl ?? process.env.BACKSTAGE_VERSIONS_BASE_URL;

  const mainManifest = await getManifestByReleaseLine({
    releaseLine: 'main',
    versionsBaseUrl,
  });

  const manifests: ReleaseManifest[] = [mainManifest];
  const fetchedVersions = new Set<string>([mainManifest.releaseVersion]);

  const parsedLatest = semver.parse(mainManifest.releaseVersion);
  if (!parsedLatest) {
    return manifests;
  }

  const latestMinor = parsedLatest.minor;
  let minMinor = Math.max(0, latestMinor - 9);

  if (options?.backstageVersion && semver.valid(options.backstageVersion)) {
    const parsedBackstage = semver.parse(options.backstageVersion);
    if (parsedBackstage && parsedBackstage.minor < minMinor) {
      minMinor = Math.max(0, parsedBackstage.minor);
    }
  }

  // Probe .0, .1, and .2 for each minor release line
  const versionsToFetch: string[] = [];
  for (let minor = minMinor; minor <= latestMinor; minor++) {
    for (const patch of [0, 1, 2]) {
      const v = `1.${minor}.${patch}`;
      if (!fetchedVersions.has(v)) {
        versionsToFetch.push(v);
      }
    }
  }

  const results = await Promise.allSettled(
    versionsToFetch.map(v =>
      getManifestByVersion({ version: v, versionsBaseUrl }),
    ),
  );

  for (const res of results) {
    if (
      res.status === 'fulfilled' &&
      !fetchedVersions.has(res.value.releaseVersion)
    ) {
      manifests.push(res.value);
      fetchedVersions.add(res.value.releaseVersion);
    }
  }

  return manifests;
}

export type BuildReleaseMapOptions = FetchReleaseManifestsOptions & {
  manifests?: ReleaseManifest[];
};

/**
 * Builds a mapping of package versions to their earliest Backstage release,
 * and identifies packages from releases newer than the most common one.
 */
export async function buildReleaseMap(
  packages: Array<{ name: string; versions: string[] }>,
  options?: BuildReleaseMapOptions,
): Promise<ReleaseMapResult> {
  const manifests =
    options?.manifests ?? (await fetchReleaseManifests(options));

  // Sort manifests in ascending semver order so the first match is the earliest release
  const sortedManifests = [...manifests].sort((a, b) => {
    const va = semver.valid(a.releaseVersion);
    const vb = semver.valid(b.releaseVersion);
    if (va && vb) {
      return semver.compare(a.releaseVersion, b.releaseVersion);
    }
    return a.releaseVersion.localeCompare(b.releaseVersion);
  });

  // Map of `${name}@${version}` -> earliest releaseVersion
  const earliestReleaseMap = new Map<string, string>();
  for (const manifest of sortedManifests) {
    for (const pkg of manifest.packages) {
      const key = `${pkg.name}@${pkg.version}`;
      if (!earliestReleaseMap.has(key)) {
        earliestReleaseMap.set(key, manifest.releaseVersion);
      }
    }
  }

  const packageReleases = new Map<string, PackageReleaseInfo[]>();
  const releaseCounts = new Map<string, number>();

  for (const pkg of packages) {
    const infos: PackageReleaseInfo[] = [];
    for (const version of pkg.versions) {
      const key = `${pkg.name}@${version}`;
      const release = earliestReleaseMap.get(key);
      if (release) {
        releaseCounts.set(release, (releaseCounts.get(release) ?? 0) + 1);
      }
      infos.push({ version, release });
    }
    packageReleases.set(pkg.name, infos);
  }

  // Determine the baseline release: prefer backstageVersion if provided and present in counts, otherwise most common
  let mostCommonRelease: string | undefined;
  let maxCount = 0;
  for (const [release, count] of releaseCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonRelease = release;
    }
  }

  if (
    options?.backstageVersion &&
    semver.valid(options.backstageVersion) &&
    releaseCounts.has(options.backstageVersion)
  ) {
    mostCommonRelease = options.backstageVersion;
  }

  // Identify any packages from a release newer than the most common release
  const newerPackages: Array<{
    name: string;
    version: string;
    release: string;
  }> = [];

  if (mostCommonRelease) {
    for (const [name, infos] of packageReleases.entries()) {
      for (const info of infos) {
        if (info.release && semver.gt(info.release, mostCommonRelease)) {
          info.isNewer = true;
          newerPackages.push({
            name,
            version: info.version,
            release: info.release,
          });
        }
      }
    }
  }

  return {
    packageReleases,
    mostCommonRelease,
    newerPackages,
  };
}
