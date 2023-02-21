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
import type { JsonObject } from '@backstage/types';
import type { Operation } from 'effection';

import { createGraphQLApp } from '@backstage/plugin-graphql-common';

import * as graphql from 'graphql';
import DataLoader from 'dataloader';
import { Module } from 'graphql-modules';
import { PromiseOrValue } from './types';
import { envelop, useEngine } from '@envelop/core';
import { useDataLoader } from '@envelop/dataloader';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { Relation } from './relation';

export function createGraphQLAPI(
  TestModule: Module,
  loader: () => DataLoader<any, any>,
) {
  const application = createGraphQLApp({
    modules: [Relation, TestModule],
  });

  const run = envelop({
    plugins: [
      useEngine(graphql),
      useGraphQLModules(application),
      useDataLoader('loader', loader),
    ],
  });

  return (query: string): Operation<JsonObject> => {
    return function* Query() {
      const { parse, validate, contextFactory, execute, schema } = run();
      const document = parse(`{ ${query} }`);
      const errors = validate(schema, document);
      if (errors.length) {
        throw errors[0];
      }
      const contextValue = yield* unwrap(contextFactory());

      const result = yield* unwrap(
        execute({
          schema: application.schema,
          document,
          contextValue,
        }),
      );
      if (result.errors) {
        throw result.errors[0];
      } else {
        return result.data as JsonObject;
      }
    };
  };
}

function isPromise<T>(x: PromiseOrValue<T>): x is Promise<T> {
  return typeof (x as Promise<T>).then === 'function';
}

function* unwrap<T>(promiseOrValue: PromiseOrValue<T> | Operation<T>): {
  [Symbol.iterator](): Iterator<Operation<T>, T, any>;
} {
  if (isPromise(promiseOrValue)) {
    return yield promiseOrValue;
  }
  return promiseOrValue as T;
}
