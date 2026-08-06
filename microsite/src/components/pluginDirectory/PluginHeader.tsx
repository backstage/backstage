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
import Link from '@docusaurus/Link';
import type { PluginData } from '@site/src/pluginDirectory/manifest';
import React from 'react';

import { getPluginDecisionSummary } from './packagePresentation';
import { ResourceIcons } from './ResourceIcons';
import styles from './pluginDirectory.module.scss';

interface PluginHeaderProps {
  plugin: PluginData;
  latestBackstageVersion?: string | null;
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
  return `${versionsBehind} minor ${
    versionsBehind === 1 ? 'release' : 'releases'
  } behind`;
}

export function PluginHeader({
  plugin,
  latestBackstageVersion,
  now,
}: PluginHeaderProps) {
  const summary = getPluginDecisionSummary(
    plugin,
    latestBackstageVersion,
    now,
  );
  const comparison =
    summary.backstage.status === 'unavailable'
      ? undefined
      : backstageComparison(summary.backstage.versionsBehind);

  return (
    <header className={styles.detailHeader}>
      <div className={styles.headerTop}>
        <div>
          <h1>{plugin.title}</h1>
          <p className={styles.byline}>
            by <Link to={plugin.authorUrl}>{plugin.author}</Link>
          </p>
        </div>
        <ResourceIcons plugin={plugin} />
      </div>

      <p className={styles.description}>{plugin.description}</p>
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
                {comparison && <span>{comparison}</span>}
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
    </header>
  );
}
