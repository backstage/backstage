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
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

function isSchema(d: JSONSchema7Definition): d is JSONSchema7 {
  return typeof d === 'object';
}

export function inspectFunctionArgSchema(
  schema: JSONSchema7Definition,
): [schema: JSONSchema7Definition, required: boolean] {
  const hasOnlyKey = (k: string) => (o: any) =>
    k in o && Object.keys(o).every(ok => ok.startsWith('$') || ok === k);

  if (
    isSchema(schema) &&
    hasOnlyKey('anyOf')(schema) &&
    schema.anyOf?.length === 2
  ) {
    const alt0 = schema.anyOf[0];
    if (isSchema(alt0) && hasOnlyKey('not')(alt0)) {
      const not = alt0.not!;
      if (isSchema(not) && !Object.keys(not).length) {
        return [schema.anyOf[1], false];
      }
    }
  }
  return [schema, true];
}
