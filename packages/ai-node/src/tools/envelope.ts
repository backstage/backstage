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

import { assertUniqueTopLevelKeys, readBody } from '../providers/httpEnvelope';
import type { ToolCallEnvelope } from './types';

/**
 * Validates the final adapter-produced tool-call envelope: exact destination,
 * POST with a JSON body, unique top-level keys, the called tool's name in the
 * body, object-shaped arguments, all under the shared 16 MiB cap. The tool
 * arguments are never journaled — the attempt journal records decisions and
 * outcomes only.
 *
 * @alpha
 */
export async function validateToolCallEnvelope(
  operation: ToolCallEnvelope,
  request: Request,
): Promise<void> {
  const actual = new URL(request.url);
  const expected = new URL(operation.destination);
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
    actual.search !== expected.search
  ) {
    throw new Error('Unexpected tool destination');
  }
  if (request.method !== 'POST') {
    throw new Error('Unexpected tool method');
  }
  const contentType = request.headers
    .get('content-type')
    ?.split(';', 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== 'application/json') {
    throw new Error('Uninspectable tool request');
  }
  const bytes = await readBody(request);
  const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const payload: unknown = JSON.parse(json);
  assertUniqueTopLevelKeys(json);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Uninspectable tool request');
  }
  const body = payload as Record<string, unknown>;
  if (body.tool !== operation.toolName) {
    throw new Error('Request tool does not match the called tool');
  }
  if (
    body.arguments !== undefined &&
    (typeof body.arguments !== 'object' || body.arguments === null)
  ) {
    throw new Error('Uninspectable tool arguments');
  }
}
