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
import { StructuredMetadataTable } from '@backstage/core-components';
import { JsonObject, JsonValue } from '@backstage/types';
import { Draft07 as JSONSchema, JsonSchema } from 'json-schema-library';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { isJsonObject, formatKey, findSchemaForKey } from './util';

/**
 * The props for the {@link ReviewState} component.
 * @alpha
 */
export type ReviewStateProps = {
  schemas: ParsedTemplateSchema[];
  formState: JsonObject;
  /**
   * The complete form state, used to resolve conditional schemas such as
   * `dependencies` so that review masks still apply when `formState` has had
   * values removed. Defaults to `formState`.
   */
  schemaFormState?: JsonObject;
};

type ReviewOverride = { kind: 'hide' } | { kind: 'mask'; value: string };

function getReviewOverride(
  definition: JsonSchema | undefined,
): ReviewOverride | undefined {
  const reviewOptions = definition?.['ui:backstage']?.review;
  if (reviewOptions?.mask) {
    return { kind: 'mask', value: reviewOptions.mask };
  }
  if (reviewOptions?.show === false) {
    return { kind: 'hide' };
  }
  if (
    definition?.['ui:widget'] === 'password' ||
    definition?.['ui:field']?.toLowerCase() === 'secret'
  ) {
    return { kind: 'mask', value: '******' };
  }
  return undefined;
}

/**
 * Applies review masks and `show: false` to the items and fields nested in
 * an array or unexploded object, as these are rendered as a single value.
 */
function maskNestedValue(
  key: string,
  value: JsonValue,
  parsedSchema: JSONSchema,
  formState: JsonObject,
): JsonValue {
  const maskChild = (
    pointer: string,
    child: JsonValue,
  ): JsonValue | undefined => {
    const override = getReviewOverride(
      parsedSchema.getSchema({ pointer: `#/${pointer}`, data: formState }),
    );
    if (override?.kind === 'hide') {
      return undefined;
    }
    if (override?.kind === 'mask') {
      return override.value;
    }
    return maskNestedValue(pointer, child, parsedSchema, formState);
  };

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const masked = maskChild(`${key}/${index}`, item);
      return masked === undefined ? [] : [masked];
    });
  }

  if (!isJsonObject(value)) {
    return value;
  }

  const result: JsonObject = {};
  for (const [nestedKey, nestedValue] of Object.entries(value)) {
    if (nestedValue === undefined) {
      continue;
    }
    const masked = maskChild(`${key}/${nestedKey}`, nestedValue);
    if (masked !== undefined) {
      result[nestedKey] = masked;
    }
  }
  return result;
}

function processSchema(
  key: string,
  value: JsonValue | undefined,
  schema: ParsedTemplateSchema,
  formState: JsonObject,
): [string, JsonValue | undefined][] {
  const parsedSchema = new JSONSchema(schema.mergedSchema);
  const definitionInSchema = parsedSchema.getSchema({
    pointer: `#/${key}`,
    data: formState,
  });

  const name =
    definitionInSchema?.['ui:backstage']?.review?.name ??
    definitionInSchema?.title ??
    formatKey(key);

  if (definitionInSchema) {
    const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;
    const override = getReviewOverride(definitionInSchema);
    if (override?.kind === 'mask') {
      return [[name, override.value]];
    }
    if (override?.kind === 'hide') {
      return [];
    }

    if (definitionInSchema.enum && definitionInSchema.enumNames) {
      return [
        [
          name,
          definitionInSchema.enumNames[
            definitionInSchema.enum.indexOf(value)
          ] || value,
        ],
      ];
    }

    if (backstageReviewOptions?.explode !== false && isJsonObject(value)) {
      // Recurse nested objects
      return Object.entries(value).flatMap(([nestedKey, nestedValue]) =>
        processSchema(`${key}/${nestedKey}`, nestedValue, schema, formState),
      );
    }
  }

  if (Array.isArray(value) || isJsonObject(value)) {
    return [[name, maskNestedValue(key, value, parsedSchema, formState)]];
  }

  return [[name, value]];
}

/**
 * The component used by the {@link Stepper} to render the review step.
 * @alpha
 */
export const ReviewState = (props: ReviewStateProps) => {
  const schemaFormState = props.schemaFormState ?? props.formState;
  const reviewData = Object.fromEntries(
    Object.entries(props.formState)
      .flatMap(([key, value]) => {
        const schema = findSchemaForKey(key, props.schemas, schemaFormState);
        return schema
          ? processSchema(key, value, schema, schemaFormState)
          : [[formatKey(key), value]];
      })
      .filter(prop => prop.length > 0),
  );
  return (
    <StructuredMetadataTable
      metadata={reviewData}
      options={{ titleFormat: key => key }}
    />
  );
};
