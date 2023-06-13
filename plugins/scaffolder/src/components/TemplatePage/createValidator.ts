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

import { CustomFieldValidator } from '@backstage/plugin-scaffolder-react';
import { FormValidation } from '@rjsf/utils';
import { JsonObject, JsonValue } from '@backstage/types';
import { ApiHolder } from '@backstage/core-plugin-api';

function isObject(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function isArray(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && Array.isArray(obj);
}

export const createValidator = (
  rootSchema: JsonObject,
  validators: Record<string, undefined | CustomFieldValidator<unknown>>,
  context: {
    apiHolder: ApiHolder;
  },
) => {
  function validate(
    schema: JsonObject,
    formData: JsonObject,
    errors: FormValidation,
  ) {
    const schemaProps = schema.properties;
    const customObject = schema.type === 'object' && schemaProps === undefined;

    if (!isObject(schemaProps) && !customObject) {
      return;
    }

    if (schemaProps) {
      for (const [key, propData] of Object.entries(formData)) {
        const propValidation = errors[key]!;

        const doValidate = (item: JsonValue | undefined) => {
          if (item && isObject(item)) {
            const fieldName = item['ui:field'] as string;
            if (fieldName && typeof validators[fieldName] === 'function') {
              validators[fieldName]!(propData, propValidation, context);
            }
          }
        };

        const propSchemaProps = schemaProps[key];
        if (isObject(propData) && isObject(propSchemaProps)) {
          validate(propSchemaProps, propData, propValidation);
        } else if (isArray(propData)) {
          if (isObject(propSchemaProps)) {
            const { items } = propSchemaProps;
            if (isObject(items)) {
              if (items.type === 'object') {
                const properties = (items?.properties ?? []) as JsonObject[];
                for (const [, value] of Object.entries(properties)) {
                  doValidate(value);
                }
              } else {
                doValidate(items);
              }
            }
          }
        } else {
          doValidate(propSchemaProps);
        }
      }
    } else if (customObject) {
      const fieldName = schema['ui:field'] as string;
      if (fieldName && typeof validators[fieldName] === 'function') {
        validators[fieldName]!(formData, errors, context);
      }
    }
  }

  return (formData: JsonObject, errors: FormValidation) => {
    validate(rootSchema, formData, errors);
    return errors;
  };
};
