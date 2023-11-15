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

/**
 * Combine two arrays of scopes without duplicates
 * @param defaultScopes Default scopes
 * @param additionalScopes Optional additional scopes
 * @returns List of scopes
 * @public
 */
export const scopeHelper = function (
  defaultScopes: string[],
  additionalScopes?: string[],
): string[] {
  const scope: string[] = defaultScopes.concat(additionalScopes || []);
  return scope.filter((value, index) => scope.indexOf(value) === index);
};
