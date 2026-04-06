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
import { UiSchema, UIOptionsType, FieldValidation } from '@rjsf/utils';
import { ScaffolderRJSFFieldProps } from './rjsf';

/**
 * Type for Field Extension Props for RJSF v5
 *
 * @public
 */
export interface FieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions = {},
> extends PropsWithChildren<ScaffolderRJSFFieldProps<TFieldReturnValue>> {
  uiSchema: FieldExtensionUiSchema<TFieldReturnValue, TUiOptions>;
}

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
 * Type for the Custom Field Extension with the
 * name, component, validation function, and optional support for
 * cascading/dynamic form behavior via `dependencies` and `optionsLoader`.
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
  /**
   * An optional list of sibling field names that this field extension watches
   * for changes. When any of the listed fields change value, the field's
   * `optionsLoader` (if provided) will be re-invoked to fetch updated options.
   *
   * @example
   * ```ts
   * dependencies: ['cloudProvider']
   * ```
   */
  dependencies?: string[];
  /**
   * An optional async function that fetches dynamic options for this field
   * based on the current form data. It is called whenever a field listed in
   * `dependencies` changes value, after a configurable debounce period
   * (default 300ms).
   *
   * The function receives the full form data and a context object containing
   * the Backstage `ApiHolder`, enabling data retrieval from catalog, custom
   * backends, or other Backstage APIs.
   *
   * @example
   * ```ts
   * optionsLoader: async (formData, { apiHolder }) => {
   *   const catalogApi = apiHolder.get(catalogApiRef);
   *   const entities = await catalogApi.getEntities({ filter: { kind: 'Component' } });
   *   return entities.items.map(e => ({ label: e.metadata.name, value: e.metadata.name }));
   * }
   * ```
   */
  optionsLoader?: (
    formData: JsonObject,
    context: { apiHolder: ApiHolder },
  ) => Promise<Array<{ label: string; value: string | number }>>;
};
