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
import { ReviewStateContent, ReviewItem } from './ReviewStateContent';
import { JsonObject, JsonValue } from '@backstage/types';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import {
  isJsonObject,
  formatKey,
  findSchemaForKey,
  escapePointerSegment,
} from './util';

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
): ReviewItem[] {
  const parsedSchema = new JSONSchema(schema.mergedSchema);
  const definitionInSchema = parsedSchema.getSchema({
    pointer: `#/${key}`,
    data: formState,
  });

  const name =
    definitionInSchema?.['ui:backstage']?.review?.name ??
    definitionInSchema?.title ??
    formatKey(key.replace(/~1/g, '/').replace(/~0/g, '~'));

  const item = (
    displayValue: JsonValue | undefined,
    masked = false,
  ): ReviewItem => ({
    path: `/${key}`,
    label: name,
    // Detach objects and arrays from the state used by submission.
    displayValue:
      displayValue === undefined
        ? undefined
        : JSON.parse(JSON.stringify(displayValue)),
    presentation: masked ? 'masked' : 'value',
    fieldType: masked ? undefined : definitionInSchema?.['ui:field'],
  });

  if (definitionInSchema) {
    const backstageReviewOptions = definitionInSchema['ui:backstage']?.review;
    if (backstageReviewOptions) {
      if (backstageReviewOptions.mask) {
        return [item(backstageReviewOptions.mask, true)];
      }
      if (backstageReviewOptions.show === false) {
        return [];
      }
    }

    if (
      definitionInSchema['ui:widget'] === 'password' ||
      definitionInSchema['ui:field']?.toLowerCase() === 'secret'
    ) {
      return [item('******', true)];
    }

    if (definitionInSchema.enum && definitionInSchema.enumNames) {
      return [
        item(
          definitionInSchema.enumNames[
            definitionInSchema.enum.indexOf(value)
          ] || value,
        ),
      ];
    }

    if (backstageReviewOptions?.explode !== false && isJsonObject(value)) {
      // Recurse nested objects
      return Object.entries(value).flatMap(([nestedKey, nestedValue]) =>
        processSchema(
          `${key}/${escapePointerSegment(nestedKey)}`,
          nestedValue,
          schema,
          formState,
        ),
      );
    }
  }

  return [item(value)];
}

/**
 * The component used by the {@link Stepper} to render the review step.
 * @alpha
 */
export const ReviewState = (props: ReviewStateProps) => {
  const items: ReviewItem[] = Object.entries(props.formState).flatMap(
    ([key, value]) => {
      const schema = findSchemaForKey(key, props.schemas, props.formState);
      return schema
        ? processSchema(
            escapePointerSegment(key),
            value,
            schema,
            props.formState,
          )
        : [
            {
              path: `/${escapePointerSegment(key)}`,
              label: formatKey(key),
              displayValue:
                value === undefined
                  ? undefined
                  : JSON.parse(JSON.stringify(value)),
              presentation: 'value' as const,
            },
          ];
    },
  );
  return <ReviewStateContent items={items} />;
};
