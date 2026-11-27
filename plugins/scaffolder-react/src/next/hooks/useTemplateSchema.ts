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
 * A derived default expression extracted from a field's `ui:backstage.default`
 * configuration.
 * @alpha
 */
export interface TemplateDefaultExpression {
  path: string[];
  expression: string;
}

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
  when?: string | boolean;
  defaultExpressions?: TemplateDefaultExpression[];
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function findPropertySchema(
  schema: JsonObject | undefined,
  key: string,
): JsonObject | undefined {
  if (!schema) {
    return undefined;
  }
  if (isJsonObject(schema.properties) && isJsonObject(schema.properties[key])) {
    return schema.properties[key] as JsonObject;
  }
  for (const keyword of ['allOf', 'oneOf', 'anyOf']) {
    const branches = schema[keyword];
    if (Array.isArray(branches)) {
      for (const branch of branches) {
        if (isJsonObject(branch)) {
          const found = findPropertySchema(branch, key);
          if (found) {
            return found;
          }
        }
      }
    }
  }
  for (const branch of [
    schema.then,
    schema.else,
    ...Object.values(
      isJsonObject(schema.dependencies) ? schema.dependencies : {},
    ),
  ]) {
    if (isJsonObject(branch)) {
      const found = findPropertySchema(branch, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

function extractDefaultExpressions(
  uiNode: UiSchema,
  schemaNode: JsonObject | undefined,
  isFeatureFlagActive: (flag: string) => boolean,
  path: string[] = [],
): TemplateDefaultExpression[] {
  const result: TemplateDefaultExpression[] = [];

  if (path.length > 0) {
    const featureFlag = uiNode['ui:backstage']?.featureFlag;
    if (typeof featureFlag === 'string' && !isFeatureFlagActive(featureFlag)) {
      return result;
    }

    const defaultExpression = uiNode['ui:backstage']?.default;
    if (typeof defaultExpression === 'string') {
      result.push({ path, expression: defaultExpression });
    }
  }

  const isArraySchema =
    schemaNode?.type === 'array' || schemaNode?.items !== undefined;

  for (const [key, value] of Object.entries(uiNode)) {
    if (key.startsWith('ui:') || !isJsonObject(value)) {
      continue;
    }
    if (key === 'items' && isArraySchema) {
      continue;
    }
    const childSchema = findPropertySchema(schemaNode, key);
    result.push(
      ...extractDefaultExpressions(
        value as UiSchema,
        childSchema,
        isFeatureFlagActive,
        [...path, key],
      ),
    );
  }

  return result;
}

/**
 * This hook will parse the template schema and return the steps with the
 * parsed schema and uiSchema. Filtering out any steps or properties that
 * are not enabled with feature flags, and extracting any `ui:backstage.default`
 * expressions.
 * @alpha
 */
export const useTemplateSchema = (
  manifest: TemplateParameterSchema,
): {
  steps: ParsedTemplateSchema[];
  presentation?: TemplatePresentationV1beta3;
} => {
  const featureFlags = useApi(featureFlagsApiRef);
  const steps = manifest.steps.map(step => ({
    title: step.title,
    description: step.description,
    ...(step.when !== undefined ? { when: step.when } : {}),
    mergedSchema: step.schema,
    ...extractSchemaFromStep(step.schema),
  }));

  const returningSteps = steps
    // Filter out steps that are not enabled with the feature flags
    .filter(step => {
      const stepFeatureFlag = step.uiSchema['ui:backstage']?.featureFlag;
      return stepFeatureFlag ? featureFlags.isActive(stepFeatureFlag) : true;
    })
    // Then filter out the properties that are not enabled with feature flag
    .map(step => {
      // Title is rendered at the top of the page, so let's ignore this from jsonschemaform
      const { title, ...stepSchema } = step.schema;

      const strippedSchema = {
        ...step,
        schema: {
          ...stepSchema,
        },
      } as ParsedTemplateSchema;

      if (step.schema?.properties || !step.schema?.dependencies) {
        strippedSchema.schema.properties = Object.fromEntries(
          Object.entries((step.schema?.properties ?? {}) as JsonObject).filter(
            ([key]) => {
              const stepFeatureFlag =
                step.uiSchema[key]?.['ui:backstage']?.featureFlag;
              return stepFeatureFlag
                ? featureFlags.isActive(stepFeatureFlag)
                : true;
            },
          ),
        );
      }

      const defaultExpressions = extractDefaultExpressions(
        strippedSchema.uiSchema,
        strippedSchema.schema,
        flag => featureFlags.isActive(flag),
      );
      if (defaultExpressions.length > 0) {
        strippedSchema.defaultExpressions = defaultExpressions;
      }

      return strippedSchema;
    });

  return {
    presentation: manifest.presentation,
    steps: returningSteps,
  };
};
