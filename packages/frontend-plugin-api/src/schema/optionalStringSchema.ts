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

import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from '@standard-schema/spec';

export const optionalStringSchema: StandardSchemaV1<string | undefined> &
  StandardJSONSchemaV1<string | undefined> = {
  '~standard': {
    version: 1,
    vendor: 'backstage',
    validate(value) {
      if (typeof value === 'string' || value === undefined) {
        return { value };
      }
      return { issues: [{ message: 'Expected string' }] };
    },
    jsonSchema: {
      input() {
        return { type: 'string' };
      },
      output() {
        return { type: 'string' };
      },
    },
  },
};
