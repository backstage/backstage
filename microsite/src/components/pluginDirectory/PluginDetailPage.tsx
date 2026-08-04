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
import type { PluginData } from '@site/src/pluginDirectory/manifest';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React from 'react';

import { ConfigureGuide } from './ConfigureGuide';
import { HealthSummary } from './HealthSummary';
import { InstallGuide } from './InstallGuide';
import { PluginHeader } from './PluginHeader';
import styles from './pluginDirectory.module.scss';

interface PluginDetailPageProps {
  plugin: PluginData;
}

export default function PluginDetailPage({ plugin }: PluginDetailPageProps) {
  return (
    <Layout title={plugin.title} description={plugin.description}>
      <main className={`container padding-vert--lg ${styles.detailPage}`}>
        <nav aria-label="Breadcrumbs" className="margin-bottom--lg">
          <ul className="breadcrumbs">
            <li className="breadcrumbs__item">
              <Link className="breadcrumbs__link" to="/plugins">
                Plugin directory
              </Link>
            </li>
            <li className="breadcrumbs__item breadcrumbs__item--active">
              <span className="breadcrumbs__link" aria-current="page">
                {plugin.title}
              </span>
            </li>
          </ul>
        </nav>

        <article className={styles.detailArticle}>
          <PluginHeader plugin={plugin} />

          <Tabs>
            <TabItem value="overview" label="Overview">
              <HealthSummary plugin={plugin} />
            </TabItem>
            <TabItem value="install" label="Install">
              <InstallGuide plugin={plugin} />
            </TabItem>
            <TabItem value="configure" label="Configure">
              <ConfigureGuide plugin={plugin} />
            </TabItem>
          </Tabs>
        </article>
      </main>
    </Layout>
  );
}
