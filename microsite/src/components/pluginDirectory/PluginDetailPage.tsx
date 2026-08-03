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
import React from 'react';

interface PluginDetailPageProps {
  plugin: PluginData;
}

export default function PluginDetailPage({ plugin }: PluginDetailPageProps) {
  const npmSnapshot = plugin.snapshot?.npm;
  const repositoryUrl =
    npmSnapshot && npmSnapshot.status !== 'unavailable'
      ? npmSnapshot.repository.url
      : undefined;

  return (
    <Layout title={plugin.title} description={plugin.description}>
      <main className="container padding-vert--lg">
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

        <article>
          <header>
            <h1>{plugin.title}</h1>
            <p>
              by <Link to={plugin.authorUrl}>{plugin.author}</Link>
            </p>
          </header>

          <p className="margin-top--lg">{plugin.description}</p>

          <section
            className="margin-top--lg"
            aria-labelledby="plugin-resources"
          >
            <h2 id="plugin-resources">Resources</h2>
            <ul>
              <li>
                <Link to={plugin.documentation}>Documentation</Link>
              </li>
              <li>
                <Link
                  to={`https://www.npmjs.com/package/${plugin.npmPackageName}`}
                >
                  npm package
                </Link>
              </li>
              {repositoryUrl && (
                <li>
                  <Link to={repositoryUrl}>Repository</Link>
                </li>
              )}
            </ul>
          </section>
        </article>
      </main>
    </Layout>
  );
}
