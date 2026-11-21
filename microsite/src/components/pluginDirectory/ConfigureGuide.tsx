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
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import React, { useMemo, useState } from 'react';

import { configFormTemplates, configFormWidgets } from './ConfigForm';
import { CopyButton } from './CopyButton';
import styles from './pluginDirectory.module.scss';

interface ConfigureGuideProps {
  packageSnapshot: PackageSnapshot;
  packages: readonly PackageSnapshot[];
  primaryNpmPackageName: string;
}

// Config schemas come from the audit pipeline as unvalidated `unknown` data.
// Keep malformed package data scoped to this guide instead of taking down the
// whole plugin detail page.
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
          This package&apos;s configuration schema could not be rendered.
        </p>
      );
    }
    return this.props.children;
  }
}

function isObjectSchema(value: unknown): value is RJSFSchema {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'type' in value &&
    value.type === 'object'
  );
}

// config.d.ts commonly declares free-form config sections as a bare
// `object` type (e.g. `entityOverrides?: object`), which compiles to a JSON
// Schema object node with no `properties`. RJSF only lets users add fields
// to an object when `additionalProperties` is set, so without this such
// sections would render as an empty, uneditable fieldset.
type SchemaDefinition = NonNullable<RJSFSchema['allOf']>[number];

function allowOpenDefinition(definition: SchemaDefinition): SchemaDefinition {
  return typeof definition === 'boolean'
    ? definition
    : allowOpenObjects(definition);
}

function allowOpenObjects(schema: RJSFSchema): RJSFSchema {
  if (Array.isArray(schema.allOf)) {
    return { ...schema, allOf: schema.allOf.map(allowOpenDefinition) };
  }
  if (Array.isArray(schema.oneOf)) {
    return { ...schema, oneOf: schema.oneOf.map(allowOpenDefinition) };
  }
  if (Array.isArray(schema.anyOf)) {
    return { ...schema, anyOf: schema.anyOf.map(allowOpenDefinition) };
  }

  const next = { ...schema };

  if (next.properties) {
    next.properties = Object.fromEntries(
      Object.entries(next.properties).map(([name, propertySchema]) => [
        name,
        typeof propertySchema === 'object'
          ? allowOpenObjects(propertySchema as RJSFSchema)
          : propertySchema,
      ]),
    );
  }
  if (
    next.items &&
    typeof next.items === 'object' &&
    !Array.isArray(next.items)
  ) {
    next.items = allowOpenObjects(next.items as RJSFSchema);
  }
  if (
    next.type === 'object' &&
    !next.properties &&
    next.additionalProperties === undefined &&
    !next.patternProperties
  ) {
    next.additionalProperties = true;
  }

  return next;
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
  // RJSF's initial onChange fires before interaction. Validate the current
  // value directly so an untouched required form cannot appear copyable.
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

// RJSF/ajv8 can silently strip conflicting allOf branches. Backstage config
// schemas are conventionally namespaced by plugin id, which avoids that case.
function combineSchemas(schemas: RJSFSchema[]): RJSFSchema {
  return schemas.length === 1 ? schemas[0] : { allOf: schemas };
}

// The schemas of the selected package and its direct internal dependencies,
// read from the audited snapshot. Nothing is fetched from npm in the browser.
function getCombinedConfigSchema(
  packageSnapshot: PackageSnapshot,
  packages: readonly PackageSnapshot[],
): RJSFSchema | undefined {
  const packagesByName = new Map(
    packages.map(entry => [entry.npmPackageName, entry] as const),
  );
  packagesByName.set(packageSnapshot.npmPackageName, packageSnapshot);

  const schemas = [
    packageSnapshot.npmPackageName,
    ...(packageSnapshot.internalDependencies ?? []),
  ]
    .map(name => packagesByName.get(name)?.configSchema)
    .filter(isObjectSchema)
    .map(allowOpenObjects);

  return schemas.length > 0 ? combineSchemas(schemas) : undefined;
}

export function ConfigureGuide({
  packageSnapshot,
  packages,
}: ConfigureGuideProps) {
  const schema = useMemo(
    () => getCombinedConfigSchema(packageSnapshot, packages),
    [packageSnapshot, packages],
  );
  const packageName = packageSnapshot.npmPackageName;

  return (
    <section className={styles.setupStep} aria-label="Configure">
      {schema ? (
        <ConfigureFormErrorBoundary key={packageName}>
          <InteractiveConfigureForm
            formLabel={`${packageName} configuration`}
            yamlLabel={`${packageName} generated YAML`}
            schema={schema}
          />
        </ConfigureFormErrorBoundary>
      ) : (
        <p>This package does not provide a configuration schema.</p>
      )}
    </section>
  );
}
