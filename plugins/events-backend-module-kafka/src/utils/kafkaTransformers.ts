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
import { EventParams } from '@backstage/plugin-events-node';
import { IHeaders } from 'kafkajs';

type EventMetadata = EventParams['metadata'];

export const convertHeadersToMetadata = (
  headers: IHeaders | undefined,
): EventMetadata => {
  if (!headers) return undefined;

  const metadata: EventMetadata = {};

  Object.entries(headers).forEach(([key, value]) => {
    // If value is an array use toString() on all values converting any Buffer types to valid strings
    if (Array.isArray(value)) metadata[key] = value.map(v => v.toString());
    // Always return the values using toString() to catch all Buffer types that should be converted to strings
    else metadata[key] = value?.toString();
  });

  return metadata;
};

export const payloadToBuffer = (payload: unknown): Buffer => {
  if (Buffer.isBuffer(payload)) {
    return payload;
  }

  if (typeof payload === 'string') {
    return Buffer.from(payload, 'utf8'); // More explicit encoding
  }

  // Convert to JSON string then encode
  return Buffer.from(JSON.stringify(payload), 'utf8');
};
