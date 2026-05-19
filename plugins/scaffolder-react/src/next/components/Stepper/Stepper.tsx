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
import { JsonValue } from '@backstage/types';
import { Button } from '@backstage/ui';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiStep from '@material-ui/core/Step';
import MuiStepLabel from '@material-ui/core/StepLabel';
import MuiStepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
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
import { evaluateCondition } from '../../lib';
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

const validator = customizeValidator();
ajvErrors(validator.ajv);

/** @alpha */
export type BackstageTemplateStepperClassKey =
  | 'backButton'
  | 'footer'
  | 'formWrapper';

const useStyles = makeStyles(
  theme => ({
    backButton: {
      marginRight: theme.spacing(1),
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'right',
      marginTop: theme.spacing(2),
    },
    formWrapper: {
      padding: theme.spacing(2),
    },
  }),
  { name: 'BackstageTemplateStepper' },
);

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

  const visibleSteps = useMemo(
    () => steps.filter(step => evaluateCondition(step.if, stepsState)),
    [steps, stepsState],
  );

  useEffect(() => {
    setActiveStep(prev =>
      prev >= visibleSteps.length ? Math.max(visibleSteps.length - 1, 0) : prev,
    );
  }, [visibleSteps.length]);

  const filteredFormState = useMemo(() => {
    const hiddenSteps = steps.filter(
      step => step.if !== undefined && !evaluateCondition(step.if, stepsState),
    );
    if (hiddenSteps.length === 0) return stepsState;

    const collectSchemaKeys = (schema: Record<string, unknown>): string[] => {
      const keys: string[] = [];
      if (schema.properties) {
        keys.push(...Object.keys(schema.properties as Record<string, unknown>));
      }
      for (const keyword of ['allOf', 'oneOf', 'anyOf'] as const) {
        const entries = schema[keyword];
        if (Array.isArray(entries)) {
          for (const entry of entries) {
            if (entry && typeof entry === 'object') {
              keys.push(...collectSchemaKeys(entry as Record<string, unknown>));
            }
          }
        }
      }
      for (const keyword of ['then', 'else'] as const) {
        const sub = schema[keyword];
        if (sub && typeof sub === 'object' && !Array.isArray(sub)) {
          keys.push(...collectSchemaKeys(sub as Record<string, unknown>));
        }
      }
      if (schema.dependencies && typeof schema.dependencies === 'object') {
        for (const dep of Object.values(
          schema.dependencies as Record<string, unknown>,
        )) {
          if (dep && typeof dep === 'object' && !Array.isArray(dep)) {
            keys.push(...collectSchemaKeys(dep as Record<string, unknown>));
          }
        }
      }
      return keys;
    };

    const hiddenKeys = new Set(
      hiddenSteps.flatMap(step => collectSchemaKeys(step.mergedSchema)),
    );
    for (const step of visibleSteps) {
      for (const key of collectSchemaKeys(step.mergedSchema)) {
        hiddenKeys.delete(key);
      }
    }
    if (hiddenKeys.size === 0) return stepsState;

    return Object.fromEntries(
      Object.entries(stepsState).filter(([key]) => !hiddenKeys.has(key)),
    );
  }, [steps, visibleSteps, stepsState]);

  const [errors, setErrors] = useState<undefined | FormValidation>();
  const styles = useStyles();

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

  const fields = useMemo(
    () => ({ ...FieldOverrides, ...extensions }),
    [extensions],
  );

  const validators = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, validation }) => [name, validation]),
    );
  }, [props.extensions]);

  const validation = useMemo(() => {
    return createAsyncValidators(
      visibleSteps[activeStep]?.mergedSchema,
      validators,
      { apiHolder },
    );
  }, [visibleSteps, activeStep, validators, apiHolder]);

  const handleBack = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, [setActiveStep]);

  const currentStep = useTransformSchemaToProps(visibleSteps[activeStep], {
    layouts,
  });

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
        return { ...current, ...e.formData };
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
      await onCreate(filteredFormState);
    } finally {
      setIsCreating(false);
    }
  }, [analytics, createLabel, filteredFormState, onCreate]);

  return (
    <>
      {isValidating && <LinearProgress variant="indeterminate" />}
      <MuiStepper
        activeStep={activeStep}
        alternativeLabel
        variant="elevation"
        style={{ overflowX: 'auto' }}
      >
        {visibleSteps.map((step, index) => {
          const isAllowedLabelClick = activeStep > index;
          return (
            <MuiStep key={index}>
              <MuiStepLabel
                aria-label={t('stepper.stepIndexLabel', { index: index + 1 })}
                style={{ cursor: isAllowedLabelClick ? 'pointer' : 'default' }}
                onClick={() => {
                  if (isAllowedLabelClick) setActiveStep(index);
                }}
              >
                {step.title}
              </MuiStepLabel>
            </MuiStep>
          );
        })}
        <MuiStep>
          <MuiStepLabel>{reviewLabel}</MuiStepLabel>
        </MuiStep>
      </MuiStepper>
      <div className={styles.formWrapper}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {activeStep < visibleSteps.length ? (
          <Form
            key={activeStep}
            validator={validator}
            extraErrors={errors as unknown as ErrorSchema}
            formData={stepsState}
            formContext={{ ...propFormContext, formData: stepsState }}
            schema={currentStep.schema}
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
            <div className={styles.footer}>
              <Button
                variant="tertiary"
                onPress={handleBack}
                className={styles.backButton}
                isDisabled={activeStep < 1 || isValidating}
              >
                {backLabel}
              </Button>
              <Button variant="primary" type="submit" isDisabled={isValidating}>
                {activeStep === visibleSteps.length - 1
                  ? reviewLabel
                  : t('stepper.nextButtonText')}
              </Button>
            </div>
          </Form>
        ) : // TODO: potentially move away from this pattern, deprecate?
        ReviewStepComponent ? (
          <ReviewStepComponent
            disableButtons={isValidating}
            formData={filteredFormState}
            handleBack={handleBack}
            handleReset={() => {}}
            steps={visibleSteps}
            handleCreate={handleCreate}
          />
        ) : (
          <>
            <ReviewStateComponent
              formState={filteredFormState}
              schemas={visibleSteps}
            />
            <div className={styles.footer}>
              <Button
                variant="tertiary"
                onPress={handleBack}
                className={styles.backButton}
                isDisabled={activeStep < 1}
              >
                {backLabel}
              </Button>
              <Button
                variant="primary"
                isDisabled={isCreating}
                onPress={handleCreate}
              >
                {createLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
