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
import React, { useState } from 'react';

import { CopyButton } from './CopyButton';
import { PackageSelect } from './PackageSelect';
import styles from './pluginDirectory.module.scss';

interface InstallGuideProps {
  plugin: PluginData;
}

function inferPackageRole(name: string): string {
  return name.includes('-backend') ? 'backend' : 'frontend';
}

interface InstallPackage {
  name: string;
  role: string;
}

function getInstallPackages(plugin: PluginData): InstallPackage[] {
  const snapshotPackages = plugin.snapshot?.packages;
  if (snapshotPackages && snapshotPackages.length > 0) {
    return snapshotPackages.map(packageSnapshot => ({
      name: packageSnapshot.npmPackageName,
      role:
        packageSnapshot.functionality ??
        inferPackageRole(packageSnapshot.npmPackageName),
    }));
  }

  return [
    { name: plugin.npmPackageName, role: inferPackageRole(plugin.npmPackageName) },
  ];
}

export function InstallGuide({ plugin }: InstallGuideProps) {
  const packages = getInstallPackages(plugin);
  const [selectedPackageName, setSelectedPackageName] = useState(
    packages[0]?.name,
  );
  const selectedPackage =
    packages.find(packageSetup => packageSetup.name === selectedPackageName) ??
    packages[0];

  return (
    <div className={styles.installGuide}>
      <section className={styles.setupStep} aria-labelledby="setup-install">
        <h2 id="setup-install">Install</h2>
        {selectedPackage ? (
          <>
            {packages.length > 1 && (
              <PackageSelect
                value={selectedPackage.name}
                options={packages.map(packageSetup => ({
                  value: packageSetup.name,
                  label: `${packageSetup.name} (${packageSetup.role})`,
                }))}
                onChange={setSelectedPackageName}
              />
            )}
            <span className={styles.packageRole}>{selectedPackage.role}</span>
            <div className={styles.codeRow}>
              <pre>
                <code>{`yarn add ${selectedPackage.name}`}</code>
              </pre>
              <CopyButton
                value={`yarn add ${selectedPackage.name}`}
                label={`${selectedPackage.role} install command`}
              />
            </div>
          </>
        ) : (
          <p>No package installs declared.</p>
        )}
      </section>
    </div>
  );
}
