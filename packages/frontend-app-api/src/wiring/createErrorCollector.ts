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

/**
 * @public
 */
export type AppErrorTypes = {
  // resolveAppNodeSpecs
  EXTENSION_IGNORED: {
    context: { plugin: FrontendPlugin; extensionId: string };
  };
  INVALID_EXTENSION_CONFIG_KEY: {
    context: { extensionId: string };
  };
  // resolveAppTree
  EXTENSION_INPUT_REDIRECT_CONFLICT: {
    context: { node: AppNode; inputName: string };
  };
  // instantiateAppNodeTree
  EXTENSION_INPUT_DATA_IGNORED: {
    context: { node: AppNode; inputName: string };
  };
  EXTENSION_INPUT_DATA_MISSING: {
    context: { node: AppNode; inputName: string };
  };
  EXTENSION_ATTACHMENT_CONFLICT: {
    context: { node: AppNode; inputName: string };
  };
  EXTENSION_ATTACHMENT_MISSING: {
    context: { node: AppNode; inputName: string };
  };
  EXTENSION_CONFIGURATION_INVALID: {
    context: { node: AppNode };
  };
  EXTENSION_INVALID: {
    context: { node: AppNode };
  };
  EXTENSION_OUTPUT_CONFLICT: {
    context: { node: AppNode; dataRefId: string };
  };
  EXTENSION_OUTPUT_MISSING: {
    context: { node: AppNode; dataRefId: string };
  };
  EXTENSION_OUTPUT_IGNORED: {
    context: { node: AppNode; dataRefId: string };
  };
  EXTENSION_FACTORY_ERROR: {
    context: { node: AppNode };
  };
  // createSpecializedApp
  API_EXTENSION_INVALID: {
    context: { node: AppNode };
  };
  API_FACTORY_CONFLICT: {
    context: {
      node: AppNode;
      apiRefId: string;
      pluginId: string;
      existingPluginId: string;
    };
  };
  // routing
  ROUTE_DUPLICATE: {
    context: { routeId: string };
  };
  ROUTE_BINDING_INVALID_VALUE: {
    context: { routeId: string };
  };
  ROUTE_NOT_FOUND: {
    context: { routeId: string };
  };
};

/**
 * @public
 */
export type AppError =
  keyof AppErrorTypes extends infer ICode extends keyof AppErrorTypes
    ? ICode extends any
      ? {
          code: ICode;
          message: string;
          context: AppErrorTypes[ICode]['context'];
        }
      : never
    : never;

/** @internal */
export interface ErrorCollector<TContext extends {} = {}> {
  report<TCode extends keyof AppErrorTypes>(
    report: Omit<
      AppErrorTypes[TCode]['context'],
      keyof TContext
    > extends infer IContext extends {}
      ? {} extends IContext
        ? {
            code: TCode;
            message: string;
          }
        : {
            code: TCode;
            message: string;
            context: IContext;
          }
      : never,
  ): void;
  child<TAdditionalContext extends {}>(
    context: TAdditionalContext,
  ): ErrorCollector<TContext & TAdditionalContext>;
  collectErrors(): AppError[] | undefined;
}

/** @internal */
export function createErrorCollector(
  context?: Partial<AppError['context']>,
): ErrorCollector {
  const errors: AppError[] = [];
  const children: ErrorCollector[] = [];
  return {
    report(report: { code: string; message: string; context?: {} }) {
      errors.push({
        ...report,
        context: { ...context, ...report.context },
      } as AppError);
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
