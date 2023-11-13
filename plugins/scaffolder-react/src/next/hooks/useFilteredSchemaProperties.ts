/*
 * Copyright 2023 The Backstage Authors
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
import cloneDeep from 'lodash/cloneDeep';
import { useApi, featureFlagsApiRef } from '@backstage/core-plugin-api';
import { TemplateParameterSchema } from '@backstage/plugin-scaffolder-react';

/**
 * Returns manifest of software templates with steps without a featureFlag tag.
 * @alpha
 */

export const useFilteredSchemaProperties = (
  manifest: TemplateParameterSchema | undefined,
): TemplateParameterSchema | undefined => {
  const featureFlagKey = 'backstage:featureFlag';
  const featureFlagApi = useApi(featureFlagsApiRef);

  if (!manifest) {
    return undefined;
  }

  const filteredSteps = manifest?.steps
    .filter(step => {
      const featureFlag = step.schema[featureFlagKey];
      return (
        typeof featureFlag !== 'string' || featureFlagApi.isActive(featureFlag)
      );
    })
    .map(step => {
      const filteredStep = cloneDeep(step);
      const removedPropertyKeys: Array<string> = [];
      if (filteredStep.schema.properties) {
        filteredStep.schema.properties = Object.fromEntries(
          Object.entries(filteredStep.schema.properties).filter(
            ([key, value]) => {
              if (value[featureFlagKey]) {
                if (featureFlagApi.isActive(value[featureFlagKey])) {
                  return true;
                }

                removedPropertyKeys.push(key);
                return false;
              }
              return true;
            },
          ),
        );

        // remove the feature flag property key from required if they are not active
        filteredStep.schema.required = Array.isArray(
          filteredStep.schema.required,
        )
          ? filteredStep.schema.required?.filter(
              r => !removedPropertyKeys.includes(r as string),
            )
          : filteredStep.schema.required;
      }

      return filteredStep;
    });

  return { ...manifest, steps: filteredSteps };
};
