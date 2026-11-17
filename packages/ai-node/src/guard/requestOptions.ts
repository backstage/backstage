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

import { builtinProviderRegistry } from '../providers/builtins';
import type { AiProviderRegistry } from '../providers/registry';
import type { GuardedOperation, TrustedOperation } from './types';

/** Apply only at a private, host-owned provider boundary. */
export function guardedRequestOptions(
  operation: TrustedOperation,
  guarded: GuardedOperation,
  options: Record<string, unknown> = {},
  registry: AiProviderRegistry = builtinProviderRegistry,
): Record<string, unknown> {
  const module = registry.get(operation.api);
  if (!module || !module.certifiedOperations.includes(operation.operation)) {
    throw new Error('Unverified model operation or transport');
  }
  // None of these options may substitute a client, credential, endpoint or
  // signed headers after the host established the trusted operation.
  for (const key of [
    'fetch',
    'client',
    'apiKey',
    'env',
    'headers',
    'transformHeaders',
    'azureBaseUrl',
    'azureResourceName',
    'azureApiVersion',
    'azureDeploymentName',
  ]) {
    if (options[key] !== undefined)
      throw new Error(`Unsupported model option: ${key}`);
  }
  if (options.transport !== undefined && options.transport !== 'sse') {
    throw new Error('Unsupported model transport');
  }
  const suppliedSignal = options.signal;
  if (
    suppliedSignal !== undefined &&
    !(suppliedSignal instanceof AbortSignal)
  ) {
    throw new Error('Invalid model signal');
  }
  return {
    ...options,
    ...(module.transport ? { transport: module.transport } : {}),
    signal: suppliedSignal
      ? AbortSignal.any([suppliedSignal, operation.controller.signal])
      : operation.controller.signal,
    fetch: guarded.fetch.bind(guarded),
  };
}
