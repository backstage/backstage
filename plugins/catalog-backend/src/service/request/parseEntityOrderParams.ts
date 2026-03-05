/*
 * Copyright 2021 The Backstage Authors
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
import { EntityOrder } from '../../catalog/types';
import { parseStringsParam } from './common';

export function parseEntityOrderParams(
  params: Record<string, unknown>,
): EntityOrder[] | undefined {
  return parseStringsParam(params.order, 'order')?.map(item => {
    const match = item.match(/^(asc|desc):(.+)$/);
    if (!match) {
      throw new InputError(
        `Invalid order parameter "${item}", expected "<asc or desc>:<field name>"`,
      );
    }

    return {
      order: match[1] as 'asc' | 'desc',
      field: match[2],
    };
  });
}
