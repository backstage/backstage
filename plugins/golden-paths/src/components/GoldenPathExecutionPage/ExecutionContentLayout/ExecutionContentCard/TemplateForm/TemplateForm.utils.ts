/*
 * Copyright 2026 The Backstage Authors
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
import { useState, useMemo, useCallback, useEffect } from 'react';
import { parseEntityRef } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useTemplateParameterSchema } from '@backstage/plugin-scaffolder-react/alpha';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import { JsonObject, JsonValue } from '@backstage/types';
import {
  goldenPathsApiRef,
  useGoldenPathContext,
} from '@backstage/plugin-golden-paths-react';
import { isArray, toString } from 'lodash';

import { useFormDecorators } from '../../../../../hooks/useFormDecorators';
import { useGoldenPathTaskContext } from '../../../useGoldenPathTaskContext';

export function resolvePlaceholders(
  value?: unknown,
  inputValues?: JsonObject,
): unknown {
  // Handle null/undefined
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(item => resolvePlaceholders(item, inputValues));
  }

  if (typeof value === 'object') {
    const result: JsonObject = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolvePlaceholders(val, inputValues) as JsonValue;
    }
    return result;
  }

  if (typeof value !== 'string') return value;
  if (!inputValues) return value;

  const types = Object.keys(inputValues);
  const re = new RegExp(
    `\\$\\{\\{\\s*(${types.join('|')})\\.([^}]+?)\\s*\\}\\}`,
    'g',
  );

  // Check if the entire string is a single placeholder (no extra text)
  const singlePlaceholderMatch = value.match(
    new RegExp(
      `^\\s*\\$\\{\\{\\s*(${types.join('|')})\\.([^}]+?)\\s*\\}\\}\\s*$`,
    ),
  );

  if (singlePlaceholderMatch) {
    // Return the resolved value directly without stringification to preserve types
    const type = singlePlaceholderMatch[1];
    const path = singlePlaceholderMatch[2];
    const valuesToUse = inputValues[type];

    if (valuesToUse) {
      const resolved: JsonValue | undefined = path
        .split('.')
        .reduce<JsonValue | undefined>(
          (acc, key) => (acc !== null ? (acc as JsonObject)[key] : undefined),
          valuesToUse,
        );
      return resolved !== undefined ? resolved : '';
    }
  }

  // Handle multiple placeholders or mixed content - requires string replacement
  const replacedValue = value.replace(
    re,
    (_match: string, type: string, path: string) => {
      const valuesToUse = inputValues[type];

      if (!valuesToUse) {
        return value;
      }

      const resolved: JsonValue | undefined = path
        .split('.')
        .reduce<JsonValue | undefined>(
          (acc, key) => (acc !== null ? (acc as JsonObject)[key] : undefined),
          valuesToUse,
        );
      return resolved !== undefined ? String(resolved) : '';
    },
  );

  const castValue = (textValue: string): unknown => {
    if (textValue === 'true') return true;
    if (textValue === 'false') return false;
    const asNumber = Number(textValue);
    if (!isNaN(asNumber)) return asNumber;
    try {
      return JSON.parse(textValue);
    } catch {
      return textValue;
    }
  };

  return castValue(replacedValue);
}

export function resolveInputReferences<T extends JsonObject>(
  input?: T,
  parameters?: JsonObject,
): { [K in keyof T]: unknown } {
  const result = {} as { [K in keyof T]: unknown };
  if (!input) return result;

  for (const [key, val] of Object.entries(input)) {
    result[key as keyof T] = resolvePlaceholders(val, parameters);
  }
  return result;
}

export const useTemplateForm = () => {
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const errorApi = useApi(errorApiRef);
  const [error, setError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { secrets: contextSecrets } = useTemplateSecrets();
  const {
    value: {
      goldenPathTask: {
        id: taskId,
        spec: { steps, parameters: globalParameters },
      },
      templateStepParams,
      stepIndex,
      setStepPhase,
    },
  } = useGoldenPathTaskContext();
  const { fieldExtensions } = useGoldenPathContext();

  const {
    id: templateId,
    template: templateRef,
    input,
  } = useMemo(() => steps[stepIndex], [stepIndex, steps]);

  const { name: templateName, namespace } = parseEntityRef(templateRef);
  const {
    manifest,
    error: templateError,
    loading,
  } = useTemplateParameterSchema(templateRef);

  useEffect(() => {
    if (templateError) {
      setError(templateError.message.includes('404 Not Found'));
    } else setError(false);
  }, [templateError]);

  const decorators = useFormDecorators();

  const onCreate = useCallback(
    async (initialValues: Record<string, JsonValue>) => {
      if (isCreating) {
        return;
      }

      setIsCreating(true);

      const { formState: values, secrets } = await decorators.run({
        formState: initialValues,
        secrets: contextSecrets,
        manifest,
      });

      try {
        await goldenPathsApi.createTemplate({
          templateId,
          taskId,
          secrets,
          values,
          templateRef,
        });

        await goldenPathsApi.updateStatus({
          taskId,
          templateId,
          status: 'active',
        });
      } catch (err) {
        errorApi.post(new Error(toString(err)));
      }

      setStepPhase('processing');
    },
    [
      isCreating,
      decorators,
      contextSecrets,
      manifest,
      goldenPathsApi,
      templateId,
      taskId,
      templateRef,
      setStepPhase,
      errorApi,
    ],
  );

  const onError = () => null;

  const [outputs, setOutputs] = useState<JsonObject | undefined>(undefined);

  // Fetch outputs for the golden path
  useEffect(() => {
    const fetchOutputs = async () => {
      try {
        if (taskId) {
          const result = await goldenPathsApi.getTemplateOutputs(taskId);
          setOutputs(result);
        }
      } catch (err) {
        errorApi.post(
          new Error(`Failed to fetch outputs for template: ${toString(err)}`),
        );
      }
    };

    fetchOutputs();
  }, [taskId, goldenPathsApi, errorApi]);

  const initialState = useMemo(() => {
    if (!manifest) return undefined;

    const templateParamsDefaultValues = Object.fromEntries(
      manifest.steps.flatMap(({ schema: { properties } }) => {
        if (
          typeof properties === 'object' &&
          properties &&
          !isArray(properties)
        ) {
          return Object.entries(properties).map(([key, value]) => {
            if (
              typeof value === 'object' &&
              value &&
              !isArray(value) &&
              value.default
            )
              return [key, value.default];

            return [key, null];
          });
        }

        return [];
      }),
    );

    const templateParametersKeysToInclude = Object.keys(
      templateParamsDefaultValues,
    );

    const inputsWithResolvedReferences = resolveInputReferences(input, {
      parameters: globalParameters,
      outputs,
    });

    const mergedInitialState = Object.fromEntries(
      Object.entries({
        ...templateParamsDefaultValues,
        ...globalParameters,
        ...inputsWithResolvedReferences,
        ...templateStepParams,
      }).map(([key, value]) => {
        if (typeof value === 'undefined') return [key, null];
        return [key, value];
      }),
    );

    const filteredInitialState: {
      [k: string]: JsonValue;
    } = {};
    templateParametersKeysToInclude.forEach(key => {
      filteredInitialState[key] = mergedInitialState[key];
    });
    return filteredInitialState;
  }, [manifest, globalParameters, templateStepParams, input, outputs]);

  return {
    onCreate,
    onError,
    loading,
    templateName,
    namespace,
    isCreating,
    fieldExtensions,
    initialState,
    templateRef,
    error,
    taskId,
    templateId,
  };
};
