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
import { JsonValue } from '@backstage/types';
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  Button,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import { type IChangeEvent } from '@rjsf/core-v5';
import { ErrorSchema } from '@rjsf/utils';
import React, { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NextFieldExtensionOptions } from '../../../extensions';
import {
  createAsyncValidators,
  type FormValidation,
} from './createAsyncValidators';
import { ReviewState, type ReviewStateProps } from '../ReviewState';
import { useTemplateSchema } from '../../hooks/useTemplateSchema';
import validator from '@rjsf/validator-ajv8';
import { useFormDataFromQuery } from '../../hooks';
import { FormProps } from '../../types';
import { useTransformSchemaToProps } from '../../hooks/useTransformSchemaToProps';
import { hasErrors } from './utils';
import * as FieldOverrides from './FieldOverrides';
import { Form } from '../Form';
import {
  TemplateParameterSchema,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';

const useStyles = makeStyles(theme => ({
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
}));

/**
 * The Props for {@link Stepper} component
 * @alpha
 */
export type StepperProps = {
  manifest: TemplateParameterSchema;
  extensions: NextFieldExtensionOptions<any, any>[];
  templateName?: string;
  FormProps?: FormProps;
  initialState?: Record<string, JsonValue>;
  onCreate: (values: Record<string, JsonValue>) => Promise<void>;
  components?: {
    ReviewStateComponent?: (props: ReviewStateProps) => JSX.Element;
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
  const { layouts = [], components = {}, ...props } = stepperProps;
  const {
    ReviewStateComponent = ReviewState,
    createButtonText = 'Create',
    reviewButtonText = 'Review',
  } = components;
  const analytics = useAnalytics();
  const { steps } = useTemplateSchema(props.manifest);
  const apiHolder = useApiHolder();
  const [activeStep, setActiveStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [formState, setFormState] = useFormDataFromQuery(props.initialState);

  const [errors, setErrors] = useState<undefined | FormValidation>();
  const styles = useStyles();

  const extensions = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, component }) => [name, component]),
    );
  }, [props.extensions]);

  const validators = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, validation }) => [name, validation]),
    );
  }, [props.extensions]);

  const validation = useMemo(() => {
    return createAsyncValidators(steps[activeStep]?.mergedSchema, validators, {
      apiHolder,
    });
  }, [steps, activeStep, validators, apiHolder]);

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleChange = useCallback(
    (e: IChangeEvent) =>
      setFormState(current => ({ ...current, ...e.formData })),
    [setFormState],
  );

  const currentStep = useTransformSchemaToProps(steps[activeStep], { layouts });

  const handleNext = async ({
    formData = {},
  }: {
    formData?: Record<string, JsonValue>;
  }) => {
    // The validation should never throw, as the validators are wrapped in a try/catch.
    // This makes it fine to set and unset state without try/catch.
    setErrors(undefined);
    setIsValidating(true);

    const returnedValidation = await validation(formData);

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
    setFormState(current => ({ ...current, ...formData }));
  };

  return (
    <>
      {isValidating && <LinearProgress variant="indeterminate" />}
      <MuiStepper activeStep={activeStep} alternativeLabel variant="elevation">
        {steps.map((step, index) => (
          <MuiStep key={index}>
            <MuiStepLabel>{step.title}</MuiStepLabel>
          </MuiStep>
        ))}
        <MuiStep>
          <MuiStepLabel>Review</MuiStepLabel>
        </MuiStep>
      </MuiStepper>
      <div className={styles.formWrapper}>
        {activeStep < steps.length ? (
          <Form
            validator={validator}
            extraErrors={errors as unknown as ErrorSchema}
            formData={formState}
            formContext={{ formData: formState }}
            schema={currentStep.schema}
            uiSchema={currentStep.uiSchema}
            onSubmit={handleNext}
            fields={{ ...FieldOverrides, ...extensions }}
            showErrorList={false}
            onChange={handleChange}
            {...(props.FormProps ?? {})}
          >
            <div className={styles.footer}>
              <Button
                onClick={handleBack}
                className={styles.backButton}
                disabled={activeStep < 1 || isValidating}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isValidating}
              >
                {activeStep === steps.length - 1 ? reviewButtonText : 'Next'}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <ReviewStateComponent formState={formState} schemas={steps} />
            <div className={styles.footer}>
              <Button
                onClick={handleBack}
                className={styles.backButton}
                disabled={activeStep < 1}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  props.onCreate(formState);
                  const name =
                    typeof formState.name === 'string'
                      ? formState.name
                      : undefined;
                  analytics.captureEvent(
                    'create',
                    name ?? props.templateName ?? 'unknown',
                  );
                }}
              >
                {createButtonText}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
