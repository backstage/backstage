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
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { PluginData } from '../../pluginDirectory/manifest';
import { fetchPackageReadme } from '../../pluginDirectory/npmRegistryClient';
import { resolveFunctionality } from '../../pluginDirectory/packageRoles';
import { packageOptionLabel } from './packageOptionLabel';
import { PackageSelect } from './PackageSelect';
import styles from './pluginDirectory.module.scss';

interface PackageReadmeProps {
  plugin: PluginData;
}

type ReadmeState =
  | { status: 'loading' }
  | { status: 'ready'; value: string | undefined }
  | { status: 'error' }
  | { status: 'unavailable' }; // no known npm version to fetch against

function usePackageReadme(
  npmPackageName: string | undefined,
  version: string | undefined,
): ReadmeState {
  const [state, setState] = useState<ReadmeState>({ status: 'loading' });

  useEffect(() => {
    if (!npmPackageName || !version) {
      setState({ status: 'unavailable' });
      return undefined;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    fetchPackageReadme(npmPackageName, version).then(result => {
      if (cancelled) {
        return;
      }
      if (result.status === 'error') {
        console.error(
          `Failed to load README for ${npmPackageName}@${version}`,
          result.error,
        );
        setState({ status: 'error' });
        return;
      }
      setState({ status: 'ready', value: result.value });
    });

    return () => {
      cancelled = true;
    };
  }, [npmPackageName, version]);

  return state;
}

export function PackageReadme({ plugin }: PackageReadmeProps) {
  const packages = plugin.snapshot?.packages ?? [];
  const [selectedPackageName, setSelectedPackageName] = useState<
    string | undefined
  >(plugin.npmPackageName);

  const selectedPackage =
    packages.find(
      packageSnapshot => packageSnapshot.npmPackageName === selectedPackageName,
    ) ?? packages[0];
  const selectedVersion =
    selectedPackage && selectedPackage.npm.status !== 'unavailable'
      ? selectedPackage.npm.latestVersion
      : undefined;
  const state = usePackageReadme(selectedPackage?.npmPackageName, selectedVersion);

  if (packages.length === 0 || !selectedPackage) {
    return null;
  }

  return (
    <section className={styles.setupStep} aria-labelledby="overview-readme">
      <h2 id="overview-readme">README</h2>
      {packages.length > 1 && (
        <PackageSelect
          value={selectedPackage.npmPackageName}
          options={packages.map(packageSnapshot => ({
            value: packageSnapshot.npmPackageName,
            label: packageOptionLabel({
              npmPackageName: packageSnapshot.npmPackageName,
              functionality: resolveFunctionality(
                packageSnapshot,
                plugin.npmPackageName,
              ),
            }),
          }))}
          onChange={setSelectedPackageName}
        />
      )}
      {state.status === 'loading' && <p role="status">Loading README…</p>}
      {(state.status === 'unavailable' ||
        (state.status === 'ready' && state.value === undefined)) && (
        <p>No README available for this package.</p>
      )}
      {state.status === 'error' && (
        <p role="alert">Couldn&apos;t load this package&apos;s README.</p>
      )}
      {state.status === 'ready' && state.value !== undefined && (
        <div className={styles.readmeContent}>
          <ReactMarkdown>{state.value}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
