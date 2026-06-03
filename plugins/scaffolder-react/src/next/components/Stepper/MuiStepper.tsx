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
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { Button } from '@backstage/ui';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiStep from '@material-ui/core/Step';
import MuiStepLabel from '@material-ui/core/StepLabel';
import MuiStepperComponent from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorSchema } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { merge } from 'lodash';
import { ComponentType } from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';
import { Form } from '../Form';
import { PasswordWidget } from '../PasswordWidget/PasswordWidget';
import { ReviewState, type ReviewStateProps } from '../ReviewState';
import { ErrorListTemplate } from './ErrorListTemplate';
import { type StepperProps } from './Stepper';
import { useStepperState } from './useStepperState';

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

export const MuiStepper = (stepperProps: StepperProps) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const { components = {} } = stepperProps;
  const { ReviewStateComponent = ReviewState, ReviewStepComponent } =
    components;

  if (process.env.NODE_ENV !== 'production' && stepperProps.previewMode) {
    // eslint-disable-next-line no-console
    console.warn(
      'previewMode is only supported with EXPERIMENTAL_theme: "bui"',
    );
  }

  const styles = useStyles();

  const {
    steps,
    activeStep,
    setActiveStep,
    stepsState,
    errors,
    isValidating,
    isCreating,
    currentStep,
    fields,
    backLabel,
    createLabel,
    reviewLabel,
    handleBack,
    handleChange,
    handleNext,
    handleCreate,
  } = useStepperState(stepperProps);

  const {
    formContext: propFormContext,
    uiSchema: propUiSchema,
    liveOmit: _shouldLiveOmit,
    omitExtraData: _shouldOmitExtraData,
    ...restFormProps
  } = stepperProps.formProps ?? {};

  const mergedUiSchema = merge({}, propUiSchema, currentStep?.uiSchema);

  return (
    <>
      {isValidating && <LinearProgress variant="indeterminate" />}
      <MuiStepperComponent
        activeStep={activeStep}
        alternativeLabel
        variant="elevation"
        style={{ overflowX: 'auto' }}
      >
        {steps.map((step, index) => {
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
      </MuiStepperComponent>
      <div className={styles.formWrapper}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {activeStep < steps.length ? (
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
