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
  /**
   * All parameter steps, including hidden ones. A field is masked or left out
   * of the review if any of these steps marks it as a password or secret, or
   * sets a review mask for it. Defaults to `schemas`.
   */
  maskSchemas?: ParsedTemplateSchema[];
};

type ReviewOverride = [string, JsonValue | undefined][] | undefined;

function getReviewOverride(
  name: string,
  definition: JsonSchema | undefined,
): ReviewOverride {
  if (!definition) {
    return undefined;
  }
  const reviewOptions = definition['ui:backstage']?.review;
  if (reviewOptions?.mask) {
    return [[name, reviewOptions.mask]];
  }
  if (reviewOptions?.show === false) {
    return [];
  }
  if (
    definition['ui:widget'] === 'password' ||
    definition['ui:field']?.toLowerCase() === 'secret'
  ) {
    return [[name, '******']];
  }
  return undefined;
}

function processSchema(
  key: string,
  value: JsonValue | undefined,
  schema: ParsedTemplateSchema,
  formState: JsonObject,
  maskSchemas: ParsedTemplateSchema[],
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

  const override =
    getReviewOverride(name, definitionInSchema) ??
    maskSchemas
      .filter(other => other !== schema)
      .map(other =>
        getReviewOverride(
          name,
          new JSONSchema(other.mergedSchema).getSchema({
            pointer: `#/${key}`,
            data: formState,
          }),
        ),
      )
      .find(result => result !== undefined);
  if (override) {
    return override;
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
          schema,
          formState,
          maskSchemas,
        ),
      );
    }
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
  const reviewData = Object.fromEntries(
    Object.entries(props.formState)
      .flatMap(([key, value]) => {
        const schema = findSchemaForKey(key, props.schemas, schemaFormState);
        return schema
          ? processSchema(key, value, schema, schemaFormState, maskSchemas)
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
