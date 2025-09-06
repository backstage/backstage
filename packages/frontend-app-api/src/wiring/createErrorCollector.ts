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

import {
  AppNode,
  AppNodeSpec,
  FrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { Expand } from '@backstage/types';

type AppErrorTypes = {
  // resolveAppNodeSpecs
  EXTENSION_FORBIDDEN: 'plugin' | 'extensionId';
  EXTENSION_DUPLICATED: 'plugin' | 'extensionId';
  EXTENSION_CONFIG_FORBIDDEN: 'extensionId';
  EXTENSION_CONFIG_UNKNOWN_EXTENSION: 'extensionId';
  // resolveAppTree
  DUPLICATE_EXTENSION_ID: 'spec';
  DUPLICATE_REDIRECT_TARGET: 'spec' | 'inputName';
  // instantiateAppNodeTree
  EXTENSION_DUPLICATE_INPUT: 'node' | 'inputName';
  EXTENSION_MISSING_INPUT_DATA: 'node' | 'inputName';
  EXTENSION_TOO_MANY_ATTACHMENTS: 'node' | 'inputName';
  EXTENSION_MISSING_REQUIRED_INPUT: 'node' | 'inputName';
  INVALID_CONFIGURATION: 'node';
  EXTENSION_FACTORY_INVALID_OUTPUT: 'node';
  EXTENSION_FACTORY_DUPLICATE_OUTPUT: 'node' | 'dataRefId';
  EXTENSION_FACTORY_MISSING_REQUIRED_OUTPUT: 'node' | 'dataRefId';
  EXTENSION_FACTORY_UNEXPECTED_OUTPUT: 'node' | 'dataRefId';
  UNEXPECTED_EXTENSION_VERSION: 'node';
  FAILED_TO_INSTANTIATE_EXTENSION: 'node';
  // createSpecializedApp
  NO_API_FACTORY: 'node';
};

type AppErrorContext = {
  node?: AppNode;
  spec?: AppNodeSpec;
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
      const child = createErrorCollector(childContext);
      children.push(child);
      return child as ErrorCollector<any>;
    },
  };
}
