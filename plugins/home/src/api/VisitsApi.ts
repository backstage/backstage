/*
 * Copyright 2023 The Backstage Authors
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

import { createApiRef } from '@backstage/core-plugin-api';

/**
 * @public
 * The operators that can be used in filter.
 */
export type Operators = '<' | '<=' | '==' | '!=' | '>' | '>=' | 'contains';

/**
 * @public
 * Type guard for operators.
 */
export const isOperator = (s: string): s is Operators => {
  return ['<', '<=', '==', '!=', '>', '>=', 'contains'].includes(s);
};

/**
 * @public
 * Model for a visit entity.
 */
export type Visit = {
  /**
   * The auto-generated visit identification.
   */
  id: string;
  /**
   * The visited entity, usually an entity id.
   */
  name: string;
  /**
   * The visited url pathname, usually the entity route.
   */
  pathname: string;
  /**
   * An individual view count.
   */
  hits: number;
  /**
   * Last date and time of visit. Format: unix epoch in ms.
   */
  timestamp: number;
  /**
   * Optional entity reference. See stringifyEntityRef from catalog-model.
   */
  entityRef?: string;
};

/**
 * @public
 * This data structure represents the parameters associated with search queries for visits.
 */
export type VisitsApiQueryParams = {
  /**
   * Limits the number of results returned. The default is 8.
   */
  limit?: number;
  /**
   * Allows ordering visits on entity properties.
   * @example
   * Sort ascending by the timestamp field.
   * ```
   * { orderBy: [{ field: 'timestamp', direction: 'asc' }] }
   * ```
   */
  orderBy?: Array<{
    field: keyof Visit;
    direction: 'asc' | 'desc';
  }>;
  /**
   * Allows filtering visits on entity properties.
   * @example
   * Most popular docs on the past 7 days
   * ```
   * {
   *   orderBy: [{ field: 'hits', direction: 'desc' }],
   *   filterBy: [
   *     { field: 'timestamp', operator: '>=', value: <date> },
   *     { field: 'entityRef', operator: 'contains', value: 'docs' }
   *   ]
   * }
   * ```
   */
  filterBy?: Array<{
    field: keyof Visit;
    operator: Operators;
    value: string | number;
  }>;
};

/**
 * @public
 * This data structure represents the parameters associated with saving visits.
 */
export type VisitsApiSaveParams = {
  visit: Omit<Visit, 'id' | 'hits' | 'timestamp'>;
};

/**
 * @public
 * Visits API public contract.
 */
export interface VisitsApi {
  /**
   * Persist a new visit.
   * @param pageVisit - a new visit data
   */
  save(saveParams: VisitsApiSaveParams): Promise<Visit>;
  /**
   * Get user visits.
   * @param queryParams - optional search query params.
   */
  list(queryParams?: VisitsApiQueryParams): Promise<Visit[]>;
}

/** @public */
export const visitsApiRef = createApiRef<VisitsApi>({
  id: 'homepage.visits',
});
