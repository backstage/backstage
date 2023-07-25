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
import DataLoader, { Options } from 'dataloader';
import { GraphQLError } from 'graphql';
import { BatchLoadFn, NodeQuery, GraphQLContext } from './types';
import { decodeId } from './helpers';

/** @public */
export const createLoader = <TContext extends Record<string, any>>(
  loaders: Record<string, BatchLoadFn<TContext & GraphQLContext>>,
  options?: Options<string, any>,
) => {
  return (context: TContext & GraphQLContext): DataLoader<string, any> => {
    async function fetch(ids: readonly string[]) {
      const idsBySources = ids.map(decodeId).reduce(
        (
          s: Record<string, Map<number, NodeQuery | undefined>>,
          { source, query },
          index,
        ) => ({
          ...s,
          [source]: (s[source] ?? new Map()).set(index, query),
        }),
        {},
      );
      const result: any[] = [];
      await Promise.all(
        Object.entries(idsBySources).map(async ([source, queries]) => {
          const loader = loaders[source];
          if (!loader) {
            return queries.forEach(
              (_, key) =>
                (result[key] = new GraphQLError(
                  `There is no loader for the source: '${source}'`,
                )),
            );
          }
          const queryEntries = [...queries.entries()];
          const values = await loader(
            queryEntries.map(([, query]) => query),
            context,
          );
          return queryEntries.forEach(
            ([key], index) =>
              (result[key] = { __source: source, ...values[index] }),
          );
        }),
      );
      return result;
    }

    return new DataLoader(fetch, options);
  };
};
