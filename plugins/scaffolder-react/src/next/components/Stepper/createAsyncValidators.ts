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

import { FieldValidation } from '@rjsf/utils';
import type { JsonObject, JsonValue } from '@backstage/types';
import { ApiHolder } from '@backstage/core-plugin-api';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { createFieldValidation, extractSchemaFromStep } from '../../lib';
import { NextCustomFieldValidator } from '../../../extensions';
import { isObject } from './utils';
import { NextFieldExtensionUiSchema } from '../../extensions/types';

/**
 * @internal
 */
export type FormValidation = {
  [name: string]: FieldValidation | FormValidation;
};

export const createAsyncValidators = (
  rootSchema: JsonObject,
  validators: Record<
    string,
    undefined | NextCustomFieldValidator<unknown, unknown>
  >,
  context: {
    apiHolder: ApiHolder;
  },
) => {
  async function validate(
    formData: JsonObject,
    pathPrefix: string = '#',
    current: JsonObject = formData,
  ): Promise<FormValidation> {
    const parsedSchema = new JSONSchema(rootSchema);
    const formValidation: FormValidation = {};

    const validateForm = async (
      validatorName: string,
      key: string,
      value: JsonValue | undefined,
      schema: JsonObject,
      uiSchema: NextFieldExtensionUiSchema<unknown, unknown>,
    ) => {
      const validator = validators[validatorName];
      if (validator) {
        const fieldValidation = createFieldValidation();
        try {
          await validator(value, fieldValidation, {
            ...context,
            formData,
            schema,
            uiSchema,
          });
        } catch (ex) {
          fieldValidation.addError(ex.message);
        }
        formValidation[key] = fieldValidation;
      }
    };

    for (const [key, value] of Object.entries(current)) {
      const path = `${pathPrefix}/${key}`;
      const definitionInSchema = parsedSchema.getSchema(path, formData);
      const { schema, uiSchema } = extractSchemaFromStep(definitionInSchema);

      const hasItems = definitionInSchema && definitionInSchema.items;

      const doValidateItem = async (
        propValue: JsonObject,
        itemSchema: JsonObject,
        itemUiSchema: NextFieldExtensionUiSchema<unknown, unknown>,
      ) => {
        await validateForm(
          propValue['ui:field'] as string,
          key,
          value,
          itemSchema,
          itemUiSchema,
        );
      };

      const doValidate = async (propValue: JsonObject) => {
        if ('ui:field' in propValue) {
          const { schema: itemsSchema, uiSchema: itemsUiSchema } =
            extractSchemaFromStep(definitionInSchema.items);
          await doValidateItem(propValue, itemsSchema, itemsUiSchema);
        }
      };

      if (definitionInSchema && 'ui:field' in definitionInSchema) {
        await doValidateItem(definitionInSchema, schema, uiSchema);
      } else if (hasItems && 'ui:field' in definitionInSchema.items) {
        await doValidate(definitionInSchema.items);
      } else if (hasItems && definitionInSchema.items.type === 'object') {
        const properties = (definitionInSchema.items?.properties ??
          []) as JsonObject[];
        for (const [, propValue] of Object.entries(properties)) {
          await doValidate(propValue);
        }
      } else if (isObject(value)) {
        formValidation[key] = await validate(formData, path, value);
      }
    }

    return formValidation;
  }

  return async (formData: JsonObject) => {
    return await validate(formData);
  };
};
