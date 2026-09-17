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

import { isError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { z } from 'zod/v3';
import { isJsonObjectDeep } from './util';
import { validateMetaSchema } from './validateMetaSchema';

export const jsonObjectSchema = z
  .record(z.string(), z.unknown())
  .refine((x): x is JsonObject => isJsonObjectDeep(x), {
    message: 'Invalid JSON schema',
  });

export const jsonSchemaSchema = z
  .record(z.string(), z.unknown())
  .superRefine((x, ctx): x is JsonObject => {
    try {
      return validateMetaSchema(x);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: isError(error) ? error.message : 'Invalid JSON schema',
      });
      return false;
    }
  });
