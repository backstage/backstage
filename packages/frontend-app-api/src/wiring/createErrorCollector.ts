/*
 * Copyright 2025 The Backstage Authors
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

import { AppNode, FrontendPlugin } from '@backstage/frontend-plugin-api';
import { Expand } from '@backstage/types';

type AppErrorTypes = {
  // resolveAppNodeSpecs
  EXTENSION_IGNORED: 'plugin' | 'extensionId';
  INVALID_EXTENSION_CONFIG_KEY: 'extensionId';
  // resolveAppTree
  EXTENSION_INPUT_REDIRECT_CONFLICT: 'node' | 'inputName';
  // instantiateAppNodeTree
  EXTENSION_INPUT_DATA_IGNORED: 'node' | 'inputName';
  EXTENSION_INPUT_DATA_MISSING: 'node' | 'inputName';
  EXTENSION_ATTACHMENT_CONFLICT: 'node' | 'inputName';
  EXTENSION_ATTACHMENT_MISSING: 'node' | 'inputName';
  EXTENSION_CONFIGURATION_INVALID: 'node';
  EXTENSION_INVALID: 'node';
  EXTENSION_OUTPUT_CONFLICT: 'node' | 'dataRefId';
  EXTENSION_OUTPUT_MISSING: 'node' | 'dataRefId';
  EXTENSION_OUTPUT_IGNORED: 'node' | 'dataRefId';
  EXTENSION_FACTORY_ERROR: 'node';
  // createSpecializedApp
  API_EXTENSION_INVALID: 'node';
};

type AppErrorContext = {
  node?: AppNode;
  plugin?: FrontendPlugin;
  extensionId?: string;
  dataRefId?: string;
  inputName?: string;
};

/** @public */
export type AppError<TCode extends keyof AppErrorTypes = keyof AppErrorTypes> =
  {
    code: TCode;
    message: string;
    context: Expand<
      AppErrorContext &
        Pick<
          Required<AppErrorContext>,
          keyof AppErrorTypes extends TCode ? never : AppErrorTypes[TCode]
        >
    >;
  };

/** @internal */
export interface ErrorCollector<
  TContext extends keyof AppErrorContext = never,
> {
  // Type-only: here to make sure that all required keys are present
  $$contextKeys: { [K in TContext]: K };
  report<TCode extends keyof AppErrorTypes>(
    report: Exclude<
      AppErrorTypes[TCode],
      TContext
    > extends infer IContext extends keyof AppErrorContext
      ? [IContext] extends [never]
        ? {
            code: TCode;
            message: string;
          }
        : {
            code: TCode;
            message: string;
            context: Pick<Required<AppErrorContext>, IContext>;
          }
      : never,
  ): void;
  child<TAdditionalContext extends AppErrorContext>(
    context?: TAdditionalContext & AppErrorContext,
  ): ErrorCollector<
    (TContext | keyof TAdditionalContext) & keyof AppErrorContext
  >;
  collectErrors(): AppError[] | undefined;
}

/** @internal */
export function createErrorCollector(
  context?: AppError['context'],
): ErrorCollector {
  const errors: AppError[] = [];
  const children: ErrorCollector[] = [];
  return {
    $$contextKeys: null as any,
    report(report) {
      errors.push({ ...report, context: { ...context, ...report.context } });
    },
    collectErrors() {
      const allErrors = [
        ...errors,
        ...children.flatMap(child => child.collectErrors() ?? []),
      ];
      errors.length = 0;
      if (allErrors.length === 0) {
        return undefined;
      }
      return allErrors;
    },
    child(childContext) {
      const child = createErrorCollector({ ...context, ...childContext });
      children.push(child);
      return child as ErrorCollector<any>;
    },
  };
}
