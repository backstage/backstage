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
import { PropsWithChildren } from 'react';
import { JsonObject } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import {
  ErrorSchema,
  FormContextType,
  GenericObjectType,
  IdSchema,
  Registry,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
  UIOptionsType,
  FieldValidation,
} from '@rjsf/utils';
import { HTMLAttributes } from 'react';

/**
 * The type used to wrap up the Layout and embed the input props
 *
 * @public
 */
export type FieldExtensionComponent<_TReturnValue, _TInputProps> = () => null;

/**
 * Type for Field Extension Props for RJSF v5
 *
 * @public
 */
export interface FieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions = {},
> extends PropsWithChildren<
    ScaffolderCustomFieldExtensionProps<TFieldReturnValue>
  > {
  uiSchema: FieldExtensionUiSchema<TFieldReturnValue, TUiOptions>;
}

/**
 * Type for Field Extension UiSchema
 *
 * @public
 */
export interface FieldExtensionUiSchema<TFieldReturnValue, TUiOptions>
  extends UiSchema<TFieldReturnValue> {
  'ui:options'?: TUiOptions & UIOptionsType<TFieldReturnValue>;
}

/**
 * Field validation type for Custom Field Extensions.
 *
 * @public
 */
export type CustomFieldValidator<TFieldReturnValue, TUiOptions = unknown> = (
  data: TFieldReturnValue,
  field: FieldValidation,
  context: {
    apiHolder: ApiHolder;
    formData: JsonObject;
    schema: JsonObject;
    uiSchema?: FieldExtensionUiSchema<TFieldReturnValue, TUiOptions>;
  },
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
  TUiOptions = unknown,
> = {
  name: string;
  component: (
    props: FieldExtensionComponentProps<TFieldReturnValue, TUiOptions>,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<TFieldReturnValue, TUiOptions>;
  schema?: CustomFieldExtensionSchema;
};

/**
 * This is a type designed to help with the publically exposed definitions
 * of RJSF, and to help us ship a stable API without depending directly too much on the RJSF types.
 * This might need some more copy paste from RJSF, but for now this works.
 */
export interface ScaffolderCustomFieldExtensionProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
> extends GenericObjectType,
    Pick<
      HTMLAttributes<HTMLElement>,
      Exclude<
        keyof HTMLAttributes<HTMLElement>,
        'onBlur' | 'onFocus' | 'onChange'
      >
    > {
  /** The JSON subschema object for this field */
  schema: S;
  /** The uiSchema for this field */
  uiSchema: UiSchema<T, S, F>;
  /** The tree of unique ids for every child field */
  idSchema: IdSchema<T>;
  /** The data for this field */
  formData: T;
  /** The tree of errors for this field and its children */
  errorSchema?: ErrorSchema<T>;
  /** The field change event handler; called with the updated form data and an optional `ErrorSchema` */
  onChange: (
    newFormData: T | undefined,
    es?: ErrorSchema<T>,
    id?: string,
  ) => any;
  /** The input blur event handler; call it with the field id and value */
  onBlur: (id: string, value: any) => void;
  /** The input focus event handler; call it with the field id and value */
  onFocus: (id: string, value: any) => void;
  /** The `formContext` object that you passed to `Form` */
  formContext?: F;
  /** A boolean value stating if the field should autofocus */
  autofocus?: boolean;
  /** A boolean value stating if the field is disabled */
  disabled: boolean;
  /** A boolean value stating if the field is hiding its errors */
  hideError?: boolean;
  /** A boolean value stating if the field is read-only */
  readonly: boolean;
  /** The required status of this field */
  required?: boolean;
  /** The unique name of the field, usually derived from the name of the property in the JSONSchema */
  name: string;
  /** To avoid collisions with existing ids in the DOM, it is possible to change the prefix used for ids;
   * Default is `root`
   */
  idPrefix?: string;
  /** To avoid using a path separator that is present in field names, it is possible to change the separator used for
   * ids (Default is `_`)
   */
  idSeparator?: string;
  /** An array of strings listing all generated error messages from encountered errors for this field */
  rawErrors: string[];
  /** The `registry` object */
  registry: Registry<T, S, F>;
}
