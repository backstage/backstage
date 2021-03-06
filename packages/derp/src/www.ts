/*
 * Copyright 2020 Spotify AB
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

type SchemaV1 = { schema: number; blah: string };
type SchemaV2 = { schema: number; something: 'else' };

type Schemas = {
  1: SchemaV1;
  2: SchemaV2;
  // 3: SchemaV3
};

type TestValue<S extends Schemas> = {
  someFunc<V extends keyof S>(version: V): S[V];
};

const allSchemas: Schemas = {
  1: { schema: 1, blah: 'hello' },
  2: { schema: 2, something: 'else' },
};

const value: TestValue<Schemas> = {
  someFunc(version) {
    if (allSchemas[version]) return allSchemas[version];

    throw new Error('???');
  },
};

const v1 = value.someFunc(1);
const v2 = value.someFunc(2);

function useValue(schema: Schemas) {}
