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
import { isDeepStrictEqual } from 'node:util';
import type {
  BackstageSnapshot,
  NpmSnapshot,
  PluginManifest,
} from '../../src/pluginDirectory/manifest';
import type {
  GitHubSnapshotClient,
  RepositoryLocation,
} from './githubClient';
import { fetchNpmSnapshot } from './npmClient';

export interface AuditDependencies {
  fetchNpm: typeof fetchNpmSnapshot;
  github: GitHubSnapshotClient;
  now: () => Date;
}

export interface AuditResult {
  manifest: PluginManifest;
  warnings: string[];
  changed: boolean;
}

function staleNpmSnapshot(
  previous: NpmSnapshot | undefined,
  unavailable: Extract<NpmSnapshot, { status: 'unavailable' }>,
): NpmSnapshot {
  if (!previous || previous.status === 'unavailable') {
    return unavailable;
  }

  return {
    status: 'stale',
    lastAttemptAt: unavailable.lastAttemptAt,
    reason: unavailable.reason,
    checkedAt: previous.checkedAt,
    latestVersion: previous.latestVersion,
    lastPublishedAt: previous.lastPublishedAt,
    repository: previous.repository,
  };
}

function staleBackstageSnapshot(
  previous: BackstageSnapshot | undefined,
  unavailable: Extract<BackstageSnapshot, { status: 'unavailable' }>,
): BackstageSnapshot {
  if (!previous || previous.status === 'unavailable') {
    return unavailable;
  }

  return {
    status: 'stale',
    lastAttemptAt: unavailable.lastAttemptAt,
    reason: unavailable.reason,
    checkedAt: previous.checkedAt,
    version: previous.version,
    sourceUrl: previous.sourceUrl,
    sourcePath: previous.sourcePath,
  };
}

function repositoryLocation(
  snapshot: Extract<NpmSnapshot, { status: 'fresh' | 'stale' }>,
): RepositoryLocation | undefined {
  let url: URL;
  try {
    url = new URL(snapshot.repository.url);
  } catch {
    return undefined;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (url.hostname !== 'github.com' || segments.length !== 2) {
    return undefined;
  }

  return {
    owner: decodeURIComponent(segments[0]),
    repository: decodeURIComponent(segments[1]),
    directory: snapshot.repository.directory,
  };
}

function transitionStatus(
  manifest: PluginManifest,
  lastPublishedAt: string,
  now: Date,
): PluginManifest {
  const ageInDays = Math.round(
    (now.getTime() - new Date(lastPublishedAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const auditDate = now.toISOString().slice(0, 10);
  if (Number.isNaN(ageInDays)) {
    return manifest;
  }

  if (ageInDays < 365 && manifest.status !== 'active') {
    const { staleSince: _staleSince, ...activeManifest } = manifest;
    return { ...activeManifest, status: 'active' };
  }

  if (
    ageInDays > 365 &&
    manifest.status === 'inactive' &&
    manifest.staleSince !== auditDate
  ) {
    return { ...manifest, status: 'archived' };
  }

  if (ageInDays > 365 && manifest.status === 'active') {
    return {
      ...manifest,
      status: 'inactive',
      staleSince: auditDate,
    };
  }

  return manifest;
}

export async function auditManifest(
  manifest: PluginManifest,
  dependencies: AuditDependencies,
): Promise<AuditResult> {
  const now = dependencies.now();
  const lastAttemptAt = now.toISOString();
  const warnings: string[] = [];

  let fetchedNpm: NpmSnapshot;
  try {
    fetchedNpm = await dependencies.fetchNpm(manifest.npmPackageName);
  } catch {
    fetchedNpm = {
      status: 'unavailable',
      lastAttemptAt,
      reason: 'npm-request-failed',
    };
  }

  const previousSnapshot = manifest.snapshot;
  const npm =
    fetchedNpm.status === 'unavailable'
      ? staleNpmSnapshot(previousSnapshot?.npm, fetchedNpm)
      : fetchedNpm;

  if (fetchedNpm.status === 'unavailable') {
    warnings.push(
      `${manifest.title}: npm snapshot unavailable (${fetchedNpm.reason})`,
    );
  }

  let backstage: BackstageSnapshot;
  if (fetchedNpm.status === 'unavailable') {
    backstage =
      previousSnapshot?.backstage ??
      ({
        status: 'unavailable',
        lastAttemptAt,
        reason: 'npm-data-unavailable',
      } satisfies BackstageSnapshot);
  } else {
    const location = repositoryLocation(fetchedNpm);
    let fetchedBackstage: BackstageSnapshot;
    if (!location) {
      fetchedBackstage = {
        status: 'unavailable',
        lastAttemptAt,
        reason: 'repository-unsupported',
      };
    } else {
      try {
        fetchedBackstage =
          await dependencies.github.fetchBackstageSnapshot(location);
      } catch {
        fetchedBackstage = {
          status: 'unavailable',
          lastAttemptAt,
          reason: 'github-request-failed',
        };
      }
    }

    backstage =
      fetchedBackstage.status === 'unavailable'
        ? staleBackstageSnapshot(previousSnapshot?.backstage, fetchedBackstage)
        : fetchedBackstage;

    if (fetchedBackstage.status === 'unavailable') {
      warnings.push(
        `${manifest.title}: Backstage snapshot unavailable (${fetchedBackstage.reason})`,
      );
    }
  }

  const withSnapshot: PluginManifest = {
    ...manifest,
    snapshot: { npm, backstage },
  };
  const auditedManifest =
    fetchedNpm.status === 'fresh'
      ? transitionStatus(withSnapshot, fetchedNpm.lastPublishedAt, now)
      : withSnapshot;

  return {
    manifest: auditedManifest,
    warnings,
    changed: !isDeepStrictEqual(manifest, auditedManifest),
  };
}
