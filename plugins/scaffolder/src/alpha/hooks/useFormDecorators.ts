/*
 * Copyright 2024 The Backstage Authors
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
import { errorApiRef, useApi, useApiHolder } from '@backstage/core-plugin-api';
import { formDecoratorsApiRef } from '../api/ref';
import useAsync from 'react-use/esm/useAsync';
import { useCallback, useMemo } from 'react';
import { ScaffolderFormDecoratorContext } from '@backstage/plugin-scaffolder-react/alpha';
import { OpaqueFormDecorator } from '@internal/scaffolder';
import { TemplateParameterSchema } from '@backstage/plugin-scaffolder-react';
import { JsonValue } from '@backstage/types';

/** @internal */
type BoundFieldDecorator = {
  decorator: (ctx: ScaffolderFormDecoratorContext) => Promise<void>;
};

export const useFormDecorators = () => {
  const formDecoratorsApi = useApi(formDecoratorsApiRef);
  const errorApi = useApi(errorApiRef);
  const { value: decorators } = useAsync(
    () => formDecoratorsApi.getFormDecorators(),
    [],
  );
  const apiHolder = useApiHolder();

  const boundDecorators = useMemo(() => {
    const decoratorsMap = new Map<string, BoundFieldDecorator>();

    for (const decorator of decorators ?? []) {
      try {
        const { decorator: decoratorFn, deps } =
          OpaqueFormDecorator.toInternal(decorator);

        const resolvedDeps = Object.entries(deps ?? {}).map(([key, value]) => {
          const api = apiHolder.get(value);
          if (!api) {
            throw new Error(
              `Failed to resolve apiRef ${value.id} for form decorator ${decorator.id} it will be disabled`,
            );
          }
          return [key, api];
        });

        decoratorsMap.set(decorator.id, {
          decorator: ctx => decoratorFn(ctx, Object.fromEntries(resolvedDeps)),
        });
      } catch (ex) {
        errorApi.post(ex);
        return undefined;
      }
    }
    return decoratorsMap;
  }, [apiHolder, decorators, errorApi]);

  const run = useCallback(
    async (opts: {
      formState: Record<string, JsonValue>;
      secrets: Record<string, string>;
      manifest?: TemplateParameterSchema;
    }) => {
      let formState: Record<string, JsonValue> = { ...opts.formState };
      let secrets: Record<string, string> = { ...opts.secrets };

      const formDecorators = opts.manifest?.EXPERIMENTAL_formDecorators;
      if (formDecorators) {
        // for each of the form decorators, go and call the decorator with the context
        await Promise.all(
          formDecorators.map(async decorator => {
            const formDecorator = boundDecorators?.get(decorator.id);
            if (!formDecorator) {
              errorApi.post(
                new Error(`Failed to find form decorator ${decorator.id}`),
              );
              return;
            }

            await formDecorator.decorator({
              setSecrets: (
                handler: (
                  oldState: Record<string, string>,
                ) => Record<string, string>,
              ) => {
                secrets = { ...handler(secrets) };
              },
              setFormState: (
                handler: (
                  oldState: Record<string, JsonValue>,
                ) => Record<string, JsonValue>,
              ) => {
                formState = { ...handler(formState) };
              },
              formState,
              input: decorator.input ?? {},
            });
          }),
        );
      }

      return { formState, secrets };
    },
    [boundDecorators, errorApi],
  );

  return useMemo(
    () => ({
      run,
    }),
    [run],
  );
};
