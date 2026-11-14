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
import Alert from '@material-ui/lab/Alert';
import { useDeepCompareMemo } from '@react-hookz/web';
import MuiStep from '@material-ui/core/Step';
import MuiStepButton from '@material-ui/core/StepButton';
import MuiStepLabel from '@material-ui/core/StepLabel';
import MuiStepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorSchema } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { merge } from 'lodash';
import {
  ComponentType,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';
import { useFormDataFromQuery, useTemplateSchema } from '../../hooks';
import { useTransformSchemaToProps } from '../../hooks/useTransformSchemaToProps';
import { Form } from '../Form';
import { PasswordWidget } from '../PasswordWidget/PasswordWidget';
import { ReviewState, type ReviewStateProps } from '../ReviewState';
import { ErrorListTemplate } from './ErrorListTemplate';
import * as FieldOverrides from './FieldOverrides';
import { useStepperWizard } from './useStepperWizard';

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
  const parsed = useTemplateSchema(props.manifest);
  const { presentation } = parsed;
  // Parsing creates fresh objects on every render. Keep definitions stable so
  // progress and error renders do not repeat completion reconciliation.
  const steps = useDeepCompareMemo(() => parsed.steps, [parsed.steps]);
  const apiHolder = useApiHolder();
  const validators = useDeepCompareMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, validation }) => [name, validation]),
    );
  }, [props.extensions]);

  const [initialState] = useFormDataFromQuery(props.initialState);

  const backLabel =
    presentation?.buttonLabels?.backButtonText ?? backButtonText;
  const createLabel =
    presentation?.buttonLabels?.createButtonText ?? createButtonText;
  const reviewLabel =
    presentation?.buttonLabels?.reviewButtonText ?? reviewButtonText;

  // Navigation and validation state lives in the wizard hook; this component
  // wires the form and renders from the returned state.
  const wizard = useStepperWizard({
    steps,
    validators,
    validator,
    apiHolder,
    initialState,
    onCreate,
    createLabel,
    analytics,
    uiSchema: props.formProps?.uiSchema,
    transformErrors: props.formProps?.transformErrors,
  });
  const {
    visibleSteps,
    activeStep,
    isValidating,
    validationInterrupted,
    isCreating,
    errors,
    isStepLabelAllowed,
  } = wizard;

  const styles = useStyles();
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const extensions = useMemo(() => {
    return Object.fromEntries(
      props.extensions.map(({ name, component }) => [name, component]),
    );
  }, [props.extensions]);

  const fields = useMemo(
    () => ({ ...FieldOverrides, ...extensions }),
    [extensions],
  );

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

  const mergedUiSchema = merge({}, propUiSchema, currentStep?.uiSchema);

  useEffect(() => {
    const getScrollableParent = (
      element: HTMLElement | null,
    ): HTMLElement | null => {
      if (!element) return null;
      const { overflowY } = window.getComputedStyle(element);
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
      if (isScrollable && element.scrollHeight > element.clientHeight) {
        return element;
      }
      return getScrollableParent(element.parentElement);
    };

    const scrollTarget = getScrollableParent(formWrapperRef.current);

    if (scrollTarget && typeof scrollTarget.scrollTo === 'function') {
      scrollTarget.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeStep]);

  return (
    <>
      {isValidating && <LinearProgress variant="indeterminate" />}
      {validationInterrupted && (
        <Alert severity="info">{t('stepper.validationInterrupted')}</Alert>
      )}
      <MuiStepper
        activeStep={activeStep}
        alternativeLabel
        variant="elevation"
        style={{ overflowX: 'auto' }}
      >
        {visibleSteps.map((step, index) => {
          return (
            <MuiStep key={steps.indexOf(step)}>
              <MuiStepButton
                aria-label={t('stepper.stepLabel', {
                  title: step.title,
                  index: index + 1,
                })}
                disabled={!isStepLabelAllowed(index)}
                onClick={() => {
                  if (isStepLabelAllowed(index)) {
                    wizard.goToStep(index);
                  }
                }}
              >
                {step.title}
              </MuiStepButton>
            </MuiStep>
          );
        })}
        <MuiStep>
          <MuiStepLabel>{reviewLabel}</MuiStepLabel>
        </MuiStep>
      </MuiStepper>
      <div className={styles.formWrapper} ref={formWrapperRef}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {activeStep < visibleSteps.length ? (
          <Form
            key={steps.indexOf(visibleSteps[activeStep])}
            validator={validator}
            extraErrors={errors as unknown as ErrorSchema}
            formData={wizard.stepsState}
            formContext={{ ...propFormContext, formData: wizard.stepsState }}
            schema={currentStep.schema}
            uiSchema={mergedUiSchema}
            onSubmit={wizard.handleNext}
            fields={fields}
            showErrorList="top"
            templates={{ ErrorListTemplate }}
            onChange={wizard.handleChange}
            widgets={{ password: PasswordWidget }}
            experimental_defaultFormStateBehavior={{
              allOf: 'populateDefaults',
            }}
            {...restFormProps}
          >
            <div className={styles.footer}>
              <Button
                variant="tertiary"
                onPress={wizard.handleBack}
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
            formData={wizard.filteredFormState}
            handleBack={wizard.handleBack}
            handleReset={() => {}}
            steps={visibleSteps}
            handleCreate={wizard.handleCreate}
          />
        ) : (
          <>
            <ReviewStateComponent
              formState={wizard.filteredFormState}
              schemaFormState={wizard.stepsState}
              schemas={visibleSteps}
            />
            <div className={styles.footer}>
              <Button
                variant="tertiary"
                onPress={wizard.handleBack}
                className={styles.backButton}
                isDisabled={activeStep < 1 || isValidating}
              >
                {backLabel}
              </Button>
              <Button
                variant="primary"
                isDisabled={isCreating || isValidating}
                onPress={wizard.handleCreate}
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
