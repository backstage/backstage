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
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
import {
  createGetRule,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from './util';

const mapConditions = <TQuery>(
  criteria: PermissionCriteria<PermissionCondition>,
  getRule: (name: string) => PermissionRule<unknown, TQuery, string>,
): PermissionCriteria<TQuery> => {
  if (isAndCriteria(criteria)) {
    return {
      allOf: criteria.allOf.map(child => mapConditions(child, getRule)),
    } as AllOfCriteria<TQuery>;
  } else if (isOrCriteria(criteria)) {
    return {
      anyOf: criteria.anyOf.map(child => mapConditions(child, getRule)),
    } as AnyOfCriteria<TQuery>;
  } else if (isNotCriteria(criteria)) {
    return {
      not: mapConditions(criteria.not, getRule),
    };
  }

  return getRule(criteria.rule).toQuery(...criteria.params);
};

/**
 * A function which accepts {@link @backstage/plugin-permission-common#PermissionCondition}s
 * logically grouped in a {@link @backstage/plugin-permission-common#PermissionCriteria}
 * object, and transforms the {@link @backstage/plugin-permission-common#PermissionCondition}s
 * into plugin specific query fragments while retaining the enclosing criteria shape.
 *
 * @public
 */
export type ConditionTransformer<TQuery> = (
  conditions: PermissionCriteria<PermissionCondition>,
) => PermissionCriteria<TQuery>;

/**
 * A higher-order helper function which accepts an array of
 * {@link PermissionRule}s, and returns a {@link ConditionTransformer}
 * which transforms input conditions into equivalent plugin-specific
 * query fragments using the supplied rules.
 *
 * @public
 */
export const createConditionTransformer = <
  TQuery,
  TRules extends PermissionRule<any, TQuery, string>[],
>(
  permissionRules: [...TRules],
): ConditionTransformer<TQuery> => {
  const getRule = createGetRule(permissionRules);

  return conditions => mapConditions(conditions, getRule);
};
