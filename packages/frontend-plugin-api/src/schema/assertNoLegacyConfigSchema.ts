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

export function assertNoLegacyConfigSchema(options: {
  config?: unknown;
}): void {
  if (
    typeof options.config === 'object' &&
    options.config !== null &&
    'schema' in options.config
  ) {
    throw new Error(
      'The `config.schema` option is no longer supported. Migrate to the ' +
        'top-level `configSchema` option with Standard Schema values.',
    );
  }
}
