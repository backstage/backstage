/*
 * Copyright 2023 The Backstage Authors
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
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
} from '@rjsf/utils';
import { useCallback } from 'react';
import { useApiHolder } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

import { ScaffolderField } from '../ScaffolderField';
import { ShadcnButton as Button } from '@backstage/core-components';
import { useOptionsLoader } from '../../hooks';

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 * @alpha
 * @param props - The `FieldTemplateProps` for this component
 */
export const FieldTemplate = <
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: FieldTemplateProps<T, S, F>,
) => {
  const {
    id,
    children,
    classNames,
    style,
    disabled,
    displayLabel,
    hidden,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    rawErrors = [],
    errors,
    help,
    rawDescription,
    schema,
    uiSchema,
    registry,
  } = props;

  // Bridge: connect the optionsLoaderRegistry (populated by Stepper.tsx in
  // formContext) to field-level loading/error state by invoking useOptionsLoader
  // for fields whose custom extension declares an optionsLoader with dependency
  // fields. For fields without an optionsLoader the hook is a no-op because
  // the empty dependencies array causes the internal effect to short-circuit.
  const formContext = registry.formContext as
    | Record<string, unknown>
    | undefined;
  const apiHolder = useApiHolder();
  const uiFieldName = (uiSchema as Record<string, unknown> | undefined)?.[
    'ui:field'
  ] as string | undefined;
  const loaderRegistry = formContext?.optionsLoaderRegistry as
    | Record<
        string,
        {
          dependencies: string[];
          optionsLoader: (
            formData: JsonObject,
            context: { apiHolder: any },
          ) => Promise<Array<{ label: string; value: string | number }>>;
        }
      >
    | undefined;
  const loaderEntry = uiFieldName ? loaderRegistry?.[uiFieldName] : undefined;
  const formDataForLoader = (formContext?.formData ?? {}) as JsonObject;
  // Stable no-op loader for fields without an optionsLoader. The hook
  // short-circuits when dependencies is empty so this is never invoked.
  const noopLoader = useCallback(
    async () => [] as Array<{ label: string; value: string | number }>,
    [],
  );
  const {
    loading: isFieldLoading,
    error: fieldLoadError,
    retry: fieldRetry,
  } = useOptionsLoader(
    id,
    loaderEntry?.dependencies ?? [],
    loaderEntry?.optionsLoader ?? noopLoader,
    formDataForLoader,
    apiHolder,
  );

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    'WrapIfAdditionalTemplate',
    T,
    S,
    F
  >('WrapIfAdditionalTemplate', registry, uiOptions);

  if (hidden) {
    return <div style={{ display: 'none' }}>{children}</div>;
  }
  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      style={style}
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      registry={registry}
    >
      <ScaffolderField
        displayLabel={displayLabel}
        rawErrors={rawErrors}
        help={help}
        disabled={disabled || isFieldLoading}
        rawDescription={rawDescription}
        errors={errors}
        required={required}
        isLoading={isFieldLoading}
      >
        {children}
      </ScaffolderField>
      {fieldLoadError && (
        <div role="alert" className="flex items-center gap-2 mt-1">
          <div className="text-xs text-destructive">
            {fieldLoadError.message || 'Failed to load options'}
          </div>
          {fieldRetry && (
            <Button variant="ghost" size="sm" onClick={fieldRetry}>
              Retry
            </Button>
          )}
        </div>
      )}
    </WrapIfAdditionalTemplate>
  );
};
