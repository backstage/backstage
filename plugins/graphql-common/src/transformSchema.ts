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
import { mergeTypeDefs } from '@graphql-tools/merge';
import { TypeSource } from '@graphql-tools/utils';
import { buildASTSchema, validateSchema } from 'graphql';
import { coreSchema } from './core';
import { mapDirectives } from './mapDirectives';

/** @public */
export function transformSchema(source: TypeSource) {
  const schema = mapDirectives(
    buildASTSchema(mergeTypeDefs([coreSchema, source])),
  );
  const errors = validateSchema(schema);

  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join('\n'));
  }
  return schema;
}
