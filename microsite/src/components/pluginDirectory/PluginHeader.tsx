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
      <dl className={styles.headerFacts} aria-label="Plugin summary">
        <div>
          <dt>Supported Backstage version</dt>
          <dd>
            {support.status === 'unavailable' ? (
              'Backstage source not reported'
            ) : (
              <>
                v{support.version}
                {support.versionsBehind !== undefined && (
                  <span className={styles.headerFactNote}>
                    {support.versionsBehind === 0
                      ? '(up to date)'
                      : `(${support.versionsBehind} ${
                          support.versionsBehind === 1 ? 'version' : 'versions'
                        } behind)`}
                  </span>
                )}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Links</dt>
          <dd>
            <a
              href={plugin.documentation}
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs <span aria-hidden="true">↗</span>
            </a>
          </dd>
        </div>
      </dl>
    </header>
  );
}
