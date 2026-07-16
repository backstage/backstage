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
 * An error encountered while loading a TypeScript configuration schema.
 *
 * @public
 */
export class ConfigSchemaError extends Error {
  name = 'ConfigSchemaError' as const;

  /** The package that provided the configuration schema. */
  readonly source: string;

  /** The underlying error that caused schema loading to fail. */
  declare readonly cause: Error;

  constructor(options: { source: string; cause: Error }) {
    const { source, cause } = options;
    const causeMessage = cause.message.replace(/\s*\r?\n\s*/g, ' ').trim();
    super(
      `The TypeScript configuration schema for package '${source}' contains an error — ${causeMessage}`,
      { cause },
    );

    this.source = source;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
