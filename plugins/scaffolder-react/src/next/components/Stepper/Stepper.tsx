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
} from '@material-ui/core';
import { type IChangeEvent, withTheme } from '@rjsf/core-v5';
import { ErrorSchema, FieldValidation } from '@rjsf/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { NextFieldExtensionOptions } from '../../extensions';
import { TemplateParameterSchema } from '../../../types';
import { createAsyncValidators } from './createAsyncValidators';
import { useTemplateSchema } from '../../hooks/useTemplateSchema';
import { ReviewState } from '../ReviewState';
import validator from '@rjsf/validator-ajv6';

import { useFormDataFromQuery } from '../../hooks';
import { FormProps } from '../../types';

const useStyles = makeStyles(theme => ({
  backButton: {
    marginRight: theme.spacing(1),
  },

  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
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

  onComplete: (values: Record<string, JsonValue>) => Promise<void>;
};

// TODO(blam): We require here, as the types in this package depend on @rjsf/core explicitly
// which is what we're using here as the default types, it needs to depend on @rjsf/core-v5 because
// of the re-writing we're doing. Once we've migrated, we can import this the exact same as before.
const Form = withTheme(require('@rjsf/material-ui-v5').Theme);

/**
 * The `Stepper` component is the Wizard that is rendered when a user selects a template
 * @alpha
 */
export const Stepper = (props: StepperProps) => {
  const analytics = useAnalytics();
  const { steps } = useTemplateSchema(props.manifest);
  const apiHolder = useApiHolder();
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useFormDataFromQuery(props.initialState);

  const [errors, setErrors] = useState<
    undefined | Record<string, FieldValidation>
  >();
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

  const handleNext = async ({
    formData,
  }: {
    formData: Record<string, JsonValue>;
  }) => {
    // TODO(blam): What do we do about loading states, does each field extension get a chance
    // to display it's own loading? Or should we grey out the entire form.
    setErrors(undefined);

    const returnedValidation = await validation(formData);

    const hasErrors = Object.values(returnedValidation).some(
      i => i.__errors?.length,
    );

    if (hasErrors) {
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
            schema={steps[activeStep].schema}
            uiSchema={steps[activeStep].uiSchema}
            onSubmit={handleNext}
            fields={extensions}
            showErrorList={false}
            onChange={handleChange}
            {...(props.FormProps ?? {})}
          >
            <div className={styles.footer}>
              <Button
                onClick={handleBack}
                className={styles.backButton}
                disabled={activeStep < 1}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {activeStep === steps.length - 1 ? 'Review' : 'Next'}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <ReviewState formState={formState} schemas={steps} />
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
                onClick={() => {
                  props.onComplete(formState);
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
                Create
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
