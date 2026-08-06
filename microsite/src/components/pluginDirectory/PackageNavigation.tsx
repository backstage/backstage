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
import React, { useState } from 'react';
import type { PackagePresentation } from './packagePresentation';
import { PackageSelect } from './PackageSelect';
import styles from './pluginDirectory.module.scss';

interface PackageNavigationProps {
  packages: readonly PackagePresentation[];
  selectedPackageName?: string;
  onSelectPackage: (npmPackageName: string) => void;
  standalone?: boolean;
}

export function PackageNavigation({
  packages,
  selectedPackageName,
  onSelectPackage,
  standalone = false,
}: PackageNavigationProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPackages = packages.filter(entry =>
    `${entry.label} ${entry.npmPackageName}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
  const groups = [...new Set(filteredPackages.map(entry => entry.group))];

  return (
    <>
      {!standalone && selectedPackageName && (
        <div className={styles.mobilePackageSelect}>
          <PackageSelect
            value={selectedPackageName}
            options={packages.map(entry => ({
              value: entry.npmPackageName,
              label: entry.label,
              group: entry.groupLabel,
            }))}
            onChange={onSelectPackage}
            label="Choose a package"
          />
        </div>
      )}
      <nav
        className={`${styles.packageNavigation} ${
          standalone ? styles.packageNavigationStandalone : ''
        }`}
        aria-label="Packages"
      >
        <label className={styles.packageSearchLabel}>
          Search packages
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </label>
        <div className={styles.packageNavigationGroups}>
          {groups.map(group => {
            const entries = filteredPackages.filter(
              entry => entry.group === group,
            );
            return (
              <div
                key={group}
                role="group"
                aria-labelledby={`package-navigation-${group}`}
              >
                <h3 id={`package-navigation-${group}`}>
                  {entries[0].groupLabel}
                </h3>
                {entries.map(entry => (
                  <button
                    key={entry.npmPackageName}
                    type="button"
                    className={styles.packageNavigationItem}
                    aria-current={
                      entry.npmPackageName === selectedPackageName
                        ? 'page'
                        : undefined
                    }
                    onClick={() => onSelectPackage(entry.npmPackageName)}
                  >
                    <strong>{entry.label}</strong>
                    <code>{entry.npmPackageName}</code>
                  </button>
                ))}
              </div>
            );
          })}
          {filteredPackages.length === 0 && (
            <p>No packages match your search</p>
          )}
        </div>
      </nav>
    </>
  );
}
