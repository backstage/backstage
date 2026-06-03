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
import { Button, Grid } from '@backstage/ui';
import { type IChangeEvent } from '@rjsf/core';
import { ErrorSchema, RJSFSchema, UiSchema, ValidatorType } from '@rjsf/utils';
import { JsonValue } from '@backstage/types';
import { merge } from 'lodash';
import { type ReactNode, useCallback, useRef } from 'react';
import { WizardStep, WizardStepContent, WizardStepFooter } from './WizardStep';
import { Form } from '../Form';
import { ErrorListTemplate } from './ErrorListTemplate';
import { PasswordWidget } from '../PasswordWidget/PasswordWidget';
import type { FormProps } from '@backstage/plugin-scaffolder-react';
import type { ScaffolderRJSFRegistryFieldsType } from '../../../extensions/rjsf';

type WizardStepFormProps = {
  activeStep: number;
  stepSchema: RJSFSchema;
  stepUiSchema: UiSchema;
  formData: Record<string, JsonValue>;
  errors?: ErrorSchema;
  fields: ScaffolderRJSFRegistryFieldsType;
  validator: ValidatorType;
  isValidating: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  onSubmit: (e: IChangeEvent) => void;
  onChange: (e: IChangeEvent) => void;
  onBack: () => void;
  backLabel: ReactNode;
  reviewLabel: ReactNode;
  nextLabel: ReactNode;
  validatingLabel: ReactNode;
  formProps?: Omit<FormProps, 'liveOmit' | 'omitExtraData'>;
  preview?: boolean;
};

export const WizardStepForm = ({
  activeStep,
  stepSchema,
  stepUiSchema,
  formData,
  errors,
  fields,
  validator,
  isValidating,
  canGoBack,
  isLastStep,
  onSubmit,
  onChange,
  onBack,
  backLabel,
  reviewLabel,
  nextLabel,
  validatingLabel,
  formProps,
  preview = false,
}: WizardStepFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = useCallback(() => {
    submitButtonRef.current?.click();
  }, []);

  const {
    formContext: propFormContext,
    uiSchema: propUiSchema,
    ...restFormProps
  } = formProps ?? {};

  const mergedUiSchema = merge({}, propUiSchema, stepUiSchema, {
    'ui:title': '',
    'ui:description': '',
  });

  function getButtonLabel() {
    if (isValidating) return validatingLabel;
    if (isLastStep) return reviewLabel;
    return nextLabel;
  }

  return (
    <WizardStep>
      <WizardStepContent preview={preview}>
        <Grid.Root
          columns={preview ? '12' : '8'}
          px={{ initial: 'var(--bui-space-6)', lg: undefined }}
        >
          <Grid.Item
            colSpan={preview ? '10' : { initial: '8', lg: '4' }}
            colStart={preview ? '2' : { initial: '1', lg: '3' }}
          >
            <Form
              key={activeStep}
              validator={validator}
              extraErrors={errors}
              formData={formData}
              formContext={{ ...propFormContext, formData }}
              schema={stepSchema}
              uiSchema={mergedUiSchema}
              onSubmit={onSubmit}
              onChange={onChange}
              fields={fields}
              showErrorList="top"
              templates={{ ErrorListTemplate }}
              widgets={{ password: PasswordWidget }}
              experimental_defaultFormStateBehavior={{
                allOf: 'populateDefaults',
              }}
              noHtml5Validate
              {...restFormProps}
            >
              <button
                ref={submitButtonRef}
                type="submit"
                style={{ display: 'none' }}
                aria-hidden
              />
            </Form>
          </Grid.Item>
        </Grid.Root>
      </WizardStepContent>
      <WizardStepFooter>
        {canGoBack && (
          <Button variant="tertiary" onPress={onBack} isDisabled={isValidating}>
            {backLabel}
          </Button>
        )}
        <Button
          variant="primary"
          onPress={handleSubmit}
          isDisabled={isValidating}
        >
          {getButtonLabel()}
        </Button>
      </WizardStepFooter>
    </WizardStep>
  );
};
