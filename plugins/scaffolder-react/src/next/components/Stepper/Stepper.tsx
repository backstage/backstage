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
import {
  FieldExtensionOptions,
  FormProps,
  LayoutOptions,
  ReviewStepProps,
  TemplateParameterSchema,
} from '@backstage/plugin-scaffolder-react';
import { JsonValue } from '@backstage/types';
import { Box, Button } from '@backstage/ui';
import { ErrorSchema } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { ComponentType, type ReactNode } from 'react';

import { ReviewState, type ReviewStateProps } from '../ReviewState';
import { WizardProgressBar } from './WizardProgressBar';
import { WizardStep, WizardStepContent, WizardStepFooter } from './WizardStep';
import { WizardStepForm } from './WizardStepForm';
import styles from './Stepper.module.css';
import { MuiStepper } from './MuiStepper';
import { useStepperState } from './useStepperState';

const validator = customizeValidator();
ajvErrors(validator.ajv);

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
  previewMode?: boolean;
};

const BuiStepper = (stepperProps: StepperProps) => {
  const { previewMode = false, components = {} } = stepperProps;
  const { ReviewStateComponent = ReviewState, ReviewStepComponent } =
    components;

  const {
    t,
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
    liveOmit: _shouldLiveOmit,
    omitExtraData: _shouldOmitExtraData,
    ...restFormProps
  } = stepperProps.formProps ?? {};

  const totalSteps = steps.length + 1;

  function renderStepContent() {
    if (activeStep < steps.length) {
      return (
        <WizardStepForm
          activeStep={activeStep}
          stepSchema={currentStep.schema}
          stepUiSchema={currentStep.uiSchema}
          formData={stepsState}
          errors={errors as unknown as ErrorSchema}
          fields={fields}
          validator={validator}
          isValidating={isValidating}
          canGoBack={activeStep > 0}
          isLastStep={activeStep === steps.length - 1}
          onSubmit={handleNext}
          onChange={handleChange}
          onBack={handleBack}
          backLabel={backLabel}
          reviewLabel={reviewLabel}
          nextLabel={t('stepper.nextButtonText')}
          validatingLabel={t('stepper.validatingButtonText')}
          formProps={restFormProps}
          preview={previewMode}
        />
      );
    }

    if (ReviewStepComponent) {
      return (
        <ReviewStepComponent
          disableButtons={isValidating}
          formData={stepsState}
          handleBack={handleBack}
          handleReset={() => {}}
          steps={steps}
          handleCreate={handleCreate}
        />
      );
    }

    return (
      <WizardStep>
        <WizardStepContent>
          <ReviewStateComponent formState={stepsState} schemas={steps} />
        </WizardStepContent>
        <WizardStepFooter>
          <Button
            variant="tertiary"
            onPress={handleBack}
            isDisabled={isCreating}
          >
            {backLabel}
          </Button>
          <Button
            variant="primary"
            isDisabled={isCreating}
            onPress={handleCreate}
          >
            {isCreating ? t('stepper.submittingButtonText') : createLabel}
          </Button>
        </WizardStepFooter>
      </WizardStep>
    );
  }

  return (
    <Box className={styles.stepper}>
      <WizardProgressBar
        steps={steps}
        activeStep={activeStep}
        totalSteps={totalSteps}
        onStepClick={setActiveStep}
        reviewLabel={reviewLabel}
        previewMode={previewMode}
      />
      <Box className={styles.stepperContent}>{renderStepContent()}</Box>
    </Box>
  );
};

/**
 * The `Stepper` component is the Wizard that is rendered when a user selects a template
 * @alpha
 */
export const Stepper = (props: StepperProps) => {
  const theme = props.formProps?.EXPERIMENTAL_theme ?? 'mui';
  if (theme === 'bui') {
    return <BuiStepper {...props} />;
  }
  return <MuiStepper {...props} />;
};
