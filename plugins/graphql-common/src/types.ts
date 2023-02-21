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
import { getDirective } from '@graphql-tools/utils';
import DataLoader from 'dataloader';
import {
  GraphQLFieldConfig,
  GraphQLNamedType,
  GraphQLObjectType,
} from 'graphql';
import { Application } from 'graphql-modules';

export type PromiseOrValue<T> = T | Promise<T>;

/** @public */
export interface ResolverContext {
  application: Application;
  loader: DataLoader<any, any>;
}

/** @public */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/** @public */
export type Logger = Record<LogLevel, (...args: any[]) => void>;

/** @public */
export type OmitFirst<T extends Array<any>> = T extends [
  x: any,
  ...args: infer R,
]
  ? R
  : [];

/** @public */
export interface DirectiveMapperAPI {
  getImplementingTypes: (interfaceName: string) => GraphQLObjectType[];
  getDirective: (
    ...args: OmitFirst<Parameters<typeof getDirective>>
  ) => ReturnType<typeof getDirective>;
  typeMap: Partial<Record<string, GraphQLNamedType>>;
}

/** @public */
export type FieldDirectiveMapper = (
  field: GraphQLFieldConfig<{ id: string }, ResolverContext>,
  directive: Record<string, any>,
  api: DirectiveMapperAPI,
  options?: { logger?: Logger },
) => void;
