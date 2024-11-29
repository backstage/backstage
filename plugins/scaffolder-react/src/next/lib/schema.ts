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
import { JsonObject } from '@backstage/types';
import { stringify, parse } from 'flatted';
import { FieldValidation, UiSchema } from '@rjsf/utils';

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractUiSchema(schema: JsonObject, uiSchema: JsonObject) {
  if (!isObject(schema)) {
    return;
  }

  const {
    properties,
    items,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    then,
    else: _else,
  } = schema;

  for (const propName in schema) {
    if (!schema.hasOwnProperty(propName)) {
      continue;
    }

    if (propName.startsWith('ui:')) {
      uiSchema[propName] = schema[propName];
      delete schema[propName];
    }
  }

  if (isObject(properties)) {
    for (const propName in properties) {
      if (!properties.hasOwnProperty(propName)) {
        continue;
      }

      const schemaNode = properties[propName];
      if (!isObject(schemaNode)) {
        continue;
      }

      if (!isObject(uiSchema[propName])) {
        const innerUiSchema = {};
        uiSchema[propName] = innerUiSchema;
      }

      extractUiSchema(schemaNode, uiSchema[propName] as JsonObject);
    }
  }

  if (isObject(items)) {
    const innerUiSchema = {};
    uiSchema.items = innerUiSchema;
    extractUiSchema(items, innerUiSchema);
  }

  if (Array.isArray(anyOf)) {
    for (const schemaNode of anyOf) {
      if (!isObject(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }

  if (Array.isArray(oneOf)) {
    for (const schemaNode of oneOf) {
      if (!isObject(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }

  if (Array.isArray(allOf)) {
    for (const schemaNode of allOf) {
      if (!isObject(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }

  if (isObject(dependencies)) {
    for (const depName of Object.keys(dependencies)) {
      const schemaNode = dependencies[depName];
      if (!isObject(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }

  if (isObject(then)) {
    extractUiSchema(then, uiSchema);
  }

  if (isObject(_else)) {
    extractUiSchema(_else, uiSchema);
  }
}

/**
 * Takes a step from a Backstage Template Manifest and converts it to a JSON Schema and UI Schema for rjsf
 * @alpha
 */
export const extractSchemaFromStep = (
  inputStep: JsonObject,
): { uiSchema: UiSchema; schema: JsonObject } => {
  const uiSchema: UiSchema = {};
  const returnSchema: JsonObject = parse(stringify(inputStep));
  extractUiSchema(returnSchema, uiSchema);
  return { uiSchema, schema: returnSchema };
};

/**
 * Creates a field validation object for use in react jsonschema form
 * @alpha
 */
export const createFieldValidation = (): FieldValidation => {
  const fieldValidation: FieldValidation = {
    __errors: [] as string[],
    addError: (message: string) => {
      fieldValidation.__errors?.push(message);
    },
  };

  return fieldValidation;
};
