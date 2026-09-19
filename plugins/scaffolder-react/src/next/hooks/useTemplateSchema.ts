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
import { featureFlagsApiRef, useApi } from '@backstage/core-plugin-api';
import { TemplatePresentationV1beta3 } from '@backstage/plugin-scaffolder-common';
import { JsonObject } from '@backstage/types';
import { UiSchema } from '@rjsf/utils';
import { TemplateParameterSchema } from '@backstage/plugin-scaffolder-react';
import { extractSchemaFromStep } from '../lib';

/**
 * This is the parsed template schema that is returned from the {@link useTemplateSchema} hook.
 * @alpha
 */
export interface ParsedTemplateSchema {
  uiSchema: UiSchema;
  mergedSchema: JsonObject;
  schema: JsonObject;
  title: string;
  description?: string;
}

const isJsonObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getConditionalProperties = (schema: JsonObject): JsonObject => {
  const properties: JsonObject = {};
  const conditionalSchemas = [
    ...((schema.allOf as JsonObject[]) ?? []),
    ...((schema.anyOf as JsonObject[]) ?? []),
    ...((schema.oneOf as JsonObject[]) ?? []),
    ...Object.values((schema.dependencies as JsonObject) ?? {}),
    schema.then,
    schema.else,
  ];

  for (const conditionalSchema of conditionalSchemas) {
    if (isJsonObject(conditionalSchema)) {
      Object.assign(properties, getConditionalProperties(conditionalSchema));
    }
  }

  return {
    ...properties,
    ...((schema.properties as JsonObject) ?? {}),
  };
};

/**
 * This hook will parse the template schema and return the steps with the
 * parsed schema and uiSchema. Filtering out any steps or properties that
 * are not enabled with feature flags.
 * @alpha
 */
export const useTemplateSchema = (
  manifest: TemplateParameterSchema,
): {
  steps: ParsedTemplateSchema[];
  presentation?: TemplatePresentationV1beta3;
} => {
  const featureFlags = useApi(featureFlagsApiRef);
  const steps = manifest.steps.map(({ title, description, schema }) => ({
    title,
    description,
    mergedSchema: schema,
    ...extractSchemaFromStep(schema),
  }));
  const filterProperties = (properties: JsonObject, uiSchema: UiSchema) =>
    Object.fromEntries(
      Object.entries(properties).filter(([key]) => {
        const stepFeatureFlag = uiSchema[key]?.['ui:backstage']?.featureFlag;
        return stepFeatureFlag ? featureFlags.isActive(stepFeatureFlag) : true;
      }),
    );
  const getStepProperties = (
    step: ParsedTemplateSchema,
    includeConditionalProperties = false,
  ) =>
    filterProperties(
      includeConditionalProperties
        ? getConditionalProperties(step.schema)
        : (step.schema.properties as JsonObject) ?? {},
      step.uiSchema,
    );

  const returningSteps = steps
    // Filter out steps that are not enabled with the feature flags
    .filter(step => {
      const stepFeatureFlag = step.uiSchema['ui:backstage']?.featureFlag;
      return stepFeatureFlag ? featureFlags.isActive(stepFeatureFlag) : true;
    })
    // Then filter out the properties that are not enabled with feature flag
    .map((step, index, filteredSteps) => {
      // Title is rendered at the top of the page, so let's ignore this from jsonschemaform
      const { title, ...stepSchema } = step.schema;

      const shouldIncludeCurrentProperties =
        Boolean(step.schema.properties) || !step.schema.dependencies;
      const currentStepProperties = shouldIncludeCurrentProperties
        ? getStepProperties(step)
        : undefined;
      const previousStepProperties = filteredSteps
        .slice(0, index)
        .reduce<JsonObject>(
          (properties, previousStep) => ({
            ...properties,
            ...getStepProperties(previousStep, true),
          }),
          {},
        );

      const strippedSchema = {
        ...step,
        schema: {
          ...stepSchema,
          ...(currentStepProperties ||
          Object.keys(previousStepProperties).length
            ? {
                properties: {
                  ...previousStepProperties,
                  ...(currentStepProperties ?? {}),
                },
              }
            : {}),
        },
      } as ParsedTemplateSchema;

      strippedSchema.uiSchema = {
        ...Object.fromEntries(
          Object.keys(previousStepProperties)
            .filter(property => !(property in (currentStepProperties ?? {})))
            .map(property => [
              property,
              {
                ...(step.uiSchema[property] as JsonObject | undefined),
                'ui:widget': 'hidden',
              },
            ]),
        ),
        ...step.uiSchema,
      };

      return strippedSchema;
    });

  return {
    presentation: manifest.presentation,
    steps: returningSteps,
  };
};
