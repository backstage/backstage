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
import {
  UIOptionsType,
  FieldProps as FieldPropsV5,
  UiSchema as UiSchemaV5,
  FieldValidation as FieldValidationV5,
} from '@rjsf/utils';
import { PropsWithChildren } from 'react';
import { JsonObject } from '@backstage/types';
import { CustomFieldExtensionSchema } from '../../extensions';

/**
 * Type for Field Extension Props for RJSF v5
 *
 * @alpha
 */
export interface NextFieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions = {},
> extends PropsWithChildren<FieldPropsV5<TFieldReturnValue>> {
  uiSchema?: UiSchemaV5<TFieldReturnValue> & {
    'ui:options'?: TUiOptions & UIOptionsType;
  };
}

/**
 * Field validation type for Custom Field Extensions.
 *
 * @alpha
 */
export type NextCustomFieldValidator<TFieldReturnValue> = (
  data: TFieldReturnValue,
  field: FieldValidationV5,
  context: { apiHolder: ApiHolder; formData: JsonObject },
) => void | Promise<void>;

/**
 * Type for the Custom Field Extension with the
 * name and components and validation function.
 *
 * @alpha
 */
export type NextFieldExtensionOptions<
  TFieldReturnValue = unknown,
  TInputProps = unknown,
> = {
  name: string;
  component: (
    props: NextFieldExtensionComponentProps<TFieldReturnValue, TInputProps>,
  ) => JSX.Element | null;
  validation?: NextCustomFieldValidator<TFieldReturnValue>;
  schema?: CustomFieldExtensionSchema;
};
