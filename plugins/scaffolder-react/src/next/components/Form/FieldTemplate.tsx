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

import { ScaffolderField } from '../ScaffolderField';
import { ShadcnButton as Button } from '@backstage/core-components';

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

  // Extract field loading states from formContext (cascading forms feature).
  // The formContext is populated by Stepper.tsx with fieldLoadingStates when
  // async optionsLoader calls are in progress or have failed for a field.
  const formContext = registry.formContext as
    | Record<string, unknown>
    | undefined;
  const fieldLoadingStates = formContext?.fieldLoadingStates as
    | Record<
        string,
        { loading: boolean; error: Error | null; retry?: () => void }
      >
    | undefined;
  const fieldState = fieldLoadingStates?.[id];
  const isFieldLoading = fieldState?.loading === true;
  const fieldLoadError = fieldState?.error ?? null;
  const fieldRetry = fieldState?.retry;

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
