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
import React from 'react';

import { CopyButton } from './CopyButton';
import { SetupFallback } from './SetupFallback';
import styles from './pluginDirectory.module.scss';

interface InstallGuideProps {
  plugin: PluginData;
}

export function InstallGuide({ plugin }: InstallGuideProps) {
  if (!plugin.setup) {
    return <SetupFallback />;
  }

  const { packages = [], frontend, integration = [] } = plugin.setup;
  const routes = frontend?.routes ?? [];
  const extensions = frontend?.extensions ?? [];

  return (
    <div className={styles.installGuide}>
      <section className={styles.setupStep} aria-labelledby="setup-install">
        <h2 id="setup-install">Install</h2>
        {packages.length > 0 ? (
          <ul className={styles.installList}>
            {packages.map((packageSetup, index) => {
              const command = `yarn add ${packageSetup.name}`;
              return (
                <li key={`${packageSetup.role}-${packageSetup.name}-${index}`}>
                  <span className={styles.packageRole}>
                    {packageSetup.role}
                  </span>
                  <div className={styles.codeRow}>
                    <pre>
                      <code>{command}</code>
                    </pre>
                    <CopyButton
                      value={command}
                      label={`${packageSetup.role} install command`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No package installs declared.</p>
        )}
      </section>

      <section className={styles.setupStep} aria-labelledby="setup-integrate">
        <h2 id="setup-integrate">Integrate</h2>

        <section className={styles.contributionGroup}>
          <h3>Routes added</h3>
          {routes.length > 0 ? (
            <ul className={styles.contributionList}>
              {routes.map(route => (
                <li key={`${route.type}-${route.name}`}>
                  <div className={styles.contributionTitle}>
                    <code>{route.name}</code>
                    <span>{route.type}</span>
                  </div>
                  <p>{route.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No frontend routes declared.</p>
          )}
        </section>

        <section className={styles.contributionGroup}>
          <h3>Extensions added</h3>
          {extensions.length > 0 ? (
            <ul className={styles.contributionList}>
              {extensions.map(extension => (
                <li key={extension.id}>
                  <div className={styles.contributionTitle}>
                    <code>{extension.id}</code>
                    <span>{extension.kind}</span>
                  </div>
                  <p>{extension.description}</p>
                  <p className={styles.extensionState}>
                    {extension.enabledByDefault
                      ? 'Enabled by default'
                      : 'Disabled by default'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No frontend extensions declared.</p>
          )}
        </section>

        {integration.length > 0 && (
          <div className={styles.integrationList}>
            {integration.map(snippet => (
              <article className={styles.integrationSnippet} key={snippet.title}>
                <p className={styles.snippetTitle}>
                  <strong>{snippet.title}</strong>
                </p>
                <p>{snippet.explanation}</p>
                <div className={styles.codeRow}>
                  <div className={styles.codeBlock}>
                    <span
                      className={styles.snippetLanguage}
                      aria-label={`Language: ${snippet.language}`}
                    >
                      {snippet.language}
                    </span>
                    <pre data-language={snippet.language}>
                      <code className={`language-${snippet.language}`}>
                        {snippet.source}
                      </code>
                    </pre>
                  </div>
                  <CopyButton
                    value={snippet.source}
                    label={`${snippet.title} snippet`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
