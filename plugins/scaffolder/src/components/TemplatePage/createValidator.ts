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

import { CustomFieldValidator } from '../../extensions';
import { FormValidation } from '@rjsf/core';
import { JsonObject } from '@backstage/types';
import { ApiHolder } from '@backstage/core-plugin-api';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { utils } from '@rjsf/core';

export const createValidator = (
  rootSchema: JsonObject,
  validators: Record<string, undefined | CustomFieldValidator<unknown>>,
  context: {
    apiHolder: ApiHolder;
  },
) => {
  function validate(formData: JsonObject, errors: FormValidation) {
    const parsedSchema = new JSONSchema(
      utils.retrieveSchema(rootSchema, {}, formData),
    );
    for (const [key, value] of Object.entries(formData)) {
      const definitionInSchema = parsedSchema.getSchema(`#/${key}`, formData);
      if (definitionInSchema && 'ui:field' in definitionInSchema) {
        const validator = validators[definitionInSchema['ui:field']];
        if (validator) {
          validator(value, errors[key] ?? errors, context);
        }
      }
    }
  }

  return (formData: JsonObject, errors: FormValidation) => {
    validate(formData, errors);
    return errors;
  };
};
