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
import { resolveParameterSteps } from '@backstage/plugin-scaffolder-common/alpha';
import { JsonObject, JsonValue } from '@backstage/types';
import { Button } from '@backstage/ui';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import { useDeepCompareMemo } from '@react-hookz/web';
import MuiStep from '@material-ui/core/Step';
import MuiStepButton from '@material-ui/core/StepButton';
import MuiStepLabel from '@material-ui/core/StepLabel';
import MuiStepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import { type IChangeEvent } from '@rjsf/core';
import { ErrorSchema } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { cloneDeep, isEqual, merge } from 'lodash';
import {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import { getValidationData, hasErrors } from './utils';

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

  const customValidatorNames = useMemo(
    () => new Set(Object.keys(validators).filter(name => validators[name])),
    [validators],
  );
  // Index into `steps` rather than `visibleSteps`, so that the active step
  // stays the same when other steps are shown or hidden.
  type CompletedStep = {
    step: (typeof steps)[number];
    inputs: JsonObject;
    formData: JsonObject;
    validators: typeof validators;
  };
  const [navigation, setNavigation] = useState({
    activeStepIndex: 0,
    visitedSteps: new Map<number, (typeof steps)[number]>(),
    validatedSteps: new Map<number, CompletedStep>(),
  });
  const { activeStepIndex, visitedSteps, validatedSteps } = navigation;
  const setActiveStepIndex = useCallback((index: number) => {
    setNavigation(current => ({ ...current, activeStepIndex: index }));
  }, []);
  const [isValidating, setIsValidating] = useState(false);
  const [validationInterrupted, setValidationInterrupted] = useState(false);
  const returnToPending = useRef(false);
  const validationAttempt = useRef(0);
  const [initialState] = useFormDataFromQuery(props.initialState);
  const [stepsState, setStepsState] =
    useState<Record<string, JsonValue>>(initialState);

  // Field effects can emit several updates before React renders again.
  const latestFormData = useRef(stepsState);
  latestFormData.current = stepsState;

  const { visibleSteps, filteredFormState } = useMemo(() => {
    const resolved = resolveParameterSteps(
      stepsState,
      steps.map(step => ({ schema: step.mergedSchema, when: step.when })),
    );
    return {
      visibleSteps: steps.filter((_, index) => resolved.visible[index]),
      filteredFormState: resolved.values,
    };
  }, [steps, stepsState]);

  const visibleIndices = useMemo(
    () => new Set(visibleSteps.map(step => steps.indexOf(step))),
    [steps, visibleSteps],
  );
  const definedValidations = useMemo(
    () =>
      new Map(
        [...validatedSteps].filter(([index, completed]) =>
          isEqual(completed.step, steps[index]),
        ),
      ),
    [validatedSteps, steps],
  );
  const applicableValidations = useMemo(
    () =>
      new Map(
        [...definedValidations].filter(([index]) => visibleIndices.has(index)),
      ),
    [definedValidations, visibleIndices],
  );
  // A changed context requires checking, not necessarily another page visit.
  // Resolve schemas and compare validation inputs only when continuing, rather
  // than on each keystroke. Form data is replaced only on effective changes.
  const currentValidations = useMemo(
    () =>
      new Map(
        [...applicableValidations].filter(
          ([, completed]) =>
            completed.formData === stepsState &&
            completed.validators === validators,
        ),
      ),
    [applicableValidations, stepsState, validators],
  );
  const pendingStepIndex = steps.findIndex(
    (_, index) => visibleIndices.has(index) && !currentValidations.has(index),
  );
  // Reconcile the stored cursor with the displayed step before visibility can
  // change again. Otherwise a previously hidden step can steal the cursor.
  const nextVisibleStep = visibleSteps.findIndex(
    step => steps.indexOf(step) >= activeStepIndex,
  );
  let activeStep =
    nextVisibleStep === -1 ? visibleSteps.length : nextVisibleStep;
  if (
    activeStepIndex < steps.length &&
    activeStep === visibleSteps.length &&
    pendingStepIndex !== -1
  ) {
    activeStep = visibleSteps.indexOf(steps[pendingStepIndex]);
  }
  const displayedStepIndex =
    activeStep < visibleSteps.length
      ? steps.indexOf(visibleSteps[activeStep])
      : steps.length;

  // Revalidation can return to an earlier page whose validator depends on a
  // later page. Keep those visited pages reachable so users can fix the input.
  const definedVisits = useMemo(
    () =>
      new Map(
        [...visitedSteps].filter(([index, step]) =>
          isEqual(step, steps[index]),
        ),
      ),
    [visitedSteps, steps],
  );
  const currentVisits = useMemo(() => {
    const visits = new Map(
      [...definedVisits].filter(([index]) => visibleIndices.has(index)),
    );
    if (displayedStepIndex < steps.length && !visits.has(displayedStepIndex)) {
      visits.set(displayedStepIndex, cloneDeep(steps[displayedStepIndex]));
    }
    return visits.size === visitedSteps.size &&
      [...visits].every(([index, step]) => visitedSteps.get(index) === step)
      ? visitedSteps
      : visits;
  }, [definedVisits, visitedSteps, steps, visibleIndices, displayedStepIndex]);
  // Reconcile visibility, completion and the cursor together before children
  // can dispatch events. Moving this to an effect would expose stale completion.
  if (
    activeStepIndex !== displayedStepIndex ||
    applicableValidations.size !== validatedSteps.size ||
    currentVisits !== visitedSteps
  ) {
    setNavigation({
      activeStepIndex: displayedStepIndex,
      visitedSteps: currentVisits,
      validatedSteps: applicableValidations,
    });
  }

  const setActiveStep = useCallback(
    (step: number) =>
      setActiveStepIndex(
        step < visibleSteps.length
          ? steps.indexOf(visibleSteps[step])
          : steps.length,
      ),
    [steps, visibleSteps, setActiveStepIndex],
  );

  const [errors, setErrors] = useState<undefined | FormValidation>();
  const styles = useStyles();
  const formWrapperRef = useRef<HTMLDivElement>(null);

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

  const validation = useMemo(() => {
    return createAsyncValidators(
      visibleSteps[activeStep]?.mergedSchema,
      validators,
      { apiHolder },
    );
  }, [visibleSteps, activeStep, validators, apiHolder]);

  // Validation results only apply to the form and navigation state submitted.
  // Keep this identity stable across progress/error renders, but invalidate it
  // when the user edits values or the manifest/cursor/completion changes.
  const validationState = useMemo(
    () => ({
      stepsState,
      validatedSteps,
      steps,
      validators,
      displayedStepIndex,
    }),
    [stepsState, validatedSteps, steps, validators, displayedStepIndex],
  );
  const latestValidationState = useRef<typeof validationState>();
  latestValidationState.current = validationState;

  const validationInFlight = useRef<typeof validationState>();
  useEffect(() => {
    // Completion is guarded synchronously above. This only releases progress
    // controls when a new definition/cursor cancels an outstanding request.
    if (
      validationInFlight.current &&
      validationInFlight.current !== validationState
    ) {
      validationAttempt.current += 1;
      validationInFlight.current = undefined;
      setIsValidating(false);
      setValidationInterrupted(true);
    }
  }, [validationState]);

  const handleBack = useCallback(() => {
    returnToPending.current = false;
    setValidationInterrupted(false);
    setActiveStep(activeStep - 1);
  }, [activeStep, setActiveStep]);

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
      const updated = { ...latestFormData.current, ...e.formData };
      // RJSF and field effects can emit onChange without changing any value.
      if (isEqual(updated, latestFormData.current)) return;
      latestFormData.current = updated;
      latestValidationState.current = undefined;
      validationAttempt.current += 1;
      validationInFlight.current = undefined;
      if (isValidating) {
        setIsValidating(false);
        setValidationInterrupted(true);
      }
      setStepsState(updated);
    },
    [isValidating],
  );

  const continueToReview = useCallback(
    async (
      data: Record<string, JsonValue>,
      completed: Map<number, CompletedStep>,
      isCurrent: () => boolean,
    ) => {
      const { visible } = resolveParameterSteps(
        data,
        steps.map(step => ({ schema: step.mergedSchema, when: step.when })),
      );
      for (const [index, step] of steps.entries()) {
        if (!visible[index]) continue;
        const previous = completed.get(index);
        if (previous?.formData === data && previous.validators === validators)
          continue;
        // Automatic checks must not bypass a newly revealed or replaced page.
        if (!currentVisits.has(index)) {
          return { completed, index, errors: undefined };
        }
        const inputs = getValidationData(
          step.mergedSchema,
          data,
          validator,
          customValidatorNames,
        );
        // A field projection can cache custom validation, but cannot capture
        // every JSON Schema constraint on the full context. Check the schema
        // whenever that context changes, without requiring another page visit.
        let errorsForStep = validator.validateFormData(
          data,
          step.schema,
          undefined,
          props.formProps?.transformErrors,
          merge({}, propUiSchema, step.uiSchema),
        ).errorSchema as FormValidation;
        if (
          !hasErrors(errorsForStep) &&
          (!previous ||
            previous.validators !== validators ||
            !isEqual(previous.inputs, inputs))
        ) {
          errorsForStep = await createAsyncValidators(
            step.mergedSchema,
            validators,
            { apiHolder },
          )(data);
        }
        if (!isCurrent()) return undefined;
        if (hasErrors(errorsForStep)) {
          completed.delete(index);
          return { completed, index, errors: errorsForStep };
        }
        completed.set(index, {
          step: cloneDeep(step),
          inputs,
          formData: data,
          validators,
        });
      }
      return { completed, index: steps.length, errors: undefined };
    },
    [
      steps,
      currentVisits,
      customValidatorNames,
      validators,
      apiHolder,
      props.formProps?.transformErrors,
      propUiSchema,
    ],
  );

  const handleNext = useCallback(
    async ({ formData = {} }: { formData?: Record<string, JsonValue> }) => {
      const attempt = ++validationAttempt.current;
      validationInFlight.current = validationState;
      const isCurrent = () =>
        validationAttempt.current === attempt &&
        latestValidationState.current === validationState;
      setErrors(undefined);
      setValidationInterrupted(false);
      setIsValidating(true);
      const returnedValidation = await validation(formData);
      if (!isCurrent()) {
        if (validationAttempt.current === attempt) {
          setIsValidating(false);
          setValidationInterrupted(true);
        }
        return;
      }
      if (hasErrors(returnedValidation)) {
        validationInFlight.current = undefined;
        setIsValidating(false);
        setErrors(returnedValidation);
        setNavigation(current => {
          if (!current.validatedSteps.has(displayedStepIndex)) return current;
          const completed = new Map(current.validatedSteps);
          completed.delete(displayedStepIndex);
          return { ...current, validatedSteps: completed };
        });
        return;
      }
      const updated = { ...stepsState, ...formData };
      const data = isEqual(updated, stepsState) ? stepsState : updated;
      const completed = new Map(applicableValidations).set(displayedStepIndex, {
        step: cloneDeep(steps[displayedStepIndex]),
        inputs: getValidationData(
          steps[displayedStepIndex].mergedSchema,
          data,
          validator,
          customValidatorNames,
        ),
        formData: data,
        validators,
      });
      analytics.captureEvent('click', `Next Step (${activeStep + 1})`);
      const { visible } = resolveParameterSteps(
        data,
        steps.map(step => ({ schema: step.mergedSchema, when: step.when })),
      );
      const next = visible.findIndex(
        (isVisible, index) => isVisible && index > displayedStepIndex,
      );
      const result =
        returnToPending.current || next === -1
          ? await continueToReview(data, completed, isCurrent)
          : { completed, index: next, errors: undefined };
      if (!isCurrent()) {
        if (validationAttempt.current === attempt) {
          setIsValidating(false);
          setValidationInterrupted(true);
        }
        return;
      }
      validationInFlight.current = undefined;
      setIsValidating(false);
      if (result) {
        returnToPending.current =
          (returnToPending.current || next === -1) &&
          result.index < steps.length;
        setErrors(result.errors);
        latestFormData.current = data;
        setStepsState(data);
        setNavigation(current => ({
          ...current,
          activeStepIndex: result.index,
          validatedSteps: result.completed,
        }));
      }
    },
    [
      validation,
      validationState,
      analytics,
      activeStep,
      displayedStepIndex,
      steps,
      stepsState,
      applicableValidations,
      customValidatorNames,
      validators,
      continueToReview,
    ],
  );

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

  const mergedUiSchema = merge({}, propUiSchema, currentStep?.uiSchema);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = useCallback(async () => {
    if (pendingStepIndex !== -1) {
      const attempt = ++validationAttempt.current;
      validationInFlight.current = validationState;
      const isCurrent = () =>
        validationAttempt.current === attempt &&
        latestValidationState.current === validationState;
      setErrors(undefined);
      setValidationInterrupted(false);
      setIsValidating(true);
      const result = await continueToReview(
        stepsState,
        new Map(applicableValidations),
        isCurrent,
      );
      if (!isCurrent()) {
        if (validationAttempt.current === attempt) {
          setIsValidating(false);
          setValidationInterrupted(true);
        }
        return;
      }
      validationInFlight.current = undefined;
      setIsValidating(false);
      if (result) {
        returnToPending.current = result.index < steps.length;
        setErrors(result.errors);
        setNavigation(current => ({
          ...current,
          activeStepIndex: result.index,
          validatedSteps: result.completed,
        }));
      }
      // Reaching review again is deliberate: users see the checked parameters
      // before a subsequent Create submits them.
      return;
    }
    setIsCreating(true);
    analytics.captureEvent('click', `${createLabel}`);
    try {
      await onCreate(filteredFormState);
    } finally {
      setIsCreating(false);
    }
  }, [
    analytics,
    createLabel,
    filteredFormState,
    onCreate,
    pendingStepIndex,
    validationState,
    stepsState,
    applicableValidations,
    continueToReview,
    steps.length,
  ]);

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
          const isAllowedLabelClick =
            activeStep > index ||
            (index > activeStep && currentVisits.has(steps.indexOf(step)));
          return (
            <MuiStep key={steps.indexOf(step)}>
              <MuiStepButton
                aria-label={t('stepper.stepIndexLabel', { index: index + 1 })}
                disabled={!isAllowedLabelClick}
                onClick={() => {
                  if (isAllowedLabelClick) {
                    validationAttempt.current += 1;
                    validationInFlight.current = undefined;
                    setIsValidating(false);
                    setValidationInterrupted(false);
                    returnToPending.current = false;
                    setErrors(undefined);
                    setActiveStep(index);
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
              schemaFormState={stepsState}
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
                isDisabled={isCreating || isValidating}
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
