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

const ALLOWED_FILTER_CHARS = /^[0-9a-zA-Z-_*\s]+$/;

function buildRegexFromFilter(filter: string): RegExp {
  if (!ALLOWED_FILTER_CHARS.test(filter)) {
    throw new Error(`Invalid filter: '${filter}'`);
  }
  const pattern = filter.replace(/\*/g, '.+');
  return RegExp(`^${pattern}$`);
}

export class KubernetestClusterFilter {
  private _filterRegex: RegExp;

  constructor(filter: string) {
    this._filterRegex = buildRegexFromFilter(filter);
  }

  isMatch(name: string): boolean {
    return this._filterRegex.test(name);
  }
}
