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
import 'reflect-metadata';
import { Injectable, TypeProvider } from 'graphql-modules';
import { FieldDirectiveMapper } from './types';

export function toPrivateProp(name: string) {
  return `__${name}_directive_mapper__`;
}

/** @public */
export function createDirectiveMapperProvider(
  name: string,
  mapper: FieldDirectiveMapper,
): TypeProvider<any> {
  return Injectable()(
    class {
      // @ts-expect-error a computed property mast be a simple literal type or a unique symbol
      static readonly [toPrivateProp(name)]: typeof mapper = mapper;
    },
  ) as TypeProvider<any>;
}
