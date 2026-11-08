/*
 * Copyright 2025 The Backstage Authors
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
import { AnalyticsTracker, ApiHolder } from '@backstage/core-plugin-api';
import {
  CustomFieldValidator,
  FormProps,
} from '@backstage/plugin-scaffolder-react';
import { JsonObject, JsonValue } from '@backstage/types';
import { type IChangeEvent } from '@rjsf/core';
import type { ValidatorType } from '@rjsf/utils';
import { cloneDeep, isEqual, merge } from 'lodash';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ParsedTemplateSchema } from '../../hooks';
import { resolveParameterSteps } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createAsyncValidators,
  type FormValidation,
} from './createAsyncValidators';
import { getValidationData, hasErrors } from './utils';

/** The custom field validators registered for the template's extensions. */
export type StepperWizardValidators = Record<
  string,
  undefined | CustomFieldValidator<unknown, unknown>
>;

/**
 * A step definition together with the inputs, form context and validators that
 * its successful validation was based on. Completion is invalidated when any
 * of them change.
 */
export type CompletedStep = {
  step: ParsedTemplateSchema;
  inputs: JsonObject;
  formData: JsonObject;
  validators: StepperWizardValidators;
};

type Navigation = {
  activeStepIndex: number;
  visitedSteps: Map<number, ParsedTemplateSchema>;
  validatedSteps: Map<number, CompletedStep>;
};

/** Options for {@link useStepperWizard}. */
export type StepperWizardOptions = {
  steps: ParsedTemplateSchema[];
  validators: StepperWizardValidators;
  validator: ValidatorType<any, any, any>;
  apiHolder: ApiHolder;
  initialState: Record<string, JsonValue>;
  onCreate: (values: Record<string, JsonValue>) => Promise<void>;
  createLabel: ReactNode;
  analytics: AnalyticsTracker;
  uiSchema?: FormProps['uiSchema'];
  transformErrors?: FormProps['transformErrors'];
};

/** The wizard state machine owned by {@link useStepperWizard}. */
export type StepperWizard = {
  stepsState: Record<string, JsonValue>;
  filteredFormState: Record<string, JsonValue>;
  visibleSteps: ParsedTemplateSchema[];
  activeStep: number;
  displayedStepIndex: number;
  currentVisits: Map<number, ParsedTemplateSchema>;
  isValidating: boolean;
  validationInterrupted: boolean;
  isCreating: boolean;
  errors: FormValidation | undefined;
  isStepLabelAllowed: (step: number) => boolean;
  handleChange: (e: IChangeEvent) => void;
  handleBack: () => void;
  handleNext: (props: {
    formData?: Record<string, JsonValue>;
  }) => Promise<void>;
  handleCreate: () => Promise<void>;
  goToStep: (step: number) => void;
};

/**
 * The navigation and validation state machine of the template wizard. Owns
 * the form values, the cursor, which steps were visited and validated, and
 * the asynchronous validation bookkeeping. The `Stepper` component mostly
 * renders from the returned state and calls the returned transitions.
 */
export const useStepperWizard = (
  options: StepperWizardOptions,
): StepperWizard => {
  const {
    steps,
    validators,
    validator,
    apiHolder,
    initialState,
    onCreate,
    createLabel,
    analytics,
    uiSchema: propUiSchema,
    transformErrors,
  } = options;

  const customValidatorNames = useMemo(
    () => new Set(Object.keys(validators).filter(name => validators[name])),
    [validators],
  );
  // Index into `steps` rather than `visibleSteps`, so that the active step
  // stays the same when other steps are shown or hidden.
  const [navigation, setNavigation] = useState<Navigation>({
    activeStepIndex: 0,
    visitedSteps: new Map(),
    validatedSteps: new Map(),
  });
  const { activeStepIndex, visitedSteps, validatedSteps } = navigation;
  const setActiveStepIndex = useCallback((index: number) => {
    setNavigation(current => ({ ...current, activeStepIndex: index }));
  }, []);
  const [isValidating, setIsValidating] = useState(false);
  const [validationInterrupted, setValidationInterrupted] = useState(false);
  const returnToPending = useRef(false);
  const validationAttempt = useRef(0);
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
          transformErrors,
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
      validator,
      apiHolder,
      transformErrors,
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
      validator,
      continueToReview,
    ],
  );

  // Scrolling to the top on step change is a rendering concern and stays in
  // the Stepper component.

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

  // A label can be activated to revisit a previously visited visible step, or
  // to go back to an earlier step. The policy lives here so the Stepper
  // component only renders it.
  const isStepLabelAllowed = useCallback(
    (step: number) =>
      activeStep > step ||
      (step > activeStep &&
        currentVisits.has(steps.indexOf(visibleSteps[step]))),
    [activeStep, currentVisits, steps, visibleSteps],
  );

  const goToStep = useCallback(
    (step: number) => {
      validationAttempt.current += 1;
      validationInFlight.current = undefined;
      setIsValidating(false);
      setValidationInterrupted(false);
      returnToPending.current = false;
      setErrors(undefined);
      setActiveStep(step);
    },
    [setActiveStep],
  );

  return {
    stepsState,
    filteredFormState,
    visibleSteps,
    activeStep,
    displayedStepIndex,
    currentVisits,
    isValidating,
    validationInterrupted,
    isCreating,
    errors,
    isStepLabelAllowed,
    handleChange,
    handleBack,
    handleNext,
    handleCreate,
    goToStep,
  };
};
