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
import { SetupFallback } from './SetupFallback';
import styles from './pluginDirectory.module.scss';

interface ConfigureGuideProps {
  plugin: PluginData;
}

export function ConfigureGuide({ plugin }: ConfigureGuideProps) {
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
    return <SetupFallback />;
  }

  return (
    <section className={styles.setupStep} aria-labelledby="setup-configure">
      <h2 id="setup-configure">Configure</h2>
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
  );
}
