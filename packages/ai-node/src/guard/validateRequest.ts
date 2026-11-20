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

import { emptyProviderRegistry } from '../providers/registry';
import type { AiProviderRegistry } from '../providers/registry';
import type { TrustedOperation } from './types';

const MAX_ENVELOPE_BYTES = 16 * 1024 * 1024;

async function enforceBodyLimit(request: Request): Promise<void> {
  const reader = request.clone().body?.getReader();
  if (!reader) return;
  let size = 0;
  let part = await reader.read();
  while (!part.done) {
    size += part.value.byteLength;
    if (size > MAX_ENVELOPE_BYTES) {
      void reader.cancel().catch(() => {});
      throw new Error('Model request body exceeds limit');
    }
    part = await reader.read();
  }
}

/** Validate registration, the host-bound destination, and the provider envelope. */
export async function validateRequest(
  operation: TrustedOperation,
  request: Request,
  registry: AiProviderRegistry = emptyProviderRegistry,
): Promise<'model' | 'auth.token-exchange'> {
  const module = registry.get(operation.api);
  if (!module || !module.certifiedOperations.includes(operation.operation)) {
    throw new Error('Unverified model operation or transport');
  }
  if (module.adapter.kind === 'local') {
    // A local module has no destination and no HTTP request to validate: its
    // dispatch never reaches this transport boundary.
    throw new Error('Local module operations are not validated as requests');
  }
  if (operation.destination === undefined) {
    throw new Error('Unverified model operation or transport');
  }
  await enforceBodyLimit(request);
  const envelope = Object.freeze({
    api: operation.api,
    operation: operation.operation,
    modelId: operation.modelId,
    resolvedModel: operation.resolvedModel,
    destination: operation.destination,
    ...(operation.authTokenDestinations
      ? {
          authTokenDestinations: Object.freeze([
            ...operation.authTokenDestinations,
          ]),
        }
      : {}),
  });
  const validateEnvelope = module.validateEnvelope;
  if (validateEnvelope === undefined) {
    throw new Error('Unverified model operation or transport');
  }
  const kind = await validateEnvelope(envelope, request.clone());
  if (kind !== 'model' && kind !== 'auth.token-exchange') {
    throw new Error('Unverified request classification');
  }
  const actual = new URL(request.url);
  const expected = new URL(
    kind === 'model' ? operation.destination : actual.href,
  );
  if (
    expected.username ||
    expected.password ||
    expected.hash ||
    (expected.protocol !== 'https:' &&
      !(
        expected.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(expected.hostname)
      )) ||
    actual.origin !== expected.origin ||
    actual.pathname !== expected.pathname ||
    (kind === 'auth.token-exchange' &&
      !operation.authTokenDestinations?.includes(actual.href))
  ) {
    throw new Error('Unexpected model destination');
  }
  return kind;
}
