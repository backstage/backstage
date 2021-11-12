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

import { PermissionCriteria } from '@backstage/plugin-permission-common';

const isAndCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is { allOf: PermissionCriteria<unknown>[] } =>
  Object.prototype.hasOwnProperty.call(filter, 'allOf');

const isOrCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is { anyOf: PermissionCriteria<unknown>[] } =>
  Object.prototype.hasOwnProperty.call(filter, 'anyOf');

const isNotCriteria = (
  filter: PermissionCriteria<unknown>,
): filter is { not: PermissionCriteria<unknown> } =>
  Object.prototype.hasOwnProperty.call(filter, 'not');

export const mapConditions = <TQueryIn, TQueryOut>(
  criteria: PermissionCriteria<TQueryIn>,
  mapFn: (condition: TQueryIn) => TQueryOut,
): PermissionCriteria<TQueryOut> => {
  if (isAndCriteria(criteria)) {
    return {
      allOf: criteria.allOf.map(child => mapConditions(child, mapFn)),
    };
  } else if (isOrCriteria(criteria)) {
    return {
      anyOf: criteria.anyOf.map(child => mapConditions(child, mapFn)),
    };
  } else if (isNotCriteria(criteria)) {
    return {
      not: mapConditions(criteria.not, mapFn),
    };
  }

  return mapFn(criteria);
};

export const applyConditions = <TQuery>(
  criteria: PermissionCriteria<TQuery>,
  applyFn: (condition: TQuery) => boolean,
): boolean => {
  if (isAndCriteria(criteria)) {
    return criteria.allOf.every(child => applyConditions(child, applyFn));
  } else if (isOrCriteria(criteria)) {
    return criteria.anyOf.some(child => applyConditions(child, applyFn));
  } else if (isNotCriteria(criteria)) {
    return !applyConditions(criteria.not, applyFn);
  }

  return applyFn(criteria);
};
