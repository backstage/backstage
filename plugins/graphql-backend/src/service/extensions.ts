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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { GraphQLContext, BatchLoadFn } from '@backstage/plugin-graphql-common';
import { Module } from 'graphql-modules';
import { Plugin } from 'graphql-yoga';
import { Options as DataLoaderOptions } from 'dataloader';

export interface GraphQLSchemaExtensionPoint {
  addSchema(schema: string): void;
}

/** @public */
export const graphqlSchemaExtensionPoint =
  createExtensionPoint<GraphQLSchemaExtensionPoint>({
    id: 'graphql.schema',
  });

export interface GraphQLModuleExtensionPoint {
  addModule(
    module: (() => Module | Promise<Module>) | Module | Promise<Module>,
  ): void;
}

/** @public */
export const graphqlModuleExtensionPoint =
  createExtensionPoint<GraphQLModuleExtensionPoint>({
    id: 'graphql.module',
  });

export interface GraphQLPluginExtensionPoint {
  addPlugin(plugin: Plugin): void;
}

/** @public */
export const graphqlPluginExtensionPoint =
  createExtensionPoint<GraphQLPluginExtensionPoint>({
    id: 'graphql.plugin',
  });

// object
export interface GraphQLLoaderExtensionPoint {
  addLoader(name: string, loader: BatchLoadFn<GraphQLContext>): void;
  setDataloaderOptions(options: DataLoaderOptions<string, any>): void;
}

/** @public */
export const graphqlLoaderExtensionPoint =
  createExtensionPoint<GraphQLLoaderExtensionPoint>({
    id: 'graphql.loader',
  });

export interface GraphQLContextExtensionPoint {
  setContext<TContext extends Record<string, any>>(
    context:
      | ((initialContext: GraphQLContext) => TContext | Promise<TContext>)
      | Promise<TContext>
      | TContext,
  ): void;
}

/** @public */
export const graphqlContextExtensionPoint =
  createExtensionPoint<GraphQLContextExtensionPoint>({
    id: 'graphql.context',
  });
