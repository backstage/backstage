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
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import { resolveFunctionality } from '../../pluginDirectory/packageRoles';
import React from 'react';

import { CopyButton } from './CopyButton';
import { getNpmPackageUrl } from './healthPresentation';
import styles from './pluginDirectory.module.scss';

interface InstallGuideProps {
  packageSnapshot: PackageSnapshot;
  primaryNpmPackageName: string;
}

type InstallTarget = 'frontend' | 'backend' | 'library' | 'unknown';

// `functionality` is either a raw `backstage.role` (`frontend-plugin`,
// `backend-plugin-module`, `common-library`, ...) or the short form inferred
// from the package name (`frontend`, `module`, `backend`, `backend-module`,
// `common`, `node`, `react`). Both forms are covered, and nothing that isn't
// recognized is guessed to be a frontend package.
function getInstallTarget(functionality: string | undefined): InstallTarget {
  switch (functionality) {
    case 'frontend-plugin':
    case 'frontend-plugin-module':
    case 'frontend':
    case 'module':
      return 'frontend';
    case 'backend-plugin':
    case 'backend-plugin-module':
    case 'backend':
    case 'backend-module':
      return 'backend';
    case 'common':
    case 'node':
    case 'react':
      return 'library';
    case undefined:
      return 'unknown';
    default:
      return functionality.endsWith('-library') ? 'library' : 'unknown';
  }
}

function CodeRow({ command, label }: { command: string; label: string }) {
  return (
    <div className={styles.codeRow}>
      <pre>
        <code>{command}</code>
      </pre>
      <CopyButton value={command} label={label} />
    </div>
  );
}

export function InstallGuide({
  packageSnapshot,
  primaryNpmPackageName,
}: InstallGuideProps) {
  const { npmPackageName } = packageSnapshot;
  const functionality = resolveFunctionality(
    packageSnapshot,
    primaryNpmPackageName,
  );
  const target = getInstallTarget(functionality);
  const label = `${functionality ?? 'package'} install command`;
  const readmeUrl = `${getNpmPackageUrl(npmPackageName)}#readme`;

  return (
    <div className={styles.installGuide}>
      <section className={styles.setupStep} aria-label="Install">
        <h2>1. Add the package</h2>
        {target === 'frontend' && (
          <>
            <CodeRow
              command={`yarn --cwd packages/app add ${npmPackageName}`}
              label={label}
            />
            <h2>2. Add it to the app</h2>
            <p>
              Frontend packages that use the new frontend system are picked up
              by feature discovery once they are installed. Otherwise, register
              the package in <code>packages/app/src/App.tsx</code> as described
              in <a href={readmeUrl}>the package README</a>.
            </p>
          </>
        )}
        {target === 'backend' && (
          <>
            <CodeRow
              command={`yarn --cwd packages/backend add ${npmPackageName}`}
              label={label}
            />
            <h2>2. Add it to the backend</h2>
            <p>
              Register the package in <code>packages/backend/src/index.ts</code>
              :
            </p>
            <CodeRow
              command={`backend.add(import('${npmPackageName}'));`}
              label="backend wiring command"
            />
          </>
        )}
        {(target === 'library' || target === 'unknown') && (
          <>
            <p>
              This is a library package; add it to the package that uses it.
              {target === 'unknown' && (
                <>
                  {' '}
                  Its role isn&apos;t known, so check{' '}
                  <a href={readmeUrl}>the package README</a> for how to set it
                  up.
                </>
              )}
            </p>
            <CodeRow
              command={`yarn --cwd <package-dir> add ${npmPackageName}`}
              label={label}
            />
          </>
        )}
      </section>
    </div>
  );
}
