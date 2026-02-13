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

/**
 * Magic filter values for catalog entity filters. Re-exported from the main
 * package; this entry point exists so backends can import without loading the
 * full catalog client.
 *
 * @public
 */
export const CATALOG_FILTER_CURRENT_USER_REF = '__catalog:current_user_ref__';

/** @public
 *
 * Magic filter value for catalog entity filters that targets entities owned by
 * the current user.
 *
 * When used as the value of an ownership-related filter field (for example
 * `spec.owner` or `relations.ownedBy`), the backend expands this marker into
 * the list of entity refs that the current user is considered to own.
 *
 */

export const CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS =
  '__catalog:current_user_ownership_refs__';
