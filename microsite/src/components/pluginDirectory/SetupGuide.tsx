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
import {
  createInitialConfig,
  generateConfigYaml,
  validateConfig,
} from '../../pluginDirectory/config';
import type { ConfigValue } from '../../pluginDirectory/config';
import type { PluginData } from '../../pluginDirectory/manifest';
import React, { useMemo, useState } from 'react';

import { ConfigForm } from './ConfigForm';
import { CopyButton } from './CopyButton';
import styles from './pluginDirectory.module.scss';

interface SetupGuideProps {
  plugin: PluginData;
}

export function SetupGuide({ plugin }: SetupGuideProps) {
  const configSchema = plugin.setup?.config?.schema;
  const [configValue, setConfigValue] = useState<ConfigValue>(() =>
    configSchema ? createInitialConfig(configSchema) : undefined,
  );
  const configErrors = useMemo(
    () => (configSchema ? validateConfig(configSchema, configValue) : []),
    [configSchema, configValue],
  );
  const generatedYaml =
    configSchema && configErrors.length === 0
      ? generateConfigYaml(configSchema, configValue)
      : '';

  if (!plugin.setup) {
    return (
      <section className={styles.setupFallback} aria-label="Setup guide">
        <strong>Setup guide not provided</strong>
        <p>
          Use the documentation and package resources below for installation
          instructions.
        </p>
      </section>
    );
  }

  const { packages = [], frontend, integration = [] } = plugin.setup;
  const routes = frontend?.routes ?? [];
  const extensions = frontend?.extensions ?? [];

  return (
    <section className={styles.setupGuide} aria-label="Setup guide">
      <section className={styles.setupStep} aria-labelledby="setup-install">
        <div className={styles.stepHeading}>
          <span className={styles.stepNumber} aria-hidden="true">
            1
          </span>
          <h2 id="setup-install">Install</h2>
        </div>
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
        <div className={styles.stepHeading}>
          <span className={styles.stepNumber} aria-hidden="true">
            2
          </span>
          <h2 id="setup-integrate">Integrate</h2>
        </div>

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
                  <pre data-language={snippet.language}>
                    <code>{snippet.source}</code>
                  </pre>
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

      <section className={styles.setupStep} aria-labelledby="setup-configure">
        <div className={styles.stepHeading}>
          <span className={styles.stepNumber} aria-hidden="true">
            3
          </span>
          <h2 id="setup-configure">Configure</h2>
        </div>
        {configSchema ? (
          <div className={styles.configureGrid}>
            <form
              className={styles.configForm}
              aria-label="Plugin configuration"
              noValidate
              onSubmit={event => event.preventDefault()}
            >
              <ConfigForm
                schema={configSchema}
                value={configValue}
                errors={configErrors}
                onChange={setConfigValue}
              />
            </form>
            <div className={styles.yamlPreview}>
              <div className={styles.previewHeader}>
                <p>
                  <strong>Generated app-config.yaml</strong>
                </p>
                <CopyButton
                  value={generatedYaml}
                  label="generated YAML"
                  disabled={configErrors.length > 0}
                />
              </div>
              <pre aria-label="Generated app-config.yaml">
                <code>
                  {generatedYaml ||
                    '# Complete required fields to generate app-config.yaml.\n'}
                </code>
              </pre>
              {configErrors.length > 0 && (
                <p className={styles.previewNotice} role="status">
                  Resolve {configErrors.length}{' '}
                  {configErrors.length === 1 ? 'error' : 'errors'} to enable
                  copying.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>No configuration schema provided.</p>
        )}
      </section>
    </section>
  );
}
