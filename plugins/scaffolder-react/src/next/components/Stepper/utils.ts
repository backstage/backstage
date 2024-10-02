/*
 * Copyright 2023 The Backstage Authors
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
import type { JsonObject, JsonValue } from '@backstage/types';
import type { FieldValidation } from '@rjsf/utils';
import { FormValidation } from './createAsyncValidators';
import { type ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { LayoutOptions } from '../../../layouts/';

function isFieldValidation(error: any): error is FieldValidation {
  return !!error && '__errors' in error;
}

export function hasErrors(errors?: FormValidation): boolean {
  if (!errors) {
    return false;
  }

  for (const error of Object.values(errors)) {
    if (isFieldValidation(error)) {
      if ((error.__errors ?? []).length > 0) {
        return true;
      }

      continue;
    }

    if (hasErrors(error)) {
      return true;
    }
  }

  return false;
}

export function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface Options {
  layouts?: LayoutOptions[];
}

export const transformSchemaToProps = (
  step: ParsedTemplateSchema,
  options: Options = {},
): ParsedTemplateSchema => {
  const { layouts = [] } = options;
  const objectFieldTemplate = step?.uiSchema['ui:ObjectFieldTemplate'] as
    | string
    | undefined;

  if (typeof objectFieldTemplate !== 'string') {
    return step;
  }

  const Layout = layouts.find(
    layout => layout.name === objectFieldTemplate,
  )?.component;

  if (!Layout) {
    return step;
  }

  return {
    ...step,
    uiSchema: {
      ...step.uiSchema,
      ['ui:ObjectFieldTemplate']: Layout,
    },
  };
};

export const makeStepKey = (step: string | number) => `step-${step}`;

export const getInitialFormState = (
  steps: ParsedTemplateSchema[],
  initialState: Record<string, JsonValue>,
) => {
  return steps.reduce((formState, step, index) => {
    const stepKey = makeStepKey(index);
    formState[stepKey] = {};
    if (step.mergedSchema.properties) {
      Object.keys(step.mergedSchema.properties).forEach(key => {
        if (initialState && initialState[key] !== undefined) {
          formState[stepKey][key] = initialState[key];
        }
      });
    }

    return formState;
  }, {} as { [step: string]: Record<string, JsonValue> });
};
