/*
 * Copyright 2021 The Backstage Authors
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
import { ApiHolder } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { FieldValidation, FieldProps } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

/**
 * Type for field validation that includes
 * errors and, optionally, the JSON schema for
 * the field in question.
 *
 * @public
 */
export type ExtendedFieldValidation =
  | FieldValidation & {
      schema?: JsonObject;
    };

/**
 * Field validation type for Custom Field Extensions.
 *
 * @public
 */
export type CustomFieldValidator<TFieldReturnValue> = (
  data: TFieldReturnValue,
  field: ExtendedFieldValidation,
  context: { apiHolder: ApiHolder },
) => void | Promise<void>;

/**
 * Type for the Custom Field Extension schema.
 *
 * @public
 */
export type CustomFieldExtensionSchema = {
  returnValue: JSONSchema7;
  uiOptions?: JSONSchema7;
};

/**
 * Type for the Custom Field Extension with the
 * name and components and validation function.
 *
 * @public
 */
export type FieldExtensionOptions<
  TFieldReturnValue = unknown,
  TInputProps = unknown,
> = {
  name: string;
  component: (
    props: FieldExtensionComponentProps<TFieldReturnValue, TInputProps>,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<TFieldReturnValue>;
  schema?: CustomFieldExtensionSchema;
};

/**
 * Type for field extensions and being able to type
 * incoming props easier.
 *
 * @public
 */
export interface FieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions extends {} = {},
> extends FieldProps<TFieldReturnValue> {
  uiSchema: FieldProps['uiSchema'] & {
    'ui:options'?: TUiOptions;
  };
}
