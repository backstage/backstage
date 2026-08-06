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
import Layout from '@theme/Layout';
import React from 'react';
import type { PluginData } from '../../pluginDirectory/manifest';
import { getPackagePresentations } from './packagePresentation';
import { PackageWorkspace } from './PackageWorkspace';
import { PluginHeader } from './PluginHeader';
import { PluginOverview } from './PluginOverview';
import styles from './pluginDirectory.module.scss';
import { usePackageWorkspaceState } from './usePackageWorkspaceState';

interface PluginDetailPageProps {
  plugin: PluginData;
  latestBackstageVersion: string | null;
}

export default function PluginDetailPage({
  plugin,
  latestBackstageVersion,
}: PluginDetailPageProps) {
  const packages = getPackagePresentations(plugin);
  const workspaceState = usePackageWorkspaceState(
    packages.map(entry => entry.npmPackageName),
  );
  const selectedPackage = packages.find(
    entry => entry.npmPackageName === workspaceState.selectedPackageName,
  );

  return (
    <Layout
      title={plugin.title}
      description={plugin.description}
      wrapperClassName={styles.detailPage}
    >
      <main className="container margin-vert--lg">
        <article className={styles.detailArticle}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/plugins">Plugin directory</Link>
              </li>
              <li>
                {selectedPackage ? (
                  <button
                    type="button"
                    onClick={workspaceState.selectOverview}
                  >
                    {plugin.title}
                  </button>
                ) : (
                  <span aria-current="page">{plugin.title}</span>
                )}
              </li>
              {selectedPackage && (
                <li>
                  <span aria-current="page">{selectedPackage.label}</span>
                </li>
              )}
            </ol>
          </nav>
          <PluginHeader
            plugin={plugin}
            latestBackstageVersion={latestBackstageVersion}
          />
          {selectedPackage ? (
            <PackageWorkspace
              plugin={plugin}
              packages={packages}
              packagePresentation={selectedPackage}
              selectedTab={workspaceState.selectedTab}
              onSelectPackage={workspaceState.selectPackage}
              onSelectTab={workspaceState.selectTab}
            />
          ) : (
            <PluginOverview
              plugin={plugin}
              latestBackstageVersion={latestBackstageVersion}
              onSelectPackage={workspaceState.selectPackage}
            />
          )}
        </article>
      </main>
    </Layout>
  );
}
