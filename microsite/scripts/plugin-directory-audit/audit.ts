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
  ConfigSchemaSnapshot,
  NpmSnapshot,
  PackageSnapshot,
  PluginManifest,
} from '../../src/pluginDirectory/manifest';
import type { fetchConfigSchemaSnapshot } from './configSchemaClient';
import type {
  CanonicalPackage,
  GitHubSnapshotClient,
  RepositoryLocation,
} from './githubClient';
import { fetchNpmSnapshot } from './npmClient';

export interface AuditDependencies {
  fetchNpm: typeof fetchNpmSnapshot;
  fetchConfigSchema: typeof fetchConfigSchemaSnapshot;
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
    ...(previous.repository ? { repository: previous.repository } : {}),
    ...(previous.backstageRole
      ? { backstageRole: previous.backstageRole }
      : {}),
    ...(previous.dependencyNames
      ? { dependencyNames: previous.dependencyNames }
      : {}),
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

function staleConfigSchemaSnapshot(
  previous: ConfigSchemaSnapshot | undefined,
  unavailable: Extract<ConfigSchemaSnapshot, { status: 'unavailable' }>,
): ConfigSchemaSnapshot {
  if (!previous || previous.status === 'unavailable') {
    return unavailable;
  }

  return {
    status: 'stale',
    lastAttemptAt: unavailable.lastAttemptAt,
    reason: unavailable.reason,
    checkedAt: previous.checkedAt,
    schema: previous.schema,
  };
}

function findPreviousPackage(
  previous: readonly PackageSnapshot[] | undefined,
  npmPackageName: string,
): PackageSnapshot | undefined {
  return previous?.find(entry => entry.npmPackageName === npmPackageName);
}

function repositoryLocation(
  snapshot: Extract<NpmSnapshot, { status: 'fresh' | 'stale' }>,
): RepositoryLocation | undefined {
  if (!snapshot.repository) {
    return undefined;
  }

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

async function resolvePackageConfigSchema(
  npmPackageName: string,
  npm: NpmSnapshot,
  previousPackage: PackageSnapshot | undefined,
  dependencies: AuditDependencies,
  lastAttemptAt: string,
  warnings: string[],
  title: string,
): Promise<ConfigSchemaSnapshot | undefined> {
  if (npm.status === 'unavailable') {
    return (
      previousPackage?.configSchema ?? {
        status: 'unavailable',
        lastAttemptAt,
        reason: 'npm-data-unavailable',
      }
    );
  }

  let fetchedConfigSchema: ConfigSchemaSnapshot;
  try {
    fetchedConfigSchema = await dependencies.fetchConfigSchema(
      npmPackageName,
      npm.latestVersion,
    );
  } catch {
    fetchedConfigSchema = {
      status: 'unavailable',
      lastAttemptAt,
      reason: 'config-schema-request-failed',
    };
  }

  if (fetchedConfigSchema.status === 'unavailable') {
    if (fetchedConfigSchema.reason !== 'config-schema-not-declared') {
      warnings.push(
        `${title}: config schema unavailable for ${npmPackageName} (${fetchedConfigSchema.reason})`,
      );
    }
    // Unsupported declaration format, not a transient failure: drop the
    // snapshot entirely rather than persisting an unavailable/stale record.
    if (fetchedConfigSchema.reason === 'config-schema-not-json') {
      return undefined;
    }
    return staleConfigSchemaSnapshot(
      previousPackage?.configSchema,
      fetchedConfigSchema,
    );
  }

  return fetchedConfigSchema;
}

async function collectPackageSnapshots(
  manifest: PluginManifest,
  primaryNpm: NpmSnapshot,
  location: RepositoryLocation | undefined,
  previousPackages: readonly PackageSnapshot[] | undefined,
  dependencies: AuditDependencies,
  lastAttemptAt: string,
  warnings: string[],
): Promise<PackageSnapshot[]> {
  let siblings: CanonicalPackage[] = [];
  if (location) {
    try {
      siblings =
        (await dependencies.github.discoverCanonicalPackages(location)) ?? [];
    } catch {
      siblings = [];
    }
  }

  const members: CanonicalPackage[] =
    siblings.length > 0
      ? siblings
      : [
          {
            functionality: '',
            npmPackageName: manifest.npmPackageName,
            sourcePath: '',
          },
        ];
  const memberNames = new Set(members.map(member => member.npmPackageName));

  const packageSnapshots: PackageSnapshot[] = [];
  for (const member of members) {
    const isPrimary = member.npmPackageName === manifest.npmPackageName;
    const previousPackage = findPreviousPackage(
      previousPackages,
      member.npmPackageName,
    );

    let fetchedNpm: NpmSnapshot;
    if (isPrimary) {
      fetchedNpm = primaryNpm;
    } else {
      try {
        fetchedNpm = await dependencies.fetchNpm(member.npmPackageName);
      } catch {
        fetchedNpm = {
          status: 'unavailable',
          lastAttemptAt,
          reason: 'npm-request-failed',
        };
      }
    }

    const npm =
      fetchedNpm.status === 'unavailable'
        ? staleNpmSnapshot(previousPackage?.npm, fetchedNpm)
        : fetchedNpm;

    if (fetchedNpm.status === 'unavailable' && !isPrimary) {
      warnings.push(
        `${manifest.title}: npm snapshot unavailable for ${member.npmPackageName} (${fetchedNpm.reason})`,
      );
    }

    const configSchema = await resolvePackageConfigSchema(
      member.npmPackageName,
      npm,
      previousPackage,
      dependencies,
      lastAttemptAt,
      warnings,
      manifest.title,
    );

    const internalDependencies =
      npm.status !== 'unavailable' && npm.dependencyNames
        ? npm.dependencyNames.filter(
            name => name !== member.npmPackageName && memberNames.has(name),
          )
        : undefined;

    packageSnapshots.push({
      npmPackageName: member.npmPackageName,
      ...(member.sourcePath ? { sourcePath: member.sourcePath } : {}),
      ...(internalDependencies && internalDependencies.length > 0
        ? { internalDependencies }
        : {}),
      npm,
      ...(configSchema ? { configSchema } : {}),
    });
  }

  return packageSnapshots;
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
  const previousPrimaryPackage = findPreviousPackage(
    previousSnapshot?.packages,
    manifest.npmPackageName,
  );
  const npm =
    fetchedNpm.status === 'unavailable'
      ? staleNpmSnapshot(previousPrimaryPackage?.npm, fetchedNpm)
      : fetchedNpm;

  if (fetchedNpm.status === 'unavailable') {
    warnings.push(
      `${manifest.title}: npm snapshot unavailable (${fetchedNpm.reason})`,
    );
  }

  let backstage: BackstageSnapshot;
  let location: RepositoryLocation | undefined;
  if (fetchedNpm.status === 'unavailable') {
    backstage =
      previousSnapshot?.backstage ??
      ({
        status: 'unavailable',
        lastAttemptAt,
        reason: 'npm-data-unavailable',
      } satisfies BackstageSnapshot);
  } else {
    location = repositoryLocation(fetchedNpm);
    let fetchedBackstage: BackstageSnapshot;
    if (!location) {
      fetchedBackstage = {
        status: 'unavailable',
        lastAttemptAt,
        reason: 'repository-unsupported',
      };
    } else {
      try {
        fetchedBackstage = await dependencies.github.fetchBackstageSnapshot(
          location,
        );
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

  const packages = await collectPackageSnapshots(
    manifest,
    npm,
    location,
    previousSnapshot?.packages,
    dependencies,
    lastAttemptAt,
    warnings,
  );

  const withSnapshot: PluginManifest = {
    ...manifest,
    snapshot: { backstage, packages },
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
