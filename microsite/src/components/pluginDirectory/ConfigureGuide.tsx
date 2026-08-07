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
import type { PackageSnapshot } from '../../pluginDirectory/manifest';
import { fetchPackageConfigSchema } from '../../pluginDirectory/npmRegistryClient';
import React, { useEffect, useState } from 'react';

import { configFormTemplates, configFormWidgets } from './ConfigForm';
import { CopyButton } from './CopyButton';
import styles from './pluginDirectory.module.scss';

interface ConfigureGuideProps {
  packageSnapshot: PackageSnapshot;
  packages: readonly PackageSnapshot[];
  primaryNpmPackageName: string;
}

interface PackageCandidate {
  npmPackageName: string;
  version: string;
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
function allowOpenObjects(schema: RJSFSchema): RJSFSchema {
  if (Array.isArray(schema.allOf)) {
    return { ...schema, allOf: schema.allOf.map(allowOpenObjects) as RJSFSchema[] };
  }
  if (Array.isArray(schema.oneOf)) {
    return { ...schema, oneOf: schema.oneOf.map(allowOpenObjects) as RJSFSchema[] };
  }
  if (Array.isArray(schema.anyOf)) {
    return { ...schema, anyOf: schema.anyOf.map(allowOpenObjects) as RJSFSchema[] };
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
  if (next.items && typeof next.items === 'object' && !Array.isArray(next.items)) {
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

function candidateFor(
  packageSnapshot: PackageSnapshot,
): PackageCandidate | undefined {
  return packageSnapshot.npm.status !== 'unavailable'
    ? {
        npmPackageName: packageSnapshot.npmPackageName,
        version: packageSnapshot.npm.latestVersion,
      }
    : undefined;
}

function getPackageCandidates(
  packageSnapshot: PackageSnapshot,
  packages: readonly PackageSnapshot[],
): PackageCandidate[] {
  const packagesByName = new Map(
    packages.map(entry => [entry.npmPackageName, entry] as const),
  );
  packagesByName.set(packageSnapshot.npmPackageName, packageSnapshot);

  const candidateNames = [
    packageSnapshot.npmPackageName,
    ...(packageSnapshot.internalDependencies ?? []),
  ];
  return candidateNames.flatMap(name => {
    const candidatePackage = packagesByName.get(name);
    const candidate = candidatePackage
      ? candidateFor(candidatePackage)
      : undefined;
    return candidate ? [candidate] : [];
  });
}

type ConfigSchemaState =
  | { status: 'loading' }
  | { status: 'ready'; schema: RJSFSchema | undefined }
  | { status: 'error' };

function useCombinedConfigSchema(
  candidates: PackageCandidate[],
): ConfigSchemaState {
  const candidatesKey = candidates
    .map(candidate => `${candidate.npmPackageName}@${candidate.version}`)
    .join(',');
  const [state, setState] = useState<ConfigSchemaState>({
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    Promise.all(
      candidates.map(candidate =>
        fetchPackageConfigSchema(candidate.npmPackageName, candidate.version),
      ),
    ).then(results => {
      if (cancelled) {
        return;
      }

      let hasFailure = false;
      for (const result of results) {
        if (result.status === 'error') {
          hasFailure = true;
          console.error(
            'Failed to load a package configuration schema',
            result.error,
          );
        }
      }
      if (hasFailure) {
        setState({ status: 'error' });
        return;
      }

      const schemas = results
        .map(result =>
          result.status === 'ready' ? result.value : undefined,
        )
        .filter(isObjectSchema)
        .map(allowOpenObjects);
      setState({
        status: 'ready',
        schema: schemas.length > 0 ? combineSchemas(schemas) : undefined,
      });
    });

    return () => {
      cancelled = true;
    };
    // candidatesKey is a stable summary of candidates. Depending on the fresh
    // array would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatesKey]);

  return state;
}

export function ConfigureGuide({
  packageSnapshot,
  packages,
}: ConfigureGuideProps) {
  const candidates = getPackageCandidates(packageSnapshot, packages);
  const schemaState = useCombinedConfigSchema(candidates);
  const packageName = packageSnapshot.npmPackageName;

  return (
    <section className={styles.setupStep} aria-label="Configure">
      {schemaState.status === 'loading' && (
        <p role="status">Loading configuration schema…</p>
      )}
      {schemaState.status === 'error' && (
        <p role="alert">The package configuration could not be loaded.</p>
      )}
      {schemaState.status === 'ready' &&
        (schemaState.schema ? (
          <ConfigureFormErrorBoundary key={packageName}>
            <InteractiveConfigureForm
              formLabel={`${packageName} configuration`}
              yamlLabel={`${packageName} generated YAML`}
              schema={schemaState.schema}
            />
          </ConfigureFormErrorBoundary>
        ) : (
          <p>This package does not provide a configuration schema.</p>
        ))}
    </section>
  );
}
