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
import React, { useEffect, useRef } from 'react';
import { formatReleaseAge, getNpmPackageUrl } from './healthPresentation';
import type { PackagePresentation } from './packagePresentation';
import { BackstageIcon, NpmIcon } from './ReleaseIcons';
import styles from './pluginDirectory.module.scss';

interface PackageContextProps {
  plugin: PluginData;
  packagePresentation: PackagePresentation;
  now?: Date;
}

function displayRole(functionality: string | undefined): string {
  if (!functionality) {
    return 'Not reported';
  }
  return functionality
    .split('-')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function PackageContext({
  plugin,
  packagePresentation,
  now,
}: PackageContextProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousPackageName = useRef(packagePresentation.npmPackageName);
  const npm = packagePresentation.snapshot.npm;
  const backstage = plugin.snapshot?.backstage;

  useEffect(() => {
    if (previousPackageName.current !== packagePresentation.npmPackageName) {
      previousPackageName.current = packagePresentation.npmPackageName;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [packagePresentation.npmPackageName]);

  return (
    <header className={styles.packageContext}>
      <p className={styles.eyebrow}>Package</p>
      <h2 ref={headingRef} tabIndex={-1}>
        {packagePresentation.label}
      </h2>
      <code>{packagePresentation.npmPackageName}</code>
      <dl aria-label="Package details">
        <div>
          <dt>Role</dt>
          <dd>{displayRole(packagePresentation.functionality)}</dd>
        </div>
      </dl>
      <ul
        className={styles.releaseBadges}
        aria-label="Package release summary"
      >
        <li className={styles.releaseBadge}>
          <NpmIcon />
          <div className={styles.releaseBadgeDetails}>
            {npm.status === 'unavailable' ? (
              <span>npm release not reported</span>
            ) : (
              <>
                <strong>{npm.latestVersion}</strong>
                <span>published {formatReleaseAge(npm.lastPublishedAt, now)}</span>
              </>
            )}
          </div>
        </li>
        <li className={styles.releaseBadge}>
          <BackstageIcon />
          <div className={styles.releaseBadgeDetails}>
            {backstage && backstage.status !== 'unavailable' ? (
              <>
                <strong>{backstage.version}</strong>
                <span>{formatReleaseAge(backstage.checkedAt, now)}</span>
              </>
            ) : (
              <span>Backstage source not reported</span>
            )}
          </div>
        </li>
      </ul>
      <div className={styles.packageContextLinks}>
        <a
          href={getNpmPackageUrl(packagePresentation.npmPackageName)}
          target="_blank"
          rel="noopener noreferrer"
        >
          npm package
        </a>
        {backstage && backstage.status !== 'unavailable' && (
          <a
            href={backstage.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source repository
          </a>
        )}
      </div>
    </header>
  );
}
