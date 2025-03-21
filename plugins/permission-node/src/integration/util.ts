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

/**
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
export type NoInfer<T> = T extends infer S ? S : never;

/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @public
 *
 * @returns `true` if the permission criteria is of type allOf,
 * narrowing down `criteria` to the specific type.
 */
export const isAndCriteria = <T>(
  criteria: PermissionCriteria<T>,
): criteria is AllOfCriteria<T> =>
  Object.prototype.hasOwnProperty.call(criteria, 'allOf');

/**
 * Utility function used to parse a PermissionCriteria of type
 * @param criteria - a PermissionCriteria
 * @public
 *
 * @returns `true` if the permission criteria is of type anyOf,
 * narrowing down `criteria` to the specific type.
 */
export const isOrCriteria = <T>(
  criteria: PermissionCriteria<T>,
): criteria is AnyOfCriteria<T> =>
  Object.prototype.hasOwnProperty.call(criteria, 'anyOf');

/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @public
 *
 * @returns `true` if the permission criteria is of type not,
 * narrowing down `criteria` to the specific type.
 */
export const isNotCriteria = <T>(
  criteria: PermissionCriteria<T>,
): criteria is NotCriteria<T> =>
  Object.prototype.hasOwnProperty.call(criteria, 'not');

export const createGetRule = <TResource, TQuery>(
  rules: PermissionRule<TResource, TQuery, string>[],
) => {
  const rulesMap = new Map(Object.values(rules).map(rule => [rule.name, rule]));

  return (name: string): PermissionRule<TResource, TQuery, string> => {
    const rule = rulesMap.get(name);

    if (!rule) {
      throw new Error(`Unexpected permission rule: ${name}`);
    }

    return rule;
  };
};
