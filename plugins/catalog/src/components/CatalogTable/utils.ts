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

/**
 * Helper function to extract value from object using dot-notation path
 * @internal
 */
export function extractValueByField(data: any, field: string): any | undefined {
  if (!field) return undefined;
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined || value === null) {
      return value;
    }
    value = value[path[i]];
  }

  return value;
}
