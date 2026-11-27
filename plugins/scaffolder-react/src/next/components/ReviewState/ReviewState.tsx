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
import { useMemo } from 'react';
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
  /**
   * All parameter steps, including hidden ones. A field is masked on review
   * if any of these steps marks it as a password or secret, or sets a review
   * mask for it. Defaults to `schemas`.
   */
  maskSchemas?: Pick<ParsedTemplateSchema, 'mergedSchema'>[];
};

type MaskSchema = Pick<ParsedTemplateSchema, 'mergedSchema'>;

type CompiledStep = { source: MaskSchema; parsed: JSONSchema };

type ReviewOverride = { kind: 'hide' } | { kind: 'mask'; value: string };

function getReviewOverride(
  definition: JsonSchema | undefined,
  allowHide: boolean = true,
): ReviewOverride | undefined {
  const reviewOptions = definition?.['ui:backstage']?.review;
  if (reviewOptions?.mask) {
    return { kind: 'mask', value: reviewOptions.mask };
  }
  if (allowHide && reviewOptions?.show === false) {
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
 * Finds the review override for a field. The step that shows the field can
 * mask or hide it, and any other step can mask it.
 */
function findOverride(
  pointer: string,
  ownStep: CompiledStep | undefined,
  steps: CompiledStep[],
  formState: JsonObject,
): ReviewOverride | undefined {
  const ownOverride = getReviewOverride(
    ownStep?.parsed.getSchema({ pointer: `#/${pointer}`, data: formState }),
  );
  if (ownOverride) {
    return ownOverride;
  }
  for (const step of steps) {
    if (step === ownStep) {
      continue;
    }
    // Only masks apply across steps, another step can't hide a field. Hiding
    // is skipped here so that a secret that is also hidden is still masked.
    const override = getReviewOverride(
      step.parsed.getSchema({ pointer: `#/${pointer}`, data: formState }),
      false,
    );
    if (override) {
      return override;
    }
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
  ownStep: CompiledStep | undefined,
  steps: CompiledStep[],
  formState: JsonObject,
): JsonValue {
  const maskChild = (
    pointer: string,
    child: JsonValue,
  ): JsonValue | undefined => {
    const override = findOverride(pointer, ownStep, steps, formState);
    if (override?.kind === 'hide') {
      return undefined;
    }
    if (override?.kind === 'mask') {
      return override.value;
    }
    return maskNestedValue(pointer, child, ownStep, steps, formState);
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
  ownStep: CompiledStep,
  steps: CompiledStep[],
  formState: JsonObject,
): [string, JsonValue | undefined][] {
  const definitionInSchema = ownStep.parsed.getSchema({
    pointer: `#/${key}`,
    data: formState,
  });

  const name =
    definitionInSchema?.['ui:backstage']?.review?.name ??
    definitionInSchema?.title ??
    formatKey(key);

  const override = findOverride(key, ownStep, steps, formState);
  if (override?.kind === 'mask') {
    return [[name, override.value]];
  }
  if (override?.kind === 'hide') {
    return [];
  }

  if (definitionInSchema) {
    const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;

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
        processSchema(
          `${key}/${nestedKey}`,
          nestedValue,
          ownStep,
          steps,
          formState,
        ),
      );
    }
  }

  if (Array.isArray(value) || isJsonObject(value)) {
    return [[name, maskNestedValue(key, value, ownStep, steps, formState)]];
  }

  return [[name, value]];
}

/**
 * The component used by the {@link Stepper} to render the review step.
 * @alpha
 */
export const ReviewState = (props: ReviewStateProps) => {
  const schemaFormState = props.schemaFormState ?? props.formState;
  const maskSchemas = props.maskSchemas ?? props.schemas;
  const steps = useMemo(
    () =>
      maskSchemas.map(source => ({
        source,
        parsed: new JSONSchema(source.mergedSchema),
      })),
    [maskSchemas],
  );
  const reviewData = Object.fromEntries(
    Object.entries(props.formState)
      .flatMap(([key, value]): [string, JsonValue | undefined][] => {
        const schema = findSchemaForKey(key, props.schemas, schemaFormState);
        if (schema) {
          const ownStep = steps.find(step => step.source === schema) ?? {
            source: schema,
            parsed: new JSONSchema(schema.mergedSchema),
          };
          return processSchema(key, value, ownStep, steps, schemaFormState);
        }
        const override = findOverride(key, undefined, steps, schemaFormState);
        if (override?.kind === 'mask') {
          return [[formatKey(key), override.value]];
        }
        return [
          [
            formatKey(key),
            value === undefined
              ? value
              : maskNestedValue(key, value, undefined, steps, schemaFormState),
          ],
        ];
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
