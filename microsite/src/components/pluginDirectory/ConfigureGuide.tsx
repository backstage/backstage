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
import Form from '@rjsf/core';
import type { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { dump } from 'js-yaml';
import type { PluginData } from '../../pluginDirectory/manifest';
import React, { useState } from 'react';

import { configFormTemplates, configFormWidgets } from './ConfigForm';
import { CopyButton } from './CopyButton';
import { PackageSelect } from './PackageSelect';
import styles from './pluginDirectory.module.scss';

interface ConfigureGuideProps {
  plugin: PluginData;
}

interface PackageSchemaEntry {
  npmPackageName: string;
  functionality: string | undefined;
  schema: RJSFSchema;
}

function packageOptionLabel(entry: PackageSchemaEntry): string {
  return entry.functionality
    ? `${entry.npmPackageName} (${entry.functionality})`
    : entry.npmPackageName;
}

function isObjectSchema(value: unknown): value is RJSFSchema {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (value as RJSFSchema).type === 'object'
  );
}

function InteractiveConfigureForm({
  formLabel,
  yamlLabel,
  schema,
}: {
  formLabel: string;
  yamlLabel: string;
  schema: RJSFSchema;
}) {
  const [formData, setFormData] = useState<Record<string, unknown> | undefined>(
    undefined,
  );
  const [hasErrors, setHasErrors] = useState(true);
  const generatedYaml =
    !hasErrors && formData !== undefined
      ? dump(formData, { lineWidth: -1, noRefs: true, sortKeys: false })
      : '';

  return (
    <div className={styles.configureGrid}>
      <Form
        className={styles.configForm}
        aria-label={formLabel}
        schema={schema}
        validator={validator}
        templates={configFormTemplates}
        widgets={configFormWidgets}
        liveValidate
        showErrorList={false}
        onChange={({ formData: nextFormData, errors }) => {
          setFormData(nextFormData);
          setHasErrors(errors.length > 0);
        }}
      >
        <></>
      </Form>
      <div className={styles.yamlPreview}>
        <div className={styles.previewHeader}>
          <p>
            <strong>Generated app-config.yaml</strong>
          </p>
          <CopyButton
            value={generatedYaml}
            label={yamlLabel}
            disabled={hasErrors}
          />
        </div>
        <pre aria-label={yamlLabel}>
          <code>
            {generatedYaml ||
              '# Complete required fields to generate app-config.yaml.\n'}
          </code>
        </pre>
        {hasErrors && (
          <p className={styles.previewNotice} role="status">
            Resolve validation errors to enable copying.
          </p>
        )}
      </div>
    </div>
  );
}

function getPackageSchemas(plugin: PluginData): PackageSchemaEntry[] {
  const packages = plugin.snapshot?.packages ?? [];
  const entries: PackageSchemaEntry[] = [];
  for (const packageSnapshot of packages) {
    const configSchemaSnapshot = packageSnapshot.configSchema;
    const rawSchema =
      configSchemaSnapshot.status === 'fresh' ||
      configSchemaSnapshot.status === 'stale'
        ? configSchemaSnapshot.schema
        : undefined;
    if (!isObjectSchema(rawSchema)) {
      continue;
    }
    entries.push({
      npmPackageName: packageSnapshot.npmPackageName,
      functionality: packageSnapshot.functionality,
      schema: rawSchema,
    });
  }
  return entries;
}

export function ConfigureGuide({ plugin }: ConfigureGuideProps) {
  const packageSchemas = getPackageSchemas(plugin);
  const [selectedPackageName, setSelectedPackageName] = useState<
    string | undefined
  >(packageSchemas[0]?.npmPackageName);

  const selectedEntry =
    packageSchemas.find(
      entry => entry.npmPackageName === selectedPackageName,
    ) ?? packageSchemas[0];

  return (
    <section className={styles.setupStep} aria-labelledby="setup-configure">
      <h2 id="setup-configure">Configure</h2>
      {packageSchemas.length > 0 && selectedEntry ? (
        <>
          {packageSchemas.length > 1 && (
            <PackageSelect
              value={selectedEntry.npmPackageName}
              options={packageSchemas.map(entry => ({
                value: entry.npmPackageName,
                label: packageOptionLabel(entry),
              }))}
              onChange={setSelectedPackageName}
            />
          )}
          <InteractiveConfigureForm
            key={selectedEntry.npmPackageName}
            formLabel={`${selectedEntry.npmPackageName} configuration`}
            yamlLabel={`${selectedEntry.npmPackageName} generated YAML`}
            schema={selectedEntry.schema}
          />
        </>
      ) : (
        <p>No configuration schema provided.</p>
      )}
    </section>
  );
}
