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
import type {
  PackageSnapshot,
  PluginData,
} from '../../pluginDirectory/manifest';
import { fetchPackageConfigSchema } from '../../pluginDirectory/npmRegistryClient';
import {
  matchesRole,
  resolveFunctionality,
} from '../../pluginDirectory/packageRoles';
import React, { useEffect, useState } from 'react';

import { configFormTemplates, configFormWidgets } from './ConfigForm';
import { CopyButton } from './CopyButton';
import { packageOptionLabel } from './packageOptionLabel';
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

interface PackageCandidate {
  npmPackageName: string;
  version: string;
}

interface PackageEntryDescriptor {
  npmPackageName: string;
  functionality: string | undefined;
  candidates: PackageCandidate[];
  label?: string;
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

// RJSF/ajv8 degrade an `allOf` merge conflict (e.g. two schemas declaring the
// same leaf property with incompatible types) by silently stripping the
// offending `allOf` branch rather than throwing, so a conflicting merge
// currently fails silently rather than erroring. Real Backstage config
// schemas are namespaced by plugin id, so this is an accepted limitation.
function combineSchemas(schemas: RJSFSchema[]): RJSFSchema {
  return schemas.length === 1 ? schemas[0] : { allOf: schemas };
}

// A candidate can only be fetched if this package's npm snapshot resolved a
// version to fetch against; packages whose npm data is entirely unavailable
// are silently skipped, same as they'd have no schema to show either way.
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

function collectCandidates(
  candidateNames: string[],
  packagesByName: Map<string, PackageSnapshot>,
): PackageCandidate[] {
  const candidates: PackageCandidate[] = [];
  for (const name of candidateNames) {
    const packageSnapshot = packagesByName.get(name);
    const candidate = packageSnapshot
      ? candidateFor(packageSnapshot)
      : undefined;
    if (candidate) {
      candidates.push(candidate);
    }
  }
  return candidates;
}

function buildRoleEntry(
  functionality: 'frontend' | 'backend',
  label: string,
  packagesByName: Map<string, PackageSnapshot>,
  absorbed: Set<string>,
  primaryNpmPackageName: string,
): PackageEntryDescriptor | undefined {
  const rolePackage = [...packagesByName.values()].find(entry =>
    matchesRole(
      resolveFunctionality(entry, primaryNpmPackageName),
      functionality,
    ),
  );
  if (!rolePackage) {
    return undefined;
  }

  const candidateNames = [
    rolePackage.npmPackageName,
    ...(rolePackage.internalDependencies ?? []),
  ];
  // Every candidate of this role - not just ones that turn out to have a
  // schema - is absorbed, so the generic loop below never re-lists a
  // dependency of Frontend/Backend as its own separate entry. Whether a
  // candidate actually contributes a schema is only known once it's fetched.
  candidateNames.forEach(name => absorbed.add(name));

  return {
    npmPackageName: rolePackage.npmPackageName,
    functionality,
    candidates: collectCandidates(candidateNames, packagesByName),
    label,
  };
}

function getPackageEntries(plugin: PluginData): PackageEntryDescriptor[] {
  const packages = plugin.snapshot?.packages ?? [];
  const packagesByName = new Map(
    packages.map(
      packageSnapshot =>
        [packageSnapshot.npmPackageName, packageSnapshot] as const,
    ),
  );
  const absorbed = new Set<string>();
  const primaryNpmPackageName = plugin.npmPackageName;

  const entries: PackageEntryDescriptor[] = [];
  const frontendEntry = buildRoleEntry(
    'frontend',
    'Frontend',
    packagesByName,
    absorbed,
    primaryNpmPackageName,
  );
  if (frontendEntry) {
    entries.push(frontendEntry);
  }
  const backendEntry = buildRoleEntry(
    'backend',
    'Backend',
    packagesByName,
    absorbed,
    primaryNpmPackageName,
  );
  if (backendEntry) {
    entries.push(backendEntry);
  }

  for (const packageSnapshot of packages) {
    if (absorbed.has(packageSnapshot.npmPackageName)) {
      continue;
    }
    // Skip dependencies already absorbed into the frontend/backend entries
    // above, so a module's own entry stays focused on its own config rather
    // than re-showing config that's already visible under Frontend/Backend.
    const candidateNames = [
      packageSnapshot.npmPackageName,
      ...(packageSnapshot.internalDependencies ?? []).filter(
        name => !absorbed.has(name),
      ),
    ];
    entries.push({
      npmPackageName: packageSnapshot.npmPackageName,
      functionality: resolveFunctionality(
        packageSnapshot,
        primaryNpmPackageName,
      ),
      candidates: collectCandidates(candidateNames, packagesByName),
    });
  }

  return entries;
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

      const failures = results.filter(result => result.status === 'error');
      if (failures.length > 0) {
        failures.forEach(failure => {
          console.error(
            'Failed to load a package configuration schema',
            (failure as { status: 'error'; error: unknown }).error,
          );
        });
        setState({ status: 'error' });
        return;
      }

      const schemas = results
        .map(result =>
          result.status === 'ready' ? result.value : undefined,
        )
        .filter(isObjectSchema);
      setState({
        status: 'ready',
        schema: schemas.length > 0 ? combineSchemas(schemas) : undefined,
      });
    });

    return () => {
      cancelled = true;
    };
    // candidatesKey is a stable summary of `candidates`' contents; depending
    // on the array itself would refetch on every render, since a fresh array
    // is built from the plugin snapshot each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatesKey]);

  return state;
}

export function ConfigureGuide({ plugin }: ConfigureGuideProps) {
  const packageEntries = getPackageEntries(plugin);
  const [selectedPackageName, setSelectedPackageName] = useState<
    string | undefined
  >(packageEntries[0]?.npmPackageName);

  const selectedEntry =
    packageEntries.find(
      entry => entry.npmPackageName === selectedPackageName,
    ) ?? packageEntries[0];
  const schemaState = useCombinedConfigSchema(selectedEntry?.candidates ?? []);

  return (
    <section className={styles.setupStep} aria-labelledby="setup-configure">
      <h2 id="setup-configure">Configure</h2>
      {packageEntries.length > 0 && selectedEntry ? (
        <>
          {packageEntries.length > 1 && (
            <PackageSelect
              value={selectedEntry.npmPackageName}
              options={packageEntries.map(entry => ({
                value: entry.npmPackageName,
                label: packageOptionLabel(entry),
                // Frontend/Backend are each already a single, distinctly
                // labeled option; group everything else together so the
                // dropdown visually separates the plugin's main packages
                // from its supporting ones.
                group: entry.label ? undefined : 'Other packages',
              }))}
              onChange={setSelectedPackageName}
            />
          )}
          {schemaState.status === 'loading' && (
            <p role="status">Loading configuration schema…</p>
          )}
          {schemaState.status === 'error' && (
            <p role="alert">
              Couldn&apos;t load this package&apos;s configuration schema.
            </p>
          )}
          {schemaState.status === 'ready' &&
            (schemaState.schema ? (
              <ConfigureFormErrorBoundary key={selectedEntry.npmPackageName}>
                <InteractiveConfigureForm
                  formLabel={`${selectedEntry.npmPackageName} configuration`}
                  yamlLabel={`${selectedEntry.npmPackageName} generated YAML`}
                  schema={schemaState.schema}
                />
              </ConfigureFormErrorBoundary>
            ) : (
              <p>No configuration schema provided.</p>
            ))}
        </>
      ) : (
        <p>No configuration schema provided.</p>
      )}
    </section>
  );
}
