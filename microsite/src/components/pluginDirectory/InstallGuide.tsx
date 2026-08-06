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
import type { PackageSnapshot } from '../../pluginDirectory/manifest';
import { resolveFunctionality } from '../../pluginDirectory/packageRoles';
import React from 'react';

import { CopyButton } from './CopyButton';
import styles from './pluginDirectory.module.scss';

interface InstallGuideProps {
  packageSnapshot: PackageSnapshot;
  primaryNpmPackageName: string;
}

function inferPackageRole(name: string): string {
  return name.includes('-backend') ? 'backend' : 'frontend';
}

// Covers both the raw `backstage.role` values (`backend-plugin`,
// `backend-plugin-module`) and the short forms `inferPackageRole` /
// `resolveFunctionality` fall back to (`backend`, `backend-module`), so
// backend plugins and backend modules both get the `backend.add(...)`
// wiring snippet below.
function isBackendPackage(role: string): boolean {
  return role.startsWith('backend');
}


export function InstallGuide({
  packageSnapshot,
  primaryNpmPackageName,
}: InstallGuideProps) {
  const packageRole =
    resolveFunctionality(packageSnapshot, primaryNpmPackageName) ??
    inferPackageRole(packageSnapshot.npmPackageName);
  const installCommand = `yarn add ${packageSnapshot.npmPackageName}`;
  const backendCommand = `backend.add(import('${packageSnapshot.npmPackageName}'));`;

  return (
    <div className={styles.installGuide}>
      <section className={styles.setupStep} aria-label="Install">
        <span className={styles.packageRole}>{packageRole}</span>
        <h2>1. Add the package</h2>
        <div className={styles.codeRow}>
          <pre>
            <code>{installCommand}</code>
          </pre>
          <CopyButton
            value={installCommand}
            label={`${packageRole} install command`}
          />
        </div>
        {isBackendPackage(packageRole) && (
          <>
            <h2>2. Add it to the backend</h2>
            <p>
              Register the package in{' '}
              <code>packages/backend/src/index.ts</code>:
            </p>
            <div className={styles.codeRow}>
              <pre>
                <code>{backendCommand}</code>
              </pre>
              <CopyButton
                value={backendCommand}
                label="backend wiring command"
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
