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

import {
  FacettedApi,
  ApiFacetContext,
  LogApi,
  LogStoreApi,
  LogLevel,
} from '@backstage/core-plugin-api';

export interface LogApiOptions {
  logStoreApi: LogStoreApi;
}

interface CompleteLogApiOptions extends LogApiOptions {
  facetStack: ApiFacetContext[];
}

export class DefaultLogApi implements FacettedApi<LogApi> {
  getApiFacet(context: ApiFacetContext): LogApi {
    return new DefaultLogApi({
      ...this.options,
      facetStack: [...this.options.facetStack, context],
    });
  }

  static create(options: LogApiOptions): DefaultLogApi {
    return new DefaultLogApi({ ...options, facetStack: [] });
  }

  private constructor(private options: CompleteLogApiOptions) {}

  private post(level: LogLevel, args: any[], callStack?: string) {
    this.options.logStoreApi.post({
      level,
      args,
      contextStack: this.options.facetStack,
      pathname: window.location.pathname,
      timestamp: new Date(),
      ...(callStack && { callStack }),
    });
  }

  debug(...args: any) {
    this.post('debug', args);
  }
  info(...args: any) {
    this.post('info', args);
  }
  warn(...args: any) {
    this.post('warn', args, cleanStack(new Error().stack));
  }
  error(...args: any) {
    this.post('error', args, cleanStack(new Error().stack));
  }
}

// Removes the first line, if it's only "Error" (the default for empty errors)
// and unindents the lines as much as possible, but evenly
function cleanStack(stack?: string): typeof stack {
  if (!stack) return stack;

  const lines = stack.split('\n');
  if (lines[0] === 'Error') lines.shift();

  const indent = lines
    .map(line => line.match(/( *)/)![1].length)
    .reduce((prev, cur) => (prev === -1 ? cur : Math.min(prev, cur)), -1);

  return lines.map(line => line.slice(indent)).join('\n');
}
