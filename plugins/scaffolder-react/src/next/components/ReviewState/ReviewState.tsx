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
import React from 'react';
import { StructuredMetadataTable } from '@backstage/core-components';
import { JsonObject, JsonValue } from '@backstage/types';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { isJsonObject, formatKey } from './util';

/**
 * The props for the {@link ReviewState} component.
 * @alpha
 */
export type ReviewStateProps = {
  schemas: ParsedTemplateSchema[];
  formState: JsonObject;
};

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

  if (definitionInSchema) {
    const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;
    if (backstageReviewOptions) {
      if (backstageReviewOptions.mask) {
        return [[key, backstageReviewOptions.mask]];
      }
      if (backstageReviewOptions.show === false) {
        return [];
      }
    }

    if (
      definitionInSchema['ui:widget'] === 'password' ||
      definitionInSchema['ui:field']?.toLocaleLowerCase('en-us') === 'secret'
    ) {
      return [[key, '******']];
    }

    if (definitionInSchema.enum && definitionInSchema.enumNames) {
      return [
        [
          key,
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

  return [[key, value]];
}

/**
 * The component used by the {@link Stepper} to render the review step.
 * @alpha
 */
export const ReviewState = (props: ReviewStateProps) => {
  const reviewData = Object.fromEntries(
    Object.entries(props.formState)
      .flatMap(([key, value]) => {
        for (const step of props.schemas) {
          return processSchema(key, value, step, props.formState);
        }
        return [[key, value]];
      })
      .filter(prop => prop.length > 0),
  );
  const options = {
    titleFormat: formatKey,
  };
  return <StructuredMetadataTable metadata={reviewData} options={options} />;
};
