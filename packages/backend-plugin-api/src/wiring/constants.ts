/*
 * Copyright 2025 The Backstage Authors
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

// NOTE: changing any of these constants need to be reflected in
// @backstage/frontend-plugin-api/src/wiring/constants.ts as well

/**
 * The pattern that IDs must match.
 *
 * @remarks
 * ids must only contain the letters `a` through `z` and digits, in groups separated by
 * dashes. Additionally, the very first character of the first group
 * must be a letter, not a digit
 *
 * @public
 */
export const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/i;
export const ID_PATTERN_OLD = /^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/i;
