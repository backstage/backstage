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
import { renderHook, act, waitFor } from '@testing-library/react';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import type { AnalyticsTracker } from '@backstage/core-plugin-api';
import { CustomFieldValidator } from '@backstage/plugin-scaffolder-react';
import { JsonObject } from '@backstage/types';

import type { ParsedTemplateSchema } from '../../hooks';
import {
  useStepperWizard,
  type StepperWizardOptions,
} from './useStepperWizard';

const validator = customizeValidator();
ajvErrors(validator.ajv);

const makeStep = (
  title: string,
  when?: string | boolean,
  schema: JsonObject = { type: 'object', properties: {} },
): ParsedTemplateSchema => ({
  title,
  schema,
  mergedSchema: schema,
  uiSchema: {},
  ...(when === undefined ? {} : { when }),
});

const nameStep = (title: string) =>
  makeStep(title, undefined, {
    required: ['name'],
    properties: { name: { type: 'string', 'ui:field': 'Name' } },
  });

const analytics = { captureEvent: jest.fn() } as unknown as AnalyticsTracker;

const makeOptions = (
  steps: ParsedTemplateSchema[],
  overrides: Partial<StepperWizardOptions> = {},
): StepperWizardOptions => ({
  steps,
  validators: {},
  validator,
  apiHolder: { get: () => undefined },
  initialState: {},
  onCreate: jest.fn().mockResolvedValue(undefined),
  createLabel: 'Create',
  analytics,
  uiSchema: undefined,
  transformErrors: undefined,
  ...overrides,
});

