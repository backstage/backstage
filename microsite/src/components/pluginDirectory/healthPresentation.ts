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
  SnapshotStatus,
} from '../../pluginDirectory/manifest';
import styles from './pluginDirectory.module.scss';

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const daysPerMonth = 30;
const daysPerYear = 365;

export interface StatusPresentation {
  cardClassName: string;
  indicatorClassName: string;
  label: string;
  symbol: string;
}

export const statusPresentations: Record<SnapshotStatus, StatusPresentation> = {
  fresh: {
    cardClassName: styles.healthCardFresh,
    indicatorClassName: styles.statusFresh,
    label: 'Current',
    symbol: '✓',
  },
  stale: {
    cardClassName: styles.healthCardStale,
    indicatorClassName: styles.statusStale,
    label: 'Getting old',
    symbol: '!',
  },
  unavailable: {
    cardClassName: styles.healthCardUnavailable,
    indicatorClassName: styles.statusUnavailable,
    label: 'Not reported',
    symbol: '?',
  },
};

export function formatReleaseAge(isoDate: string, now = new Date()): string {
  const elapsedDays = Math.max(
    0,
    Math.floor(
      (now.getTime() - new Date(isoDate).getTime()) / millisecondsPerDay,
    ),
  );

  if (elapsedDays === 0) {
    return 'today';
  }
  if (elapsedDays < daysPerMonth) {
    return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`;
  }
  if (elapsedDays < daysPerYear) {
    const elapsedMonths = Math.floor(elapsedDays / daysPerMonth);
    return `${elapsedMonths} ${
      elapsedMonths === 1 ? 'month' : 'months'
    } ago`;
  }

  const elapsedYears = Math.floor(elapsedDays / daysPerYear);
  return `${elapsedYears} ${elapsedYears === 1 ? 'year' : 'years'} ago`;
}

export function getNpmPackageUrl(plugin: PluginData): string {
  return `https://www.npmjs.com/package/${plugin.npmPackageName}`;
}

const backstageVersionPattern = /^(\d+)\.(\d+)\.\d+/;

/**
 * Counts how many minor Backstage releases `version` is behind
 * `latestVersion`, e.g. 1.50.0 vs 1.53.1 is 3 minor releases behind. Returns
 * undefined if either version doesn't parse as a Backstage release version.
 */
export function countMinorVersionsBehind(
  version: string,
  latestVersion: string,
): number | undefined {
  const current = backstageVersionPattern.exec(version);
  const latest = backstageVersionPattern.exec(latestVersion);
  if (!current || !latest) {
    return undefined;
  }

  const currentOrdinal = Number(current[1]) * 1000 + Number(current[2]);
  const latestOrdinal = Number(latest[1]) * 1000 + Number(latest[2]);
  return Math.max(0, latestOrdinal - currentOrdinal);
}

export function getPrimaryPackageSnapshot(
  plugin: PluginData,
): PackageSnapshot | undefined {
  return plugin.snapshot?.packages.find(
    packageSnapshot => packageSnapshot.npmPackageName === plugin.npmPackageName,
  );
}
