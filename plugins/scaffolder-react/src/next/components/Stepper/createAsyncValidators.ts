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
import { JsonObject } from '@backstage/types';
import { ApiHolder } from '@backstage/core-plugin-api';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { createFieldValidation } from '../../lib';
import { NextCustomFieldValidator } from '../../extensions';

export const createAsyncValidators = (
  rootSchema: JsonObject,
  validators: Record<string, undefined | NextCustomFieldValidator<unknown>>,
  context: {
    apiHolder: ApiHolder;
  },
) => {
  async function validate(formData: JsonObject, pathPrefix: string = '#') {
    const parsedSchema = new JSONSchema(rootSchema);
    const formValidation: Record<string, FieldValidation> = {};
    for (const [key, value] of Object.entries(formData)) {
      const definitionInSchema = parsedSchema.getSchema(
        `${pathPrefix}/${key}`,
        formData,
      );

      if (definitionInSchema && 'ui:field' in definitionInSchema) {
        const validator = validators[definitionInSchema['ui:field']];
        if (validator) {
          const fieldValidation = createFieldValidation();
          try {
            await validator(value, fieldValidation, { ...context, formData });
          } catch (ex) {
            fieldValidation.addError(ex.message);
          }
          formValidation[key] = fieldValidation;
        }
      }
    }

    return formValidation;
  }

  return async (formData: JsonObject) => {
    return await validate(formData);
  };
};
