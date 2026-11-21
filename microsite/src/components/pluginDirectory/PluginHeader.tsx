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
import type { PluginData } from '../../pluginDirectory/plugin';
import React from 'react';

import { getBackstageSupport } from './packagePresentation';
import { BackstageIcon, DocumentIcon } from './ReleaseIcons';
import styles from './pluginDirectory.module.scss';

interface PluginHeaderProps {
  plugin: PluginData;
  latestBackstageVersion?: string | null;
}

export function PluginHeader({
  plugin,
  latestBackstageVersion,
}: PluginHeaderProps) {
  const support = getBackstageSupport(plugin, latestBackstageVersion ?? null);

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
      <ul className={styles.releaseBadges} aria-label="Plugin summary">
        <li className={styles.releaseBadge}>
          <BackstageIcon />
          <div className={styles.releaseBadgeDetails}>
            {support.status === 'unavailable' ? (
              <span>Backstage source not reported</span>
            ) : (
              <>
                <strong>Supports Backstage {support.version}</strong>
                {support.versionsBehind !== undefined && (
                  <span>
                    {support.versionsBehind === 0
                      ? 'up to date'
                      : `${support.versionsBehind} ${
                          support.versionsBehind === 1 ? 'version' : 'versions'
                        } behind`}
                  </span>
                )}
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
