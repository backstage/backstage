/*
 * Copyright 2024 The Backstage Authors
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

// This file is based on the plugins/catalog-backend

import { InputError } from '@backstage/errors';
import { EntityOrder } from '../database';

/**
 * Takes a single unknown parameter and makes sure that it's a single string or
 * an array of strings, and returns as an array.
 */
export function parseStringsParam(
  param: unknown,
  ctx: string,
): string[] | undefined {
  if (param === undefined) {
    return undefined;
  }

  const array = [param].flat();
  if (array.some(p => typeof p !== 'string')) {
    throw new InputError(`Invalid ${ctx}, not a string`);
  }

  return array as string[];
}

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
