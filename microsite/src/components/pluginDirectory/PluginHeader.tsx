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

import { countMinorVersionsBehind } from './healthPresentation';
import { ResourceIcons } from './ResourceIcons';
import styles from './pluginDirectory.module.scss';

interface PluginHeaderProps {
  plugin: PluginData;
  latestBackstageVersion?: string | null;
}

export function PluginHeader({
  plugin,
  latestBackstageVersion,
}: PluginHeaderProps) {
  const backstageSnapshot = plugin.snapshot?.backstage;
  const builtWithVersion =
    backstageSnapshot && backstageSnapshot.status !== 'unavailable'
      ? backstageSnapshot.version
      : undefined;
  const versionsBehind =
    builtWithVersion && latestBackstageVersion
      ? countMinorVersionsBehind(builtWithVersion, latestBackstageVersion)
      : undefined;

  return (
    <header className={styles.detailHeader}>
      <div className={styles.headerTop}>
        <div>
          <h1>
            {plugin.title}
            {builtWithVersion && (
              <span className={styles.builtWithVersion}>
                built with Backstage v{builtWithVersion}
              </span>
            )}
          </h1>
          <p className={styles.byline}>
            by <Link to={plugin.authorUrl}>{plugin.author}</Link>
            {!!versionsBehind && (
              <span className={styles.versionsBehind}>
                {' '}
                · {versionsBehind} version{versionsBehind === 1 ? '' : 's'}{' '}
                behind
              </span>
            )}
          </p>
        </div>
        <ResourceIcons plugin={plugin} />
      </div>

      <p className={styles.description}>{plugin.description}</p>
    </header>
  );
}
