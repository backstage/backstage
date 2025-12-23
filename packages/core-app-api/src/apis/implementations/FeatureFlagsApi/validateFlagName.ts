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

export function validateFlagName(name: string): void {
  if (name.length < 3) {
    throw new Error(
      `The '${name}' feature flag must have a minimum length of three characters.`,
    );
  }

  if (name.length > 150) {
    throw new Error(
      `The '${name}' feature flag must not exceed 150 characters.`,
    );
  }

  if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
    throw new Error(
      `The '${name}' feature flag must start with a lowercase letter and only contain lowercase letters, numbers and hyphens. ` +
        'Examples: feature-flag-one, alpha, release-2020',
    );
  }
}
