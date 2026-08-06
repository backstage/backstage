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
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React, { useState } from 'react';
import type { PluginData } from '../../pluginDirectory/manifest';
import { ConfigureGuide } from './ConfigureGuide';
import { InstallGuide } from './InstallGuide';
import { PackageReadme } from './PackageReadme';
import { PluginHeader } from './PluginHeader';
import { PluginOverview } from './PluginOverview';
import styles from './pluginDirectory.module.scss';

interface PluginDetailPageProps {
  plugin: PluginData;
  latestBackstageVersion: string | null;
}

export default function PluginDetailPage({
  plugin,
  latestBackstageVersion,
}: PluginDetailPageProps) {
  const packages = plugin.snapshot?.packages ?? [];
  const [selectedPackageName, setSelectedPackageName] = useState<
    string | undefined
  >();
  const selectedPackage = packages.find(
    packageSnapshot =>
      packageSnapshot.npmPackageName === selectedPackageName,
  );

  return (
    <Layout
      title={plugin.title}
      description={plugin.description}
      wrapperClassName={styles.detailPage}
    >
      <main className="container margin-vert--lg">
        <article className={styles.detailArticle}>
          <PluginHeader
            plugin={plugin}
            latestBackstageVersion={latestBackstageVersion}
          />
          <PluginOverview
            plugin={plugin}
            latestBackstageVersion={latestBackstageVersion}
            onSelectPackage={setSelectedPackageName}
          />
          {selectedPackage && (
            <section aria-labelledby="selected-package-heading">
              <h2 id="selected-package-heading">
                {selectedPackage.npmPackageName}
              </h2>
              <Tabs>
                <TabItem value="readme" label="README" default>
                  <PackageReadme packageSnapshot={selectedPackage} />
                </TabItem>
                <TabItem value="install" label="Install">
                  <InstallGuide
                    packageSnapshot={selectedPackage}
                    primaryNpmPackageName={plugin.npmPackageName}
                  />
                </TabItem>
                <TabItem value="configure" label="Configure">
                  <ConfigureGuide
                    packageSnapshot={selectedPackage}
                    packages={packages}
                    primaryNpmPackageName={plugin.npmPackageName}
                  />
                </TabItem>
              </Tabs>
            </section>
          )}
        </article>
      </main>
    </Layout>
  );
}
