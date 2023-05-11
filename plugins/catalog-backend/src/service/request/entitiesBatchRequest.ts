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

import { InputError } from '@backstage/errors';
import { Request } from 'express';
import { z } from 'zod';

const schema = z.object({
  entityRefs: z.array(z.string()),
  fields: z.array(z.string()).optional(),
});

export function entitiesBatchRequest(req: Request): z.infer<typeof schema> {
  try {
    return schema.parse(req.body);
  } catch (error) {
    throw new InputError(
      `Malformed request body (did you remember to specify an application/json content type?), ${error.message}`,
    );
  }
}
