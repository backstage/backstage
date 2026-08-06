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
import type { PluginData } from '../../pluginDirectory/manifest';
import React from 'react';
import {
  getPackagePresentations,
  getPluginDecisionSummary,
} from './packagePresentation';
import styles from './pluginDirectory.module.scss';

interface PluginOverviewProps {
  plugin: PluginData;
  latestBackstageVersion: string | null;
  onSelectPackage: (npmPackageName: string) => void;
  now?: Date;
}

function releaseStatus(status: 'fresh' | 'stale'): string {
  return status === 'fresh' ? 'Current release' : 'Getting old';
}

function backstageComparison(
  versionsBehind: number | undefined,
): string | undefined {
  if (versionsBehind === undefined) {
    return undefined;
  }
  if (versionsBehind === 0) {
    return 'Current Backstage release';
  }
  return `${versionsBehind} minor ${versionsBehind === 1 ? 'release' : 'releases'} behind`;
}

export function PluginOverview({
  plugin,
  latestBackstageVersion,
  onSelectPackage,
  now,
}: PluginOverviewProps) {
  const summary = getPluginDecisionSummary(
    plugin,
    latestBackstageVersion,
    now,
  );
  const packages = getPackagePresentations(plugin);
  const packageGroups = [...new Set(packages.map(entry => entry.group))];

  return (
    <div className={styles.pluginOverview}>
      <section aria-labelledby="plugin-evaluation-heading">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Overview</p>
          <h2 id="plugin-evaluation-heading">Should I adopt this plugin?</h2>
        </div>
        <dl
          className={styles.decisionSummary}
          aria-label="Plugin evaluation summary"
        >
          <div>
            <dt>Last updated</dt>
            <dd>
              {summary.release.status === 'unavailable' ? (
                'Not reported'
              ) : (
                <>
                  <strong>{summary.release.version}</strong>
                  <span>{summary.release.age}</span>
                  <span>{releaseStatus(summary.release.status)}</span>
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>Backstage source</dt>
            <dd>
              {summary.backstage.status === 'unavailable' ? (
                'Not reported'
              ) : (
                <>
                  <strong>Built with Backstage {summary.backstage.version}</strong>
                  {backstageComparison(summary.backstage.versionsBehind) && (
                    <span>
                      {backstageComparison(summary.backstage.versionsBehind)}
                    </span>
                  )}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>Functionality</dt>
            <dd>
              {summary.functionality.length > 0
                ? `${summary.functionality.length} adoption outcomes reported`
                : 'Not reported'}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="functionality-heading">
        <h2 id="functionality-heading">What it offers</h2>
        {summary.functionality.length > 0 ? (
          <ul className={styles.outcomeList}>
            {summary.functionality.map(outcome => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        ) : (
          <p>No functionality details reported.</p>
        )}
      </section>

      <section aria-labelledby="packages-heading">
        <h2 id="packages-heading">Packages</h2>
        {packageGroups.length > 0 ? (
          <div className={styles.packageGroups}>
            {packageGroups.map(group => {
              const entries = packages.filter(entry => entry.group === group);
              return (
                <section key={group} aria-labelledby={`package-group-${group}`}>
                  <h3 id={`package-group-${group}`}>
                    {entries[0].groupLabel}
                  </h3>
                  <ul>
                    {entries.map(entry => {
                      const version =
                        entry.snapshot.npm.status === 'unavailable'
                          ? 'Not reported'
                          : entry.snapshot.npm.latestVersion;
                      return (
                        <li key={entry.npmPackageName}>
                          <button
                            type="button"
                            className={styles.packageEntry}
                            onClick={() => onSelectPackage(entry.npmPackageName)}
                          >
                            <span>
                              <strong>{entry.label}</strong>
                              <code>{entry.npmPackageName}</code>
                            </span>
                            <span>
                              {entry.functionality ?? 'Role not reported'} ·{' '}
                              {version}
                            </span>
                            <span aria-hidden="true">→</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <p>No package details reported.</p>
        )}
      </section>
    </div>
  );
}
