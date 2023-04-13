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
import { BatchLoadFn, GraphQLContext } from '@backstage/plugin-graphql-common';
import { Plugin } from 'graphql-yoga';
import { Options as DataLoaderOptions } from 'dataloader';
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface GraphQLYogaExtension {
  addPlugin(plugin: Plugin): void;
  addLoader(name: string, loader: BatchLoadFn<GraphQLContext>): void;
  setDataloaderOptions(options: DataLoaderOptions<string, any>): void;
  setContext<TContext extends Record<string, any>>(
    context:
      | ((initialContext: GraphQLContext) => TContext | Promise<TContext>)
      | Promise<TContext>
      | TContext,
  ): void;
}

/** @public */
export const graphqlYogaExtension = createExtensionPoint<GraphQLYogaExtension>({
  id: 'graphql.yoga',
});
