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
import { BackstageIcon, DocumentIcon, NpmIcon } from './ReleaseIcons';
import styles from './pluginDirectory.module.scss';

interface PluginHeaderProps {
  plugin: PluginData;
  latestBackstageVersion?: string | null;
  now?: Date;
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

  return (
    <header className={styles.detailHeader}>
      <div className={styles.headerTop}>
        <div>
          <h1>{plugin.title}</h1>
          <p className={styles.byline}>
            by <Link to={plugin.authorUrl}>{plugin.author}</Link>
          </p>
        </div>
      </div>

      <p className={styles.description}>{plugin.description}</p>
      <ul
        className={styles.releaseBadges}
        aria-label="Plugin evaluation summary"
      >
        <li className={styles.releaseBadge}>
          <NpmIcon />
          <div className={styles.releaseBadgeDetails}>
            {summary.release.status === 'unavailable' ? (
              <span>npm release not reported</span>
            ) : (
              <>
                <strong>{summary.release.version}</strong>
                <span>published {summary.release.age}</span>
              </>
            )}
          </div>
        </li>
        <li className={styles.releaseBadge}>
          <BackstageIcon />
          <div className={styles.releaseBadgeDetails}>
            {summary.backstage.status === 'unavailable' ? (
              <span>Backstage source not reported</span>
            ) : (
              <>
                <strong>{summary.backstage.version}</strong>
                <span>{summary.backstage.age}</span>
              </>
            )}
          </div>
        </li>
        <li>
          <a className={styles.releaseBadge} href={plugin.documentation}>
            <DocumentIcon />
            <span>Documentation</span>
          </a>
        </li>
      </ul>
    </header>
  );
}