describe('useStepperWizard', () => {
  it('starts on the first step and records it as visited', () => {
    const steps = [makeStep('One'), makeStep('Two')];
    const { result } = renderHook(() => useStepperWizard(makeOptions(steps)));

    expect(result.current.activeStep).toBe(0);
    expect(result.current.displayedStepIndex).toBe(0);
    expect(result.current.visibleSteps).toHaveLength(2);
    expect(result.current.isValidating).toBe(false);
    expect(result.current.isStepLabelAllowed(0)).toBe(false);
    expect(result.current.isStepLabelAllowed(1)).toBe(false);
  });

  it('navigates back and to previously visited steps', () => {
    const steps = [makeStep('One'), makeStep('Two'), makeStep('Three')];
    const { result } = renderHook(() => useStepperWizard(makeOptions(steps)));

    act(() => result.current.goToStep(1));
    expect(result.current.activeStep).toBe(1);

    // Forward labels stay locked until the step has been visited.
    expect(result.current.isStepLabelAllowed(2)).toBe(false);
    expect(result.current.isStepLabelAllowed(0)).toBe(true);

    act(() => result.current.handleBack());
    expect(result.current.activeStep).toBe(0);
    expect(result.current.isStepLabelAllowed(1)).toBe(true);
  });

  it('keeps the cursor on the displayed step when a later step is hidden', () => {
    const steps = [makeStep('One'), makeStep('Two')];
    const { result, rerender } = renderHook(
      (props: StepperWizardOptions) => useStepperWizard(props),
      { initialProps: makeOptions(steps) },
    );

    act(() => result.current.goToStep(1));
    expect(result.current.activeStep).toBe(1);

    // `Two` becomes hidden while the user is on it.
    rerender(makeOptions([makeStep('One'), makeStep('Two', false)]));
    expect(result.current.visibleSteps).toHaveLength(1);
    expect(result.current.activeStep).toBe(0);
    expect(result.current.displayedStepIndex).toBe(0);
  });

  it('moves the cursor to the first pending step when the last visited step is hidden', () => {
    const steps = [makeStep('One'), makeStep('Two')];
    const { result, rerender } = renderHook(
      (props: StepperWizardOptions) => useStepperWizard(props),
      { initialProps: makeOptions(steps) },
    );

    // Both steps visited, cursor parked on the review pseudo step.
    act(() => result.current.goToStep(1));
    expect(result.current.displayedStepIndex).toBe(1);

    rerender(makeOptions([makeStep('One'), makeStep('Two', false)]));
    // The user was past the last visible step: reconciliation moves the
    // cursor back to the first visible step without validation instead of
    // leaving it stranded beyond the wizard.
    expect(result.current.activeStep).toBe(0);
  });

  it('applies effective form changes and ignores no-op synchronizations', () => {
    const steps = [makeStep('One')];
    const { result } = renderHook(() => useStepperWizard(makeOptions(steps)));

    const before = result.current.stepsState;
    act(() => result.current.handleChange({ formData: { name: 'a' } } as any));
    expect(result.current.stepsState).toEqual({ name: 'a' });
    expect(result.current.stepsState).not.toBe(before);

    const after = result.current.stepsState;
    act(() => result.current.handleChange({ formData: { name: 'a' } } as any));
    expect(result.current.stepsState).toBe(after);
  });

  it('discards a stale async result when the form changes while checking', async () => {
    let finish: () => void = () => {};
    const pending = new Promise<void>(resolve => {
      finish = resolve;
    });
    const validate = jest.fn(async () => {
      await pending;
    });
    const { result } = renderHook(
      (props: StepperWizardOptions) => useStepperWizard(props),
      {
        initialProps: makeOptions([nameStep('One')], {
          validators: { Name: validate },
        }),
      },
    );

    act(() => {
      void result.current.handleNext({ formData: { name: 'a' } });
    });
    await waitFor(() => expect(result.current.isValidating).toBe(true));
    expect(validate).toHaveBeenCalledTimes(1);

    // A real edit interrupts the check and keeps the latest value.
    act(() => {
      result.current.handleChange({ formData: { name: 'b' } } as any);
    });
    expect(result.current.isValidating).toBe(false);
    expect(result.current.validationInterrupted).toBe(true);

    // The slow result must not move the cursor or clear the flag.
    await act(async () => {
      finish();
      await pending;
    });
    expect(result.current.activeStep).toBe(0);
    expect(result.current.validationInterrupted).toBe(true);
    expect(result.current.stepsState).toEqual({ name: 'b' });
  });

  it('completes a step once the async check succeeds and lets create proceed', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const validate = jest.fn(async () => {});
    const { result } = renderHook(
      (props: StepperWizardOptions) => useStepperWizard(props),
      {
        initialProps: makeOptions([nameStep('One')], {
          validators: { Name: validate },
          onCreate,
        }),
      },
    );

    act(() => {
      void result.current.handleNext({ formData: { name: 'a' } });
    });
    await waitFor(() => expect(result.current.isValidating).toBe(false));
    expect(validate).toHaveBeenCalledTimes(1);
    expect(result.current.activeStep).toBe(1);

    // The successful completion is cached: create submits without rechecking.
    await act(async () => {
      result.current.handleCreate();
    });
    expect(onCreate).toHaveBeenCalledWith({ name: 'a' });
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('keeps the step pending and blocks create after a failed async check', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const validate: CustomFieldValidator<unknown, unknown> = async (
      _value,
      errors,
    ) => {
      errors.addError('Name is already taken');
    };
    const { result } = renderHook(
      (props: StepperWizardOptions) => useStepperWizard(props),
      {
        initialProps: makeOptions([nameStep('One')], {
          validators: { Name: validate },
          onCreate,
        }),
      },
    );

    act(() => {
      void result.current.handleNext({ formData: { name: 'taken' } });
    });
    await waitFor(() => expect(result.current.isValidating).toBe(false));
    expect(result.current.activeStep).toBe(0);
    expect(result.current.errors?.name).toBeDefined();

    // Creation must rerun the check instead of submitting.
    await act(async () => {
      result.current.handleCreate();
    });
    expect(onCreate).not.toHaveBeenCalled();
    expect(result.current.activeStep).toBe(0);
  });
});
