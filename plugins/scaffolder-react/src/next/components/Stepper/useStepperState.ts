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
import { JsonValue } from '@backstage/types';
import { type IChangeEvent } from '@rjsf/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';
import { useFormDataFromQuery, useTemplateSchema } from '../../hooks';
import { useTransformSchemaToProps } from '../../hooks/useTransformSchemaToProps';
import {
  createAsyncValidators,
  type FormValidation,
} from './createAsyncValidators';
import * as FieldOverrides from './FieldOverrides';
import { hasErrors } from './utils';
import { type StepperProps } from './Stepper';

export function useStepperState(stepperProps: StepperProps) {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const { layouts = [], components = {}, onCreate } = stepperProps;
  const {
    backButtonText = t('stepper.backButtonText'),
    createButtonText = t('stepper.createButtonText'),
    reviewButtonText = t('stepper.reviewButtonText'),
  } = components;

  const analytics = useAnalytics();
  const { presentation, steps } = useTemplateSchema(stepperProps.manifest);
  const apiHolder = useApiHolder();

  const [activeStep, setActiveStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [initialState] = useFormDataFromQuery(stepperProps.initialState);
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
      stepperProps.extensions.map(({ name, component }) => [name, component]),
    );
  }, [stepperProps.extensions]);

  const fields = useMemo(
    () => ({ ...FieldOverrides, ...extensions }),
    [extensions],
  );

  const validators = useMemo(() => {
    return Object.fromEntries(
      stepperProps.extensions.map(({ name, validation }) => [name, validation]),
    );
  }, [stepperProps.extensions]);

  const validation = useMemo(() => {
    return createAsyncValidators(steps[activeStep]?.mergedSchema, validators, {
      apiHolder,
    });
  }, [steps, activeStep, validators, apiHolder]);

  const currentStep = useTransformSchemaToProps(steps[activeStep], { layouts });

  const handleBack = useCallback(() => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }, []);

  const handleChange = useCallback((e: IChangeEvent) => {
    setStepsState(current => ({ ...current, ...e.formData }));
  }, []);

  const handleNext = useCallback(
    async ({ formData = {} }: { formData?: Record<string, JsonValue> }) => {
      setErrors(undefined);
      setIsValidating(true);

      const returnedValidation = await validation(formData);

      setStepsState(current => ({ ...current, ...formData }));
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

  const handleCreate = useCallback(async () => {
    setIsCreating(true);
    analytics.captureEvent('click', `${createLabel}`);
    try {
      await onCreate(stepsState);
    } finally {
      setIsCreating(false);
    }
  }, [analytics, createLabel, onCreate, stepsState]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main && typeof main.scrollTo === 'function') {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeStep]);

  return {
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
  };
}
