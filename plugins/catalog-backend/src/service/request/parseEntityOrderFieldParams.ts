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
import { EntityOrder } from '../../catalog/types';
import { parseStringsParam } from './common';

export function parseEntityOrderFieldParams(
  params: Record<string, unknown>,
): EntityOrder[] | undefined {
  const orderFieldStrings = parseStringsParam(params.orderField, 'orderField');
  if (!orderFieldStrings) {
    return undefined;
  }

  return orderFieldStrings.map(orderFieldString => {
    const [field, order] = orderFieldString.split(',');

    if (order !== undefined && !isOrder(order)) {
      throw new InputError('Invalid order field order, must be asc or desc');
    }
    return { field, order };
  });
}

export function isOrder(order: string): order is 'asc' | 'desc' {
  return ['asc', 'desc'].includes(order);
}
