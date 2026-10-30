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
 * Opt-in support for validating catalog entities with ajv.
 *
 * @packageDocumentation
 */

import { ajvSchemaEngine } from './validation/engine/ajvSchemaEngine';
import { setSchemaEngine } from './validation/engine/registry';

/**
 * Makes all JSON Schema validation in this package use ajv, for the entire
 * process.
 *
 * @remarks
 *
 * By default, schemas are validated by an engine that interprets them, which
 * works in any environment. Ajv instead compiles schemas into code, which makes
 * validation considerably faster. This is useful in backends that validate
 * large numbers of entities, such as the catalog backend.
 *
 * Do not call this in browser environments, since generating code at runtime
 * requires `'unsafe-eval'` in the Content Security Policy.
 *
 * Validators that were already created switch over to ajv on their next use.
 * The wording of validation error messages differs between the engines.
 *
 * @public
 */
export function installAjvSchemaEngine(): void {
  setSchemaEngine(ajvSchemaEngine);
}
