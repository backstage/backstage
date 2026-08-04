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
import type { PackageSnapshot, PluginData } from '../../pluginDirectory/manifest';
import React, { useState } from 'react';

import { configFormTemplates, configFormWidgets } from './ConfigForm';
import { CopyButton } from './CopyButton';
import { PackageSelect } from './PackageSelect';
import styles from './pluginDirectory.module.scss';

// Config schemas come from the audit pipeline as unvalidated `unknown` data
// (see ConfigSchemaSnapshot in pluginDirectory/manifest.ts), so a malformed
// schema from any plugin can throw inside RJSF/ajv during render or
// validation. This boundary keeps that failure scoped to the Configure tab
// instead of taking down the whole plugin detail page.
class ConfigureFormErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <p role="alert">
          This plugin&apos;s configuration schema could not be rendered.
        </p>
      );
    }
    return this.props.children;
  }
}

interface ConfigureGuideProps {
  plugin: PluginData;
}

interface PackageSchemaEntry {
  npmPackageName: string;
  functionality: string | undefined;
  schema: RJSFSchema;
  label?: string;
}

function packageOptionLabel(entry: PackageSchemaEntry): string {
  if (entry.label) {
    return entry.label;
  }
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
  // Deliberately re-validate here instead of trusting RJSF's own onChange
  // errors: RJSF's initial onChange fires before the user has interacted
  // with the form, so relying on its errors let an empty/untouched form
  // report itself as valid. Re-running validateFormData against the latest
  // formData keeps "hasErrors" accurate independent of that timing quirk.
  const hasErrors =
    formData === undefined ||
    validator.validateFormData(formData, schema).errors.length > 0;
  const generatedYaml = !hasErrors
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
        onChange={({ formData: nextFormData }) => setFormData(nextFormData)}
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

function schemaFor(packageSnapshot: PackageSnapshot): RJSFSchema | undefined {
  const configSchemaSnapshot = packageSnapshot.configSchema;
  const rawSchema =
    configSchemaSnapshot.status === 'fresh' ||
    configSchemaSnapshot.status === 'stale'
      ? configSchemaSnapshot.schema
      : undefined;
  return isObjectSchema(rawSchema) ? rawSchema : undefined;
}

function combineSchemas(schemas: RJSFSchema[]): RJSFSchema {
  return schemas.length === 1 ? schemas[0] : { allOf: schemas };
}

function buildRoleEntry(
  functionality: 'frontend' | 'backend',
  label: string,
  packagesByName: Map<string, PackageSnapshot>,
  absorbed: Set<string>,
): PackageSchemaEntry | undefined {
  const rolePackage = [...packagesByName.values()].find(
    entry => entry.functionality === functionality,
  );
  if (!rolePackage) {
    return undefined;
  }

  const candidateNames = [
    rolePackage.npmPackageName,
    ...(rolePackage.internalDependencies ?? []),
  ];

  const schemas: RJSFSchema[] = [];
  for (const name of candidateNames) {
    const candidate = packagesByName.get(name);
    const schema = candidate ? schemaFor(candidate) : undefined;
    if (schema) {
      schemas.push(schema);
      absorbed.add(name);
    }
  }

  if (schemas.length === 0) {
    return undefined;
  }

  return {
    npmPackageName: rolePackage.npmPackageName,
    functionality,
    schema: combineSchemas(schemas),
    label,
  };
}

function getPackageSchemas(plugin: PluginData): PackageSchemaEntry[] {
  const packages = plugin.snapshot?.packages ?? [];
  const packagesByName = new Map(
    packages.map(
      packageSnapshot => [packageSnapshot.npmPackageName, packageSnapshot] as const,
    ),
  );
  const absorbed = new Set<string>();

  const entries: PackageSchemaEntry[] = [];
  const frontendEntry = buildRoleEntry(
    'frontend',
    'Frontend',
    packagesByName,
    absorbed,
  );
  if (frontendEntry) {
    entries.push(frontendEntry);
  }
  const backendEntry = buildRoleEntry(
    'backend',
    'Backend',
    packagesByName,
    absorbed,
  );
  if (backendEntry) {
    entries.push(backendEntry);
  }

  for (const packageSnapshot of packages) {
    if (absorbed.has(packageSnapshot.npmPackageName)) {
      continue;
    }
    const schema = schemaFor(packageSnapshot);
    if (!schema) {
      continue;
    }
    entries.push({
      npmPackageName: packageSnapshot.npmPackageName,
      functionality: packageSnapshot.functionality,
      schema,
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
          <ConfigureFormErrorBoundary key={selectedEntry.npmPackageName}>
            <InteractiveConfigureForm
              formLabel={`${selectedEntry.npmPackageName} configuration`}
              yamlLabel={`${selectedEntry.npmPackageName} generated YAML`}
              schema={selectedEntry.schema}
            />
          </ConfigureFormErrorBoundary>
        </>
      ) : (
        <p>No configuration schema provided.</p>
      )}
    </section>
  );
}
