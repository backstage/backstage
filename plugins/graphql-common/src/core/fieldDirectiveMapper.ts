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
import { get } from 'lodash';
import { GraphQLFieldConfig } from 'graphql';
import { ResolverContext } from '../types';

export function fieldDirectiveMapper(
  field: GraphQLFieldConfig<{ id: string }, ResolverContext>,
  directive: Record<string, any>,
) {
  if (
    'at' in directive &&
    typeof directive.at !== 'string' &&
    (!Array.isArray(directive.at) ||
      directive.at.some(a => typeof a !== 'string'))
  ) {
    throw new Error(
      `The "at" argument of @field directive must be a string or an array of strings`,
    );
  }
  field.resolve = async ({ id }, _, { loader }) => {
    const entity = await loader.load(id);
    if (!entity) return null;
    return get(entity, directive.at) ?? directive.default;
  };
}
