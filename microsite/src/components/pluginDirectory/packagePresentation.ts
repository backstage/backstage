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
import type {
  PackageSnapshot,
  PluginData,
} from '../../pluginDirectory/manifest';
import { resolveFunctionality } from '../../pluginDirectory/packageRoles';
import {
  countMinorVersionsBehind,
  formatReleaseAge,
  getPrimaryPackageSnapshot,
} from './healthPresentation';

export type PackageGroupId = 'core' | 'modules' | 'libraries';

type PackageGroupLabel =
  | 'Core experiences'
  | 'Extension modules'
  | 'Shared libraries';

export interface PackagePresentation {
  snapshot: PackageSnapshot;
  npmPackageName: string;
  label: string;
  functionality: string | undefined;
  group: PackageGroupId;
  groupLabel: PackageGroupLabel;
}

export interface PluginDecisionSummary {
  release:
    | { status: 'fresh' | 'stale'; version: string; age: string }
    | { status: 'unavailable' };
  backstage:
    | {
        status: 'fresh' | 'stale';
        version: string;
        age: string;
        versionsBehind: number | undefined;
      }
    | { status: 'unavailable' };
}

const groupLabels: Record<PackageGroupId, PackageGroupLabel> = {
  core: 'Core experiences',
  modules: 'Extension modules',
  libraries: 'Shared libraries',
};

const groupOrder: PackageGroupId[] = ['core', 'modules', 'libraries'];

const acronymLabels: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  aws: 'AWS',
  gcp: 'GCP',
  github: 'GitHub',
  gitlab: 'GitLab',
  ldap: 'LDAP',
  msgraph: 'MS Graph',
};

function toDisplayWords(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((word, index) => {
      const acronym = acronymLabels[word.toLowerCase()];
      if (acronym) {
        return acronym;
      }
      return index === 0
        ? `${word.charAt(0).toUpperCase()}${word.slice(1)}`
        : word;
    })
    .join(' ');
}

function groupFor(functionality: string | undefined): PackageGroupId {
  if (
    functionality === 'common-library' ||
    functionality === 'node-library' ||
    functionality === 'web-library' ||
    functionality === 'common' ||
    functionality === 'node' ||
    functionality === 'react'
  ) {
    return 'libraries';
  }
  if (functionality?.includes('module')) {
    return 'modules';
  }
  return 'core';
}

function packageLabel(
  npmPackageName: string,
  primaryNpmPackageName: string,
  functionality: string | undefined,
): string {
  const primaryUnscoped =
    primaryNpmPackageName.split('/').at(-1) ?? primaryNpmPackageName;
  const primaryStem = toDisplayWords(
    primaryUnscoped.replace(/^(?:backstage-)?plugin-/, ''),
  );
  if (npmPackageName === primaryNpmPackageName) {
    return `${primaryStem} frontend`;
  }

  const suffix = npmPackageName.startsWith(`${primaryNpmPackageName}-`)
    ? npmPackageName.slice(primaryNpmPackageName.length + 1)
    : npmPackageName.split('/').at(-1) ?? npmPackageName;
  if (suffix === 'backend') return `${primaryStem} backend`;
  if (suffix === 'react') return `${primaryStem} React`;
  if (suffix === 'node') return `${primaryStem} Node`;
  if (suffix === 'common') return `${primaryStem} common`;

  const moduleName = suffix
    .replace(/^backend-module-/, '')
    .replace(/^module-/, '');
  if (functionality?.includes('module')) {
    return `${toDisplayWords(moduleName)} module`;
  }
  return toDisplayWords(suffix);
}

export function getPackagePresentations(
  plugin: PluginData,
): PackagePresentation[] {
  const presentations = (plugin.snapshot?.packages ?? []).map(snapshot => {
    const functionality = resolveFunctionality(
      snapshot,
      plugin.npmPackageName,
    );
    const group = groupFor(functionality);
    return {
      snapshot,
      npmPackageName: snapshot.npmPackageName,
      label: packageLabel(
        snapshot.npmPackageName,
        plugin.npmPackageName,
        functionality,
      ),
      functionality,
      group,
      groupLabel: groupLabels[group],
    };
  });

  return groupOrder.flatMap(group =>
    presentations.filter(presentation => presentation.group === group),
  );
}

export function getPluginDecisionSummary(
  plugin: PluginData,
  latestBackstageVersion: string | null,
  now = new Date(),
): PluginDecisionSummary {
  const npmSnapshot = getPrimaryPackageSnapshot(plugin)?.npm;
  const release =
    npmSnapshot && npmSnapshot.status !== 'unavailable'
      ? {
          status: npmSnapshot.status,
          version: npmSnapshot.latestVersion,
          age: formatReleaseAge(npmSnapshot.lastPublishedAt, now),
        }
      : ({ status: 'unavailable' } as const);
  const backstageSnapshot = plugin.snapshot?.backstage;
  const backstage =
    backstageSnapshot && backstageSnapshot.status !== 'unavailable'
      ? {
          status: backstageSnapshot.status,
          version: backstageSnapshot.version,
          age: formatReleaseAge(backstageSnapshot.checkedAt, now),
          versionsBehind: latestBackstageVersion
            ? countMinorVersionsBehind(
                backstageSnapshot.version,
                latestBackstageVersion,
              )
            : undefined,
        }
      : ({ status: 'unavailable' } as const);

  return {
    release,
    backstage,
  };
}
