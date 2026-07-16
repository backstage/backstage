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

import { CustomErrorBase } from '@backstage/errors';

/**
 * An error encountered while loading a TypeScript configuration schema.
 *
 * @public
 */
export class ConfigSchemaError extends CustomErrorBase {
  name = 'ConfigSchemaError' as const;

  /** The package that provided the configuration schema. */
  readonly source: string;

  /** The schema file path, relative to the current working directory. */
  readonly path: string;

  /** The underlying error that caused schema loading to fail. */
  declare readonly cause: Error;

  constructor(options: { source: string; path: string; cause: Error }) {
    const { source, path, cause } = options;
    super(
      `TypeScript configuration schema for package '${source}' at ${path} contains errors`,
      cause,
    );

    this.source = source;
    this.path = path;
  }
}
