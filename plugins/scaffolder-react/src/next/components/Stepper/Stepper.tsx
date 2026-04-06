/*
 * Copyright 2022 The Backstage Authors
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
import { useAnalytics, useApiHolder } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  FieldExtensionOptions,
  FormProps,
  LayoutOptions,
  ReviewStepProps,
  TemplateParameterSchema,
} from '@backstage/plugin-scaffolder-react';
import { JsonObject, JsonValue } from '@backstage/types';
import { ShadcnButton as Button, cn } from '@backstage/core-components';
import { Check } from 'lucide-react';
import { type IChangeEvent } from '@rjsf/core';
import { ErrorSchema } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { merge } from 'lodash';
import {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';
import { useFormDataFromQuery, useTemplateSchema } from '../../hooks';
import { useTransformSchemaToProps } from '../../hooks/useTransformSchemaToProps';
import { Form } from '../Form';
import { PasswordWidget } from '../PasswordWidget/PasswordWidget';
import { ReviewState, type ReviewStateProps } from '../ReviewState';
import {
  createAsyncValidators,
  type FormValidation,
} from './createAsyncValidators';
import { ErrorListTemplate } from './ErrorListTemplate';
import * as FieldOverrides from './FieldOverrides';
import { hasErrors } from './utils';
import { useConditionalSchema } from '../../hooks/useConditionalSchema';

const validator = customizeValidator();
ajvErrors(validator.ajv);

/** @alpha */
export type BackstageTemplateStepperClassKey =
  | 'backButton'
  | 'footer'
  | 'formWrapper';

/**
 * The Props for {@link Stepper} component
 * @alpha
 */
export type StepperProps = {
  manifest: TemplateParameterSchema;
  extensions: FieldExtensionOptions<any, any>[];
  /**
   * @deprecated This was only ever used for analytics tracking purposes, which
   * is now handled in the `<Workflow />` component. Passing it in will have no
   * effect.
   */
  templateName?: string;
  formProps?: FormProps;
  initialState?: Record<string, JsonValue>;
  onCreate: (values: Record<string, JsonValue>) => Promise<void>;
  components?: {
    ReviewStepComponent?: ComponentType<ReviewStepProps>;
    ReviewStateComponent?: (props: ReviewStateProps) => JSX.Element;
    backButtonText?: ReactNode;
    createButtonText?: ReactNode;
    reviewButtonText?: ReactNode;
  };
  layouts?: LayoutOptions[];
};

/**
 * The `Stepper` component is the Wizard that is rendered when a user selects a template
 * @alpha
 */
