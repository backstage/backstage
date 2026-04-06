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
import { JsonObject, JsonValue } from '@backstage/types';
import { stringify, parse } from 'flatted';
import { FieldValidation, UiSchema } from '@rjsf/utils';
import { Draft07 as JSONSchema } from 'json-schema-library';

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

/**
 * Evaluates a JSON Schema `if` condition against form data using
 * json-schema-library Draft07 validation. Returns true when the
 * form data satisfies the condition schema (zero validation errors).
 */
function evaluateCondition(
  ifSchema: JsonObject,
  formData: JsonObject,
): boolean {
  try {
    const jsonSchema = new JSONSchema(ifSchema);
    const errors = jsonSchema.validate(formData);
    return errors.length === 0;
  } catch {
    // If the condition schema is malformed, treat the condition as not met
    return false;
  }
}

/**
 * Merges `properties` and `required` from a source conditional branch
 * schema into a target schema. Only NEW properties (those not already
 * present in the target) are added. Existing target properties are
 * preserved to avoid overwriting base definitions with discriminator
 * constraints from oneOf/dependencies branches (e.g., a narrow enum
 * in a oneOf branch should not replace the full enum in the base).
 * Required entries are deduplicated.
 */
function mergeSchemaInto(target: JsonObject, source: JsonObject): void {
  // Merge properties — only add new properties from the source branch.
  // Existing properties in the target (base schema) are preserved so that
  // discriminator constraints from dependencies.oneOf branches do not
  // replace base property definitions (title, full enum, type, etc.).
  if (isObject(source.properties)) {
    if (!isObject(target.properties)) {
      target.properties = {};
    }
    const targetProps = target.properties as JsonObject;
    const sourceProps = source.properties as JsonObject;
    for (const [key, value] of Object.entries(sourceProps)) {
      if (!(key in targetProps)) {
        targetProps[key] = value;
      }
    }
  }

  // Merge required arrays
  if (Array.isArray(source.required)) {
    if (!Array.isArray(target.required)) {
      target.required = [];
    }
    const targetRequired = target.required as string[];
    for (const req of source.required as string[]) {
      if (!targetRequired.includes(req)) {
        targetRequired.push(req);
      }
    }
  }
}

/**
 * Finds the first `oneOf` branch whose schema validates against the
 * provided form data. Returns the matching branch or undefined when
 * no branch matches.
 */
function findMatchingOneOfBranch(
  branches: JsonObject[],
  formData: JsonObject,
): JsonObject | undefined {
  for (const branch of branches) {
    if (!isObject(branch)) continue;
    try {
      const branchSchema = new JSONSchema(branch as JsonObject);
      const errors = branchSchema.validate(formData);
      if (errors.length === 0) {
        return branch;
      }
    } catch {
      // Skip malformed branches
      continue;
    }
  }
  return undefined;
}

/**
 * Resolves conditional JSON Schema keywords (if/then/else, dependencies) against
 * the current form data, returning a schema with only the active conditional
 * branches merged in. This enables reactive field rendering where the schema
 * passed to RJSF reflects the currently active conditions.
 *
 * This function is pure and synchronous — it performs no side effects and
 * produces no async operations. It complements RJSF's built-in conditional
 * evaluation by pre-resolving the schema for display purposes.
 *
 * @alpha
 */
export const resolveConditionalSchema = (
  schema: JsonObject,
  formData: JsonObject,
): JsonObject => {
  // Deep clone to avoid mutating the input
  const resolved: JsonObject = JSON.parse(JSON.stringify(schema));

  // Process allOf entries that contain conditional keywords (common RJSF pattern).
  // Non-conditional allOf entries are preserved for RJSF to handle natively.
  if (Array.isArray(resolved.allOf)) {
    const remainingAllOf: JsonValue[] = [];
    for (const entry of resolved.allOf) {
      if (isObject(entry)) {
        const entryObj = entry as JsonObject;
        // Resolve allOf entries that carry conditional keywords
        if (entryObj.if || entryObj.dependencies) {
          const resolvedEntry = resolveConditionalSchema(entryObj, formData);
          mergeSchemaInto(resolved, resolvedEntry);
        } else {
          // Keep non-conditional entries intact for RJSF
          remainingAllOf.push(entry);
        }
      } else {
        remainingAllOf.push(entry);
      }
    }
    if (remainingAllOf.length > 0) {
      resolved.allOf = remainingAllOf;
    } else {
      delete resolved.allOf;
    }
  }

  // Process if/then/else at the top level
  if (isObject(resolved.if) && (resolved.then || resolved.else)) {
    const ifSchema = resolved.if as JsonObject;
    const conditionMet = evaluateCondition(ifSchema, formData);

    if (conditionMet && isObject(resolved.then)) {
      mergeSchemaInto(resolved, resolved.then as JsonObject);
    } else if (!conditionMet && isObject(resolved.else)) {
      mergeSchemaInto(resolved, resolved.else as JsonObject);
    }

    // Clean up conditional keywords after resolution
    delete resolved.if;
    delete resolved.then;
    delete resolved.else;
  }

  // Process dependencies keyword
  if (isObject(resolved.dependencies)) {
    const deps = resolved.dependencies as Record<string, unknown>;
    for (const [depKey, depSchema] of Object.entries(deps)) {
      if (depKey in formData && formData[depKey] !== undefined) {
        if (isObject(depSchema)) {
          const depObj = depSchema as JsonObject;
          // Handle oneOf-style schema dependencies
          if (Array.isArray(depObj.oneOf)) {
            const matchingBranch = findMatchingOneOfBranch(
              depObj.oneOf as JsonObject[],
              formData,
            );
            if (matchingBranch) {
              mergeSchemaInto(resolved, matchingBranch);
            }
          } else {
            // Simple schema dependency — merge directly
            mergeSchemaInto(resolved, depObj);
          }
        }
        // Property-array dependencies (e.g., { "a": ["b","c"] }) are not
        // structural schema changes — they only affect required fields.
        // RJSF handles these natively, so we skip them here.
      }
    }
    delete resolved.dependencies;
  }

  // Process top-level oneOf for discriminated unions
  if (Array.isArray(resolved.oneOf)) {
    const matchingBranch = findMatchingOneOfBranch(
      resolved.oneOf as JsonObject[],
      formData,
    );
    if (matchingBranch) {
      mergeSchemaInto(resolved, matchingBranch);
      delete resolved.oneOf;
    }
    // Keep oneOf if no match found — let RJSF handle it
  }

  return resolved;
};
