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
import React, { useId } from 'react';

import type {
  BackstageSnapshot,
  Capability,
  NpmSnapshot,
  PluginData,
  SnapshotStatus,
} from '../../pluginDirectory/manifest';
import styles from './pluginDirectory.module.scss';

interface HealthSummaryProps {
  plugin: PluginData;
  now?: Date;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const daysPerMonth = 30;
const daysPerYear = 365;

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

const capabilityLabels: Record<Capability, string> = {
  'entity-card': 'Entity card',
  'entity-content': 'Entity content',
  'standalone-page': 'Standalone page',
  'home-page': 'Home page',
  'search-result': 'Search result',
  'techdocs-addon': 'TechDocs add-on',
  'catalog-processor': 'Catalog processor',
  'catalog-provider': 'Catalog provider',
  'scaffolder-actions': 'Scaffolder actions',
  'search-collator': 'Search collator',
  'backend-module': 'Backend module',
  permissions: 'Permissions',
  signals: 'Signals',
};

const statusPresentations: Record<
  SnapshotStatus,
  {
    cardClassName: string;
    indicatorClassName: string;
    label: string;
    symbol: string;
  }
> = {
  fresh: {
    cardClassName: styles.healthCardFresh,
    indicatorClassName: styles.statusFresh,
    label: 'Current',
    symbol: '✓',
  },
  stale: {
    cardClassName: styles.healthCardStale,
    indicatorClassName: styles.statusStale,
    label: 'Stale',
    symbol: '!',
  },
  unavailable: {
    cardClassName: styles.healthCardUnavailable,
    indicatorClassName: styles.statusUnavailable,
    label: 'Unavailable',
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

function SnapshotStatusIndicator({
  status,
}: {
  status: SnapshotStatus | undefined;
}) {
  const presentation = statusPresentations[status ?? 'unavailable'];

  return (
    <span
      className={`${styles.statusIndicator} ${presentation.indicatorClassName}`}
    >
      <span className={styles.statusSymbol} aria-hidden="true">
        {presentation.symbol}
      </span>
      {presentation.label}
    </span>
  );
}

export function HealthSummary({
  plugin,
  now = new Date(),
}: HealthSummaryProps) {
  const npmSnapshot: NpmSnapshot | undefined = plugin.snapshot?.npm;
  const backstageSnapshot: BackstageSnapshot | undefined =
    plugin.snapshot?.backstage;
  const npmStatus = npmSnapshot?.status ?? 'unavailable';
  const backstageStatus = backstageSnapshot?.status ?? 'unavailable';
  const summaryHeadingId = useId();
  const npmHeadingId = useId();
  const backstageHeadingId = useId();
  const capabilitiesHeadingId = useId();

  return (
    <section
      className={styles.healthSummary}
      aria-labelledby={summaryHeadingId}
    >
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Adoption summary</p>
        <h2 id={summaryHeadingId}>Health and capabilities</h2>
        <p>
          Recorded release and source information to support plugin evaluation.
        </p>
      </div>

      <div className={styles.healthGrid}>
        <article
          className={`${styles.healthCard} ${
            statusPresentations[npmStatus].cardClassName
          }`}
          aria-labelledby={npmHeadingId}
        >
          <div className={styles.cardHeader}>
            <h3 id={npmHeadingId}>Package release</h3>
            <SnapshotStatusIndicator status={npmSnapshot?.status} />
          </div>

          {!npmSnapshot || npmSnapshot.status === 'unavailable' ? (
            <>
              <p className={styles.healthValue}>Unknown</p>
              <p>Package release data is not available.</p>
            </>
          ) : (
            <>
              <p className={styles.cardLabel}>Latest version</p>
              <p className={styles.healthValue}>
                <a
                  href={`https://www.npmjs.com/package/${plugin.npmPackageName}`}
                >
                  <code>{npmSnapshot.latestVersion}</code>
                </a>
              </p>
              <p>
                Released {formatReleaseAge(npmSnapshot.lastPublishedAt, now)}
              </p>
              {npmSnapshot.status === 'stale' && (
                <p className={styles.verificationDate}>
                  <time dateTime={npmSnapshot.checkedAt}>
                    Last verified{' '}
                    {longDateFormatter.format(
                      new Date(npmSnapshot.checkedAt),
                    )}
                  </time>
                </p>
              )}
              <p className={styles.cardLinks}>
                <a href={npmSnapshot.repository.url}>Source repository</a>
              </p>
            </>
          )}
        </article>

        <article
          className={`${styles.healthCard} ${
            statusPresentations[backstageStatus].cardClassName
          }`}
          aria-labelledby={backstageHeadingId}
        >
          <div className={styles.cardHeader}>
            <h3 id={backstageHeadingId}>Backstage source</h3>
            <SnapshotStatusIndicator status={backstageSnapshot?.status} />
          </div>

          {!backstageSnapshot ||
          backstageSnapshot.status === 'unavailable' ? (
            <>
              <p className={styles.healthValue}>Unknown</p>
              <p>Backstage source data is not available.</p>
            </>
          ) : (
            <>
              <p className={styles.cardLabel}>Declared dependency</p>
              <p className={styles.healthValue}>
                Built with Backstage{' '}
                <a href={backstageSnapshot.sourceUrl}>
                  {backstageSnapshot.version}
                </a>
              </p>
              {backstageSnapshot.status === 'stale' && (
                <p className={styles.verificationDate}>
                  <time dateTime={backstageSnapshot.checkedAt}>
                    Last verified{' '}
                    {longDateFormatter.format(
                      new Date(backstageSnapshot.checkedAt),
                    )}
                  </time>
                </p>
              )}
            </>
          )}
        </article>
      </div>

      <section
        className={styles.capabilities}
        aria-labelledby={capabilitiesHeadingId}
      >
        <h3 id={capabilitiesHeadingId}>Capabilities</h3>
        {plugin.capabilities?.length ? (
          <ul aria-label="Capabilities">
            {plugin.capabilities.map(capability => (
              <li key={capability}>{capabilityLabels[capability]}</li>
            ))}
          </ul>
        ) : (
          <p>No capabilities declared in the plugin manifest.</p>
        )}
      </section>
    </section>
  );
}