export const Stepper = (stepperProps: StepperProps) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const { layouts = [], components = {}, onCreate, ...props } = stepperProps;
  const {
    ReviewStateComponent = ReviewState,
    ReviewStepComponent,
    backButtonText = t('stepper.backButtonText'),
    createButtonText = t('stepper.createButtonText'),
    reviewButtonText = t('stepper.reviewButtonText'),
  } = components;
  const analytics = useAnalytics();
  const { presentation, steps } = useTemplateSchema(props.manifest);
  const apiHolder = useApiHolder();
  const [activeStep, setActiveStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [initialState] = useFormDataFromQuery(props.initialState);
  const [stepsState, setStepsState] =
    useState<Record<string, JsonValue>>(initialState);

  const [errors, setErrors] = useState<undefined | FormValidation>();

  const backLabel =
    presentation?.buttonLabels?.backButtonText ?? backButtonText;
  const createLabel =
    presentation?.buttonLabels?.createButtonText ?? createButtonText;
  const reviewLabel =
    presentation?.buttonLabels?.reviewButtonText ?? reviewButtonText;

  const extensions = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, component }) => [name, component]),
    );
  }, [props.extensions]);

  // Build a registry of field extensions that declare optionsLoader with
  // dependency field names. This registry is passed through formContext so
  // downstream components (FieldTemplate, field extensions) can invoke
  // option loading when dependency fields change.
  const optionsLoaderRegistry = useMemo(() => {
    const registry: Record<
      string,
      {
        dependencies: string[];
        optionsLoader: FieldExtensionOptions<any, any>['optionsLoader'];
      }
    > = {};
    for (const ext of props.extensions) {
      if (ext.dependencies && ext.optionsLoader) {
        registry[ext.name] = {
          dependencies: ext.dependencies,
          optionsLoader: ext.optionsLoader,
        };
      }
    }
    return registry;
  }, [props.extensions]);

  const fields = useMemo(
    () => ({ ...FieldOverrides, ...extensions }),
    [extensions],
  );

  const validators = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, validation }) => [name, validation]),
    );
  }, [props.extensions]);

  // Derive a field dependency map from the optionsLoaderRegistry so that
  // createAsyncValidators can trigger revalidation of dependent fields when
  // their parent field values change. Returns undefined when no dependencies
  // exist to preserve backward-compatible call semantics.
  const fieldDependencies = useMemo(() => {
    const deps: Record<string, string[]> = {};
    for (const [name, entry] of Object.entries(optionsLoaderRegistry)) {
      deps[name] = entry.dependencies;
    }
    return Object.keys(deps).length > 0 ? deps : undefined;
  }, [optionsLoaderRegistry]);

  const validation = useMemo(() => {
    return createAsyncValidators(
      steps[activeStep]?.mergedSchema,
      validators,
      { apiHolder },
      fieldDependencies,
    );
  }, [steps, activeStep, validators, apiHolder, fieldDependencies]);

  const handleBack = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, [setActiveStep]);

  const currentStep = useTransformSchemaToProps(steps[activeStep], { layouts });

  // Reactively resolve conditional JSON Schema keywords (if/then/else,
  // dependencies) against the current form data so the Form component
  // receives a schema that reflects only the active conditional branches.
  // The hook re-evaluates whenever the step schema or formData changes,
  // enabling reactive field mount/unmount within the same render cycle.
  // resolveConditionalSchema (wrapped inside the hook) is pure and
  // synchronous (<50ms for ≤20 branches).
  const resolvedSchema = useConditionalSchema(
    currentStep?.schema as JsonObject | undefined,
    stepsState as JsonObject,
  );

  const {
    formContext: propFormContext,
    uiSchema: propUiSchema,
    liveOmit: _shouldLiveOmit,
    omitExtraData: _shouldOmitExtraData,
    ...restFormProps
  } = props.formProps ?? {};

  const handleChange = useCallback(
    (e: IChangeEvent) => {
      setStepsState(current => {
        const next = { ...current, ...e.formData };
        // Structural equality bail-out: if the merged state is identical to the
        // current state, return the same reference so React skips the re-render.
        // This breaks the reference-change → RJSF onChange → handleChange loop
        // that occurs when RJSF fires onChange with structurally identical
        // formData (e.g. during step transitions or schema re-evaluation).
        if (JSON.stringify(current) === JSON.stringify(next)) {
          return current;
        }
        return next;
      });
    },
    [setStepsState],
  );

  const handleNext = useCallback(
    async ({ formData = {} }: { formData?: Record<string, JsonValue> }) => {
      // The validation should never throw, as the validators are wrapped in a try/catch.
      // This makes it fine to set and unset state without try/catch.
      setErrors(undefined);
      setIsValidating(true);

      const returnedValidation = await validation(formData);

      setStepsState(current => ({
        ...current,
        ...formData,
      }));

      setIsValidating(false);

      if (hasErrors(returnedValidation)) {
        setErrors(returnedValidation);
      } else {
        setErrors(undefined);
        setActiveStep(prevActiveStep => {
          const stepNum = prevActiveStep + 1;
          analytics.captureEvent('click', `Next Step (${stepNum})`);
          return stepNum;
        });
      }
    },
    [validation, analytics],
  );

  useEffect(() => {
    const main = document.querySelector('main');
    if (main && typeof main.scrollTo === 'function') {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeStep]);

  const mergedUiSchema = merge({}, propUiSchema, currentStep?.uiSchema);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = useCallback(async () => {
    setIsCreating(true);
    analytics.captureEvent('click', `${createLabel}`);
    try {
      await onCreate(stepsState);
    } finally {
      setIsCreating(false);
    }
  }, [analytics, createLabel, onCreate, stepsState]);

  return (
    <>
      {isValidating && (
        <div
          role="progressbar"
          aria-label="Validating"
          className="h-1 w-full overflow-hidden rounded-full bg-primary/20"
        >
          <div className="h-full w-1/3 animate-[backstage-indeterminate_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      )}
      <nav aria-label="Template steps" className="overflow-x-auto py-6">
        <ol className="flex w-full items-center">
          {steps.map((step, index) => {
            const isCompleted = activeStep > index;
            const isActive = activeStep === index;
            const isClickable = isCompleted;
            return (
              <li
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                {/* Step indicator circle */}
                <button
                  type="button"
                  aria-label={t('stepper.stepIndexLabel', {
                    index: index + 1,
                  })}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    isCompleted &&
                      'cursor-pointer border-primary bg-primary text-primary-foreground',
                    isActive && 'border-primary bg-background text-primary',
                    !isCompleted &&
                      !isActive &&
                      'border-muted text-muted-foreground',
                  )}
                  onClick={() => {
                    if (isClickable) setActiveStep(index);
                  }}
                  disabled={!isClickable}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </button>
                {/* Step label */}
                <span
                  className={cn(
                    'text-center text-sm',
                    isActive && 'font-medium text-foreground',
                    isCompleted && 'cursor-pointer text-foreground',
                    !isCompleted && !isActive && 'text-muted-foreground',
                  )}
                  role="button"
                  tabIndex={isClickable ? 0 : -1}
                  onClick={() => {
                    if (isClickable) setActiveStep(index);
                  }}
                  onKeyDown={e => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setActiveStep(index);
                    }
                  }}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
          {/* Review step */}
          <li className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                activeStep === steps.length &&
                  'border-primary bg-primary text-primary-foreground',
                activeStep < steps.length &&
                  'border-muted text-muted-foreground',
              )}
            >
              {steps.length + 1}
            </div>
            <span
              className={cn(
                'text-center text-sm',
                activeStep === steps.length
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {reviewLabel}
            </span>
          </li>
        </ol>
      </nav>
      <div className="p-4">
        {/* eslint-disable-next-line no-nested-ternary */}
        {activeStep < steps.length ? (
          <Form
            key={activeStep}
            validator={validator}
            extraErrors={errors as unknown as ErrorSchema}
            formData={stepsState}
            formContext={{
              ...propFormContext,
              formData: stepsState,
              optionsLoaderRegistry,
            }}
            schema={resolvedSchema ?? currentStep.schema}
            uiSchema={mergedUiSchema}
            onSubmit={handleNext}
            fields={fields}
            showErrorList="top"
            templates={{ ErrorListTemplate }}
            onChange={handleChange}
            widgets={{ password: PasswordWidget }}
            experimental_defaultFormStateBehavior={{
              allOf: 'populateDefaults',
            }}
            {...restFormProps}
          >
            <div className="flex flex-row justify-end mt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="mr-2"
                disabled={activeStep < 1 || isValidating}
              >
                {backLabel}
              </Button>
              <Button type="submit" disabled={isValidating}>
                {activeStep === steps.length - 1
                  ? reviewLabel
                  : t('stepper.nextButtonText')}
              </Button>
            </div>
          </Form>
        ) : // TODO: potentially move away from this pattern, deprecate?
        ReviewStepComponent ? (
          <ReviewStepComponent
            disableButtons={isValidating}
            formData={stepsState}
            handleBack={handleBack}
            handleReset={() => {}}
            steps={steps}
            handleCreate={handleCreate}
          />
        ) : (
          <>
            <ReviewStateComponent formState={stepsState} schemas={steps} />
            <div className="flex flex-row justify-end mt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="mr-2"
                disabled={activeStep < 1}
              >
                {backLabel}
              </Button>
              <Button disabled={isCreating} onClick={handleCreate}>
                {createLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
