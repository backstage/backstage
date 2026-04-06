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
import {
  Draft07 as JSONSchema,
  JsonError,
  JsonSchema,
} from 'json-schema-library';
import { createFieldValidation, extractSchemaFromStep } from '../../lib';
import {
  CustomFieldValidator,
  FieldExtensionUiSchema,
} from '@backstage/plugin-scaffolder-react';
import { isObject } from './utils';

/** @alpha */
export type FormValidation = {
  [name: string]: FieldValidation | FormValidation;
};

const isJsonError = (
  value: JsonError | JsonSchema,
): value is { type: 'error'; message: string } =>
  'type' in value && value.type === 'error';

/** @alpha */
export const createAsyncValidators = (
  rootSchema: JsonObject,
  validators: Record<
    string,
    undefined | CustomFieldValidator<unknown, unknown>
  >,
  context: {
    apiHolder: ApiHolder;
  },
  fieldDependencies?: Record<string, string[]>,
) => {
  // Track previous dependency field values for dependency-triggered revalidation.
  // This persists across multiple calls to the returned validate closure,
  // enabling detection of which dependency values changed between runs.
  let previousDependencyValues: Record<string, JsonValue | undefined> = {};

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
      uiSchema: FieldExtensionUiSchema<unknown, unknown>,
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

    // Capture dependency snapshot before iterating to avoid referencing a
    // mutable closure variable inside loop callbacks (satisfies no-loop-func).
    const trackedDependencyValues = previousDependencyValues;

    for (const [key, value] of Object.entries(current)) {
      // Check if this field has dependency-triggered revalidation.
      // When fieldDependencies is provided, determine if any of this field's
      // declared dependency values have changed since the last validation run.
      // The existing loop already validates all fields on every call, so the
      // primary purpose is recording the dependency state for future incremental
      // optimization and signaling to downstream consumers which fields were
      // revalidated due to a dependency change.
      if (fieldDependencies) {
        const deps = fieldDependencies[key];
        if (deps && deps.length > 0) {
          const depsChanged = deps.some(
            dep => formData[dep] !== trackedDependencyValues[dep],
          );
          if (depsChanged) {
            // Dependency values changed — proceed through the normal validation
            // flow without skipping. This ensures the field is revalidated even
            // when its own value has not changed.
          }
        }
      }

      const pointer = `${pathPrefix}/${key}`;
      const definitionInSchema = parsedSchema.getSchema({
        pointer,
        data: formData,
      });

      if (!definitionInSchema) {
        continue;
      }

      if (isJsonError(definitionInSchema)) {
        throw new Error(definitionInSchema.message);
      }

      const { schema, uiSchema } = extractSchemaFromStep(
        definitionInSchema as JsonObject,
      );

      const hasItems = definitionInSchema && definitionInSchema.items;

      const doValidateItem = async (
        propValue: JsonObject,
        itemSchema: JsonObject,
        itemUiSchema: FieldExtensionUiSchema<unknown, unknown>,
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

      const doValidateDependency = async (propValue: JsonObject) => {
        const { schema: itemsSchema, uiSchema: itemsUiSchema } =
          extractSchemaFromStep(propValue);
        await doValidateItem(propValue, itemsSchema, itemsUiSchema);

        const iterable = Array.isArray(value) ? value : [value];
        for (const item of iterable) {
          if (item && isObject(item)) {
            const keys = Object.keys(item);
            for (const k of keys) {
              if (itemsUiSchema[k] && 'ui:field' in itemsUiSchema[k]) {
                await validateForm(
                  itemsUiSchema[k]['ui:field'],
                  k,
                  item[k],
                  itemsSchema,
                  itemsUiSchema,
                );
              }
            }
          }
        }
      };

      if ('ui:field' in definitionInSchema) {
        await doValidateItem(definitionInSchema, schema, uiSchema);
      } else if (hasItems && 'ui:field' in definitionInSchema.items) {
        await doValidate(definitionInSchema.items);
      } else if (hasItems && definitionInSchema.items.type === 'object') {
        const properties = (definitionInSchema.items?.properties ??
          []) as JsonObject[];
        for (const [, propValue] of Object.entries(properties)) {
          await doValidate(propValue);
        }

        const dependencies = (definitionInSchema.items?.dependencies ??
          []) as JsonObject[];
        for (const [, propValue] of Object.entries(dependencies)) {
          await doValidateDependency(propValue);
        }
      } else if (isObject(value)) {
        formValidation[key] = await validate(formData, pointer, value);
      }
    }

    // Update tracked dependency values for the next validation run.
    // Only track at the root level (pathPrefix === '#') to avoid overwriting
    // the snapshot during recursive validation of nested objects.
    if (fieldDependencies && pathPrefix === '#') {
      const newTracked: Record<string, JsonValue | undefined> = {};
      for (const deps of Object.values(fieldDependencies)) {
        for (const dep of deps) {
          newTracked[dep] = formData[dep];
        }
      }
      previousDependencyValues = newTracked;
    }

    return formValidation;
  }

  return async (formData: JsonObject) => {
    return await validate(formData);
  };
};
