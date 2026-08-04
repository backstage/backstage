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
import React from 'react';

import {
  formatReleaseAge,
  getNpmPackageUrl,
  statusPresentations,
} from './healthPresentation';
import type { PluginData } from '../../pluginDirectory/manifest';
import styles from './pluginDirectory.module.scss';

interface CompatibilityBadgesProps {
  plugin: PluginData;
  now?: Date;
}

export function CompatibilityBadges({
  plugin,
  now = new Date(),
}: CompatibilityBadgesProps) {
  const npmSnapshot = plugin.snapshot?.npm;
  const backstageSnapshot = plugin.snapshot?.backstage;
  const npmPresentation =
    statusPresentations[npmSnapshot?.status ?? 'unavailable'];
  const backstagePresentation =
    statusPresentations[backstageSnapshot?.status ?? 'unavailable'];

  return (
    <div className={styles.compatibilityBadges}>
      {npmSnapshot && npmSnapshot.status !== 'unavailable' ? (
        <a
          className={`${styles.compatibilityBadge} ${npmPresentation.indicatorClassName}`}
          href={getNpmPackageUrl(plugin)}
          title={`Released ${formatReleaseAge(
            npmSnapshot.lastPublishedAt,
            now,
          )}`}
        >
          <span className={styles.statusSymbol} aria-hidden="true">
            {npmPresentation.symbol}
          </span>
          npm {npmSnapshot.latestVersion}
        </a>
      ) : (
        <span
          className={`${styles.compatibilityBadge} ${npmPresentation.indicatorClassName}`}
        >
          <span className={styles.statusSymbol} aria-hidden="true">
            {npmPresentation.symbol}
          </span>
          npm Unavailable
        </span>
      )}

      {backstageSnapshot && backstageSnapshot.status !== 'unavailable' ? (
        <a
          className={`${styles.compatibilityBadge} ${backstagePresentation.indicatorClassName}`}
          href={backstageSnapshot.sourceUrl}
        >
          <span className={styles.statusSymbol} aria-hidden="true">
            {backstagePresentation.symbol}
          </span>
          Backstage {backstageSnapshot.version}
        </a>
      ) : (
        <span
          className={`${styles.compatibilityBadge} ${backstagePresentation.indicatorClassName}`}
        >
          <span className={styles.statusSymbol} aria-hidden="true">
            {backstagePresentation.symbol}
          </span>
          Backstage Unavailable
        </span>
      )}
    </div>
  );
}
