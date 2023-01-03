/*
 * Copyright 2020 The Backstage Authors
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
import { Box, Button, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Content, StructuredMetadataTable } from '@backstage/core-components';
import { UiSchema } from '@rjsf/core';
import { JsonObject } from '@backstage/types';
import { ReviewStepProps } from '../types';

export function getReviewData(
  formData: Record<string, any>,
  uiSchemas: UiSchema[],
) {
  const reviewData: Record<string, any> = {};
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      const uiSchema = uiSchemas.find(us => us.name === key);

      if (!uiSchema) {
        reviewData[key] = formData[key];
        continue;
      }

      if (uiSchema['ui:widget'] === 'password') {
        reviewData[key] = '******';
        continue;
      }

      if (!uiSchema['ui:backstage'] || !uiSchema['ui:backstage'].review) {
        reviewData[key] = formData[key];
        continue;
      }

      const review = uiSchema['ui:backstage'].review as JsonObject;
      if (review.mask) {
        reviewData[key] = review.mask;
        continue;
      }

      if (!review.show) {
        continue;
      }
      reviewData[key] = formData[key];
    }
  }

  return reviewData;
}

export function getUiSchemasFromSteps(
  steps: {
    schema: JsonObject;
  }[],
): UiSchema[] {
  const uiSchemas: Array<UiSchema> = [];
  steps.forEach(step => {
    const schemaProps = step.schema.properties as JsonObject;
    for (const key in schemaProps) {
      if (schemaProps.hasOwnProperty(key)) {
        const uiSchema = schemaProps[key] as UiSchema;
        uiSchema.name = key;
        uiSchemas.push(uiSchema);
      }
    }
  });
  return uiSchemas;
}

/**
 * The component displaying the Last Step in scaffolder template form.
 * Which represents the summary of the input provided by the end user.
 */
export const ReviewStep = (props: ReviewStepProps) => {
  const {
    disableButtons,
    formData,
    handleBack,
    handleCreate,
    handleReset,
    steps,
  } = props;
  return (
    <Content>
      <Paper square elevation={0}>
        <Typography variant="h6">Review and create</Typography>
        <StructuredMetadataTable
          dense
          metadata={getReviewData(formData, getUiSchemasFromSteps(steps))}
        />
        <Box mb={4} />
        <Button onClick={handleBack} disabled={disableButtons}>
          Back
        </Button>
        <Button onClick={handleReset} disabled={disableButtons}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={disableButtons}
        >
          Create
        </Button>
      </Paper>
    </Content>
  );
};
