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

import {
  AllOfCriteria,
  AnyOfCriteria,
  NotCriteria,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';

export const isAndCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is AllOfCriteria<unknown> =>
  Object.prototype.hasOwnProperty.call(filter, 'allOf');

export const isOrCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is AnyOfCriteria<unknown> =>
  Object.prototype.hasOwnProperty.call(filter, 'anyOf');

export const isNotCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is NotCriteria<unknown> =>
  Object.prototype.hasOwnProperty.call(filter, 'not');

export const createGetRule = <TResource, TQuery>(
  rules: PermissionRule<TResource, TQuery>[],
) => {
  const rulesMap = new Map(Object.values(rules).map(rule => [rule.name, rule]));

  return (name: string): PermissionRule<TResource, TQuery> => {
    const rule = rulesMap.get(name);

    if (!rule) {
      throw new Error(`Unexpected permission rule: ${name}`);
    }

    return rule;
  };
};
