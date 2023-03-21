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
import { createApplication, Module } from 'graphql-modules';
import { Core } from './core';
import { transformSchema } from './transformSchema';
import { loadSchema } from './loadSchema';

/** @public */
export type createGraphQLAppOptions = {
  schema?: string | string[];
  modules?: Module[];
  generateOpaqueTypes?: boolean;
};

/** @public */
export function createGraphQLApp(options: createGraphQLAppOptions) {
  const modules = [Core, ...(options.modules ?? [])];
  if (options.schema) {
    modules.push(...loadSchema(options.schema));
  }
  return createApplication({
    schemaBuilder: _ =>
      transformSchema(modules, {
        generateOpaqueTypes: options.generateOpaqueTypes,
      }),
    modules,
  });
}
