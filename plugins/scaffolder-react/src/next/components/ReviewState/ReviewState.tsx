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
import { JsonObject } from '@backstage/types';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

/**
 * The props for the {@link ReviewState} component.
 * @alpha
 */
export type ReviewStateProps = {
  schemas: ParsedTemplateSchema[];
  formState: JsonObject;
};

/**
 * The component used by the {@link Stepper} to render the review step.
 * @alpha
 */
export const ReviewState = (props: ReviewStateProps) => {
  const reviewData = Object.fromEntries(
    Object.entries(props.formState).map(([key, value]) => {
      for (const step of props.schemas) {
        const parsedSchema = new JSONSchema(step.mergedSchema);
        const definitionInSchema = parsedSchema.getSchema(
          `#/${key}`,
          props.formState,
        );
        if (definitionInSchema) {
          const backstageReviewOptions =
            definitionInSchema['ui:backstage']?.review;

          if (backstageReviewOptions) {
            if (backstageReviewOptions.mask) {
              return [key, backstageReviewOptions.mask];
            }
            if (backstageReviewOptions.show === false) {
              return [];
            }
          }

          if (definitionInSchema['ui:widget'] === 'password') {
            return [key, '******'];
          }
        }
      }
      return [key, value];
    }),
  );
  return <StructuredMetadataTable metadata={reviewData} />;
};
