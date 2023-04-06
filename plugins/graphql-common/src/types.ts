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
  GraphQLError,
  GraphQLFieldConfig,
  GraphQLNamedType,
  GraphQLObjectType,
} from 'graphql';
import { Application } from 'graphql-modules';

/** @public */
export interface NodeId {
  source: string;
  typename: string;
  ref: string;
}

/** @public */
export type BatchLoadFn<Context extends GraphQLContext> = (
  keys: ReadonlyArray<string>,
  context: Context,
) => PromiseLike<ArrayLike<any | GraphQLError>>;

/** @public */
export interface GraphQLContext {
  application: Application;
  encodeId: (obj: NodeId) => string;
  decodeId: (id: string) => NodeId;
}

/** @public */
export interface ResolverContext extends GraphQLContext {
  loader: DataLoader<any, any>;
}

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
) => void;

export interface NamedType {
  implements: string | null;
  discriminates: Set<string>;
}
