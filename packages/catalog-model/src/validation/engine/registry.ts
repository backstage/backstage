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

import { cfworkerSchemaEngine } from './cfworkerSchemaEngine';
import { SchemaEngine } from './types';

const ENGINE_KEY = Symbol.for('@backstage/catalog-model/schemaEngine');

type GlobalWithEngine = typeof globalThis & {
  [ENGINE_KEY]?: SchemaEngine;
};

/**
 * Returns the schema engine to use for validation. This is the interpreting
 * engine by default, which does not generate code at runtime and therefore
 * works under a strict Content Security Policy.
 */
export function getSchemaEngine(): SchemaEngine {
  return (globalThis as GlobalWithEngine)[ENGINE_KEY] ?? cfworkerSchemaEngine;
}

/**
 * Replaces the schema engine to use for validation, for the entire process.
 */
export function setSchemaEngine(engine: SchemaEngine): void {
  (globalThis as GlobalWithEngine)[ENGINE_KEY] = engine;
}
