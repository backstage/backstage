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
import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAnalytics, useApiHolder } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

import { ScaffolderField } from '../ScaffolderField';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useOptionsLoader } from '../../hooks';

/**
 * Error boundary wrapper for form fields that use optionsLoader.
 * Catches unhandled rendering errors caused by dynamic option changes
 * and displays a recovery UI instead of crashing the entire Stepper.
 *
 * @remarks
 * React error boundaries must be class components — there is no hook
 * equivalent. This boundary is intentionally scoped to individual field
 * rendering so that a failure in one field does not take down the rest
 * of the form.
 */
interface OptionsLoaderErrorBoundaryProps {
  fieldId: string;
  children: ReactNode;
  /** Optional callback invoked when the boundary catches an error */
  onError?: (error: Error, fieldId: string) => void;
}

interface OptionsLoaderErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class OptionsLoaderErrorBoundary extends Component<
  OptionsLoaderErrorBoundaryProps,
  OptionsLoaderErrorBoundaryState
> {
  static getDerivedStateFromError(
    error: Error,
  ): OptionsLoaderErrorBoundaryState {
    return { hasError: true, error };
  }

  constructor(props: OptionsLoaderErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error): void {
    // Structured observability: log field-level render failure with
    // correlation data for production debugging.
    // eslint-disable-next-line no-console
    console.error(
      `[OptionsLoaderErrorBoundary] Render error in field "${this.props.fieldId}":`,
      { error: error.message, stack: error.stack },
    );
    if (this.props.onError) {
      this.props.onError(error, this.props.fieldId);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: 12,
            border: '1px solid #f44336',
            borderRadius: 4,
            backgroundColor: '#fff3f3',
          }}
        >
          <FormHelperText error>
            This field encountered an unexpected error
            {this.state.error?.message ? `: ${this.state.error.message}` : '.'}
          </FormHelperText>
          <Button
            variant="text"
            size="small"
            onClick={this.handleRetry}
            style={{ marginTop: 4 }}
          >
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const analytics = useAnalytics();
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
  const hasOptionsLoader = !!loaderEntry;
  const formDataForLoader = (formContext?.formData ?? {}) as JsonObject;
  // Stable no-op loader for fields without an optionsLoader. The hook
  // short-circuits when dependencies is empty so this is never invoked.
  const noopLoader = useCallback(
    async () => [] as Array<{ label: string; value: string | number }>,
    [],
  );
  // Extract ui:options early so that debounceMs can be forwarded to the hook
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const fieldDebounceMs =
    typeof uiOptions.debounceMs === 'number' ? uiOptions.debounceMs : undefined;
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
    fieldDebounceMs !== undefined ? { debounceMs: fieldDebounceMs } : undefined,
  );

  // --- Analytics / Metrics tracking for optionsLoader lifecycle ---
  // Tracks loading-start, success, and error events via the Backstage
  // analytics API for production observability. Uses a ref to track the
  // previous loading state so events fire only on transitions, not on
  // every render.
  const prevLoadingRef = useRef(false);
  const prevErrorRef = useRef<Error | null>(null);
  useEffect(() => {
    if (!hasOptionsLoader) return;

    // Loading started: previous was not loading, current is loading
    if (isFieldLoading && !prevLoadingRef.current) {
      analytics.captureEvent('optionsLoader-load', id, {
        attributes: { field: uiFieldName ?? id },
      });
    }

    // Loading finished successfully: was loading, now not loading, no error
    if (!isFieldLoading && prevLoadingRef.current && !fieldLoadError) {
      analytics.captureEvent('optionsLoader-success', id, {
        attributes: { field: uiFieldName ?? id },
      });
    }

    // Error occurred: new error that differs from previous
    if (fieldLoadError && fieldLoadError !== prevErrorRef.current) {
      analytics.captureEvent('optionsLoader-error', id, {
        attributes: {
          field: uiFieldName ?? id,
          error: fieldLoadError.message,
        },
      });
    }

    prevLoadingRef.current = isFieldLoading;
    prevErrorRef.current = fieldLoadError;
  }, [
    isFieldLoading,
    fieldLoadError,
    hasOptionsLoader,
    analytics,
    id,
    uiFieldName,
  ]);

  // Callback for the error boundary to fire an analytics event when
  // a field render crashes due to an optionsLoader-related issue.
  const handleBoundaryError = useCallback(
    (error: Error, fieldId: string) => {
      analytics.captureEvent('optionsLoader-render-error', fieldId, {
        attributes: { error: error.message, field: uiFieldName ?? fieldId },
      });
    },
    [analytics, uiFieldName],
  );

  const WrapIfAdditionalTemplate = getTemplate<
    'WrapIfAdditionalTemplate',
    T,
    S,
    F
  >('WrapIfAdditionalTemplate', registry, uiOptions);

  if (hidden) {
    return <div style={{ display: 'none' }}>{children}</div>;
  }

  // Core field rendering — extracted so it can be optionally wrapped
  // by the OptionsLoaderErrorBoundary when the field has an optionsLoader.
  const fieldContent = (
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
        rawErrors={
          fieldLoadError
            ? [...rawErrors, fieldLoadError.message || 'Failed to load options']
            : rawErrors
        }
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
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
          }}
        >
          <FormHelperText error>
            {fieldLoadError.message || 'Failed to load options'}
          </FormHelperText>
          {fieldRetry && (
            <Button variant="text" size="small" onClick={fieldRetry}>
              Retry
            </Button>
          )}
        </div>
      )}
    </WrapIfAdditionalTemplate>
  );

  // Wrap fields with an optionsLoader in an error boundary to prevent
  // unhandled rendering errors from cascading up and crashing the Stepper.
  // Fields without an optionsLoader skip the boundary for zero overhead.
  if (hasOptionsLoader) {
    return (
      <OptionsLoaderErrorBoundary fieldId={id} onError={handleBoundaryError}>
        {fieldContent}
      </OptionsLoaderErrorBoundary>
    );
  }

  return fieldContent;
};
