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

import { BackstageUserIdentityContext } from '@backstage/backend-plugin-api';
import { z } from 'zod';

const MAX_IDENTITY_CONTEXT_BYTES = 2048;

const identityContextSchema = z.object({
  issuer: z.string().min(1),
  attributes: z.record(z.string(), z.string()),
});

/**
 * Parses and normalizes identity context for use in Backstage user tokens.
 *
 * @internal
 */
export function parseUserIdentityContext(
  value: unknown,
): BackstageUserIdentityContext {
  const result = identityContextSchema.parse(value);
  const identityContext = {
    issuer: result.issuer,
    attributes: Object.fromEntries(Object.entries(result.attributes).sort()),
  };

  if (
    new TextEncoder().encode(JSON.stringify(identityContext)).length >
    MAX_IDENTITY_CONTEXT_BYTES
  ) {
    throw new Error('Identity context is excessively large');
  }

  return identityContext;
}
