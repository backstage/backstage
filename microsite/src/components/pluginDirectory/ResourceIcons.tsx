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

import { getNpmPackageUrl, getPrimaryPackageSnapshot } from './healthPresentation';
import type { PluginData } from '../../pluginDirectory/manifest';
import styles from './pluginDirectory.module.scss';

interface ResourceIconsProps {
  plugin: PluginData;
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 1.5A.5.5 0 0 1 3.5 1h6.086a.5.5 0 0 1 .353.146l2.915 2.915a.5.5 0 0 1 .146.353V14.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-13ZM9 2H4v12h8V4.5H9.5A.5.5 0 0 1 9 4V2Zm1 .707V3.5h.793L10 2.707ZM5 7h6v1H5V7Zm0 2.5h6v1H5v-1Z"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.752.066a.5.5 0 0 1 .496 0l6.5 3.75a.5.5 0 0 1 .252.434v7.5a.5.5 0 0 1-.252.434l-6.5 3.75a.5.5 0 0 1-.496 0l-6.5-3.75A.5.5 0 0 1 1 11.75v-7.5a.5.5 0 0 1 .252-.434l6.5-3.75ZM2 5.184v6.278l5.5 3.175v-6.278L2 5.184Zm6.5 9.453 5.5-3.175V5.184l-5.5 3.175v6.278ZM7.5.997 2.246 4.003 8 7.283l5.754-3.28L7.5.997Z"
      />
    </svg>
  );
}

function RepositoryIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 5 3.25Zm6.5 0a2.25 2.25 0 1 1-3 2.122c0-.076.003-.15.008-.225A2.75 2.75 0 0 1 11 3.5c.24 0 .47.032.69.09a2.25 2.25 0 0 1 2.06 2.16h1.5a3.75 3.75 0 0 0-4.06-3.735 2.25 2.25 0 0 1 .31-1.147V3.25Z"
      />
    </svg>
  );
}

export function ResourceIcons({ plugin }: ResourceIconsProps) {
  const npmSnapshot = getPrimaryPackageSnapshot(plugin)?.npm;
  const repositoryUrl =
    npmSnapshot && npmSnapshot.status !== 'unavailable'
      ? npmSnapshot.repository?.url
      : undefined;

  return (
    <div className={styles.resourceIcons}>
      <a className={styles.resourceIcon} href={plugin.documentation}>
        <DocumentIcon />
        <span>Documentation</span>
      </a>
      <a
        className={styles.resourceIcon}
        href={getNpmPackageUrl(plugin.npmPackageName)}
      >
        <PackageIcon />
        <span>npm package</span>
      </a>
      {repositoryUrl && (
        <a className={styles.resourceIcon} href={repositoryUrl}>
          <RepositoryIcon />
          <span>Repository</span>
        </a>
      )}
    </div>
  );
}
