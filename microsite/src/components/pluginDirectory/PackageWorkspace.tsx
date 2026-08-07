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
import React, { useEffect, useRef, useState } from 'react';
import { ConfigureGuide } from './ConfigureGuide';
import { InstallGuide } from './InstallGuide';
import type { PackagePresentation } from './packagePresentation';
import { PackageContext } from './PackageContext';
import { PackageNavigation } from './PackageNavigation';
import { PackageReadme } from './PackageReadme';
import styles from './pluginDirectory.module.scss';
import type { PackageTab } from './usePackageWorkspaceState';

interface PackageWorkspaceProps {
  plugin: PluginData;
  packages: readonly PackagePresentation[];
  packagePresentation: PackagePresentation;
  selectedTab: PackageTab;
  onSelectPackage: (npmPackageName: string) => void;
  onSelectTab: (tab: PackageTab) => void;
}

const tabs: ReadonlyArray<{ id: PackageTab; label: string }> = [
  { id: 'readme', label: 'README' },
  { id: 'install', label: 'Install' },
  { id: 'configure', label: 'Configure' },
];

export function PackageWorkspace({
  plugin,
  packages,
  packagePresentation,
  selectedTab,
  onSelectPackage,
  onSelectTab,
}: PackageWorkspaceProps) {
  const packageSnapshots = packages.map(entry => entry.snapshot);
  const [visitedTabs, setVisitedTabs] = useState<ReadonlySet<PackageTab>>(
    () => new Set([selectedTab]),
  );
  const tabIdPrefix = `package-${packagePresentation.npmPackageName.replace(
    /[^a-zA-Z0-9]+/g,
    '-',
  )}`;
  const packageContentRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setVisitedTabs(current => {
      if (current.has(selectedTab)) {
        return current;
      }
      return new Set([...current, selectedTab]);
    });
  }, [selectedTab]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const content = packageContentRef.current;
    if (content) {
      // The browser resets scroll to the top when the package/tab query
      // params change; correct it on the next frame, once this package's
      // (min-height guarded) layout has settled.
      requestAnimationFrame(() => {
        content.scrollIntoView?.({ block: 'start' });
      });
    }
  }, [packagePresentation.npmPackageName, selectedTab]);

  return (
    <div className={styles.packageWorkspace}>
      <PackageNavigation
        packages={packages}
        selectedPackageName={packagePresentation.npmPackageName}
        onSelectPackage={onSelectPackage}
      />
      <section className={styles.packageContent} ref={packageContentRef}>
        <PackageContext
          plugin={plugin}
          packagePresentation={packagePresentation}
        />
        <div className={styles.packageTabs} role="tablist" aria-label="Package">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`${tabIdPrefix}-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.id}
              aria-controls={`${tabIdPrefix}-${tab.id}-panel`}
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map(tab => {
          if (!visitedTabs.has(tab.id) && selectedTab !== tab.id) {
            return null;
          }
          return (
            <div
              key={tab.id}
              id={`${tabIdPrefix}-${tab.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabIdPrefix}-${tab.id}-tab`}
              className={styles.packageTabPanel}
              hidden={selectedTab !== tab.id}
            >
              {tab.id === 'readme' && (
                <PackageReadme packageSnapshot={packagePresentation.snapshot} />
              )}
              {tab.id === 'install' && (
                <InstallGuide
                  packageSnapshot={packagePresentation.snapshot}
                  primaryNpmPackageName={plugin.npmPackageName}
                />
              )}
              {tab.id === 'configure' && (
                <ConfigureGuide
                  packageSnapshot={packagePresentation.snapshot}
                  packages={packageSnapshots}
                  primaryNpmPackageName={plugin.npmPackageName}
                />
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
