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

import { JsonObject } from '@backstage/types';

/** @public */
export type PortableSchema<TOutput = unknown, TInput = TOutput> = {
  parse: (input: TInput) => TOutput;
  /**
   * The JSON Schema for this portable schema.
   *
   * @remarks
   * Can be accessed as a property for backward compatibility (returns the
   * JSON Schema object directly), or called as a method which returns
   * `{ schema: JsonObject }`. Both forms compute the schema lazily on
   * first access. The property form is deprecated — prefer `schema()`.
   */
  schema: { (): { schema: JsonObject }; [key: string]: any };
};
