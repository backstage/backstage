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

/** @public */
export type AppError = {
  code: string;
  message: string;
  context?: {
    node?: AppNode;
    spec?: AppNodeSpec;
    plugin?: FrontendPlugin;
    extensionId?: string;
    inputName?: string;
    dataRefId?: string;
  };
};

/** @internal */
export interface ErrorCollector {
  report(report: AppError): void;
  child(context?: AppError['context']): ErrorCollector;
  collectErrors(): AppError[] | undefined;
}

/** @internal */
export function createErrorCollector(context?: AppError['context']) {
  const errors: AppError[] = [];
  const children: ErrorCollector[] = [];
  return {
    report(report: AppError) {
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
    child(childContext: AppError['context']) {
      const child = createErrorCollector(childContext);
      children.push(child);
      return child;
    },
  };
}
