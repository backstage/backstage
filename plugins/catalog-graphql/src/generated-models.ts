/*
 * Copyright 2020 Spotify AB
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
import { GraphQLResolveInfo } from 'graphql';
import { ModuleContext } from '@graphql-modules/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type EntityMetadataAnnotation = {
  __typename?: 'EntityMetadataAnnotation';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type EntityMetadata = {
  __typename?: 'EntityMetadata';
  name: Scalars['String'];
  namespace?: Maybe<Scalars['String']>;
  annotation?: Maybe<EntityMetadataAnnotation>;
  annotations: Array<EntityMetadataAnnotation>;
};

export type EntityMetadataAnnotationArgs = {
  name?: Maybe<Scalars['String']>;
};

export type CatalogEntity = {
  __typename?: 'CatalogEntity';
  apiVersion?: Maybe<Scalars['String']>;
  kind: Scalars['String'];
  metadata?: Maybe<EntityMetadata>;
};

export type CatalogQuery = {
  __typename?: 'CatalogQuery';
  list: Array<CatalogEntity>;
};

export type Query = {
  __typename?: 'Query';
  catalog: CatalogQuery;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  EntityMetadataAnnotation: ResolverTypeWrapper<EntityMetadataAnnotation>;
  String: ResolverTypeWrapper<Scalars['String']>;
  EntityMetadata: ResolverTypeWrapper<EntityMetadata>;
  CatalogEntity: ResolverTypeWrapper<CatalogEntity>;
  CatalogQuery: ResolverTypeWrapper<CatalogQuery>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  EntityMetadataAnnotation: EntityMetadataAnnotation;
  String: Scalars['String'];
  EntityMetadata: EntityMetadata;
  CatalogEntity: CatalogEntity;
  CatalogQuery: CatalogQuery;
  Query: {};
  Boolean: Scalars['Boolean'];
};

export type EntityMetadataAnnotationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes['EntityMetadataAnnotation'] = ResolversParentTypes['EntityMetadataAnnotation']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EntityMetadataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes['EntityMetadata'] = ResolversParentTypes['EntityMetadata']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namespace?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  annotation?: Resolver<
    Maybe<ResolversTypes['EntityMetadataAnnotation']>,
    ParentType,
    ContextType,
    RequireFields<EntityMetadataAnnotationArgs, never>
  >;
  annotations?: Resolver<
    Array<ResolversTypes['EntityMetadataAnnotation']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CatalogEntityResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes['CatalogEntity'] = ResolversParentTypes['CatalogEntity']
> = {
  apiVersion?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  kind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<
    Maybe<ResolversTypes['EntityMetadata']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CatalogQueryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes['CatalogQuery'] = ResolversParentTypes['CatalogQuery']
> = {
  list?: Resolver<
    Array<ResolversTypes['CatalogEntity']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  catalog?: Resolver<ResolversTypes['CatalogQuery'], ParentType, ContextType>;
};

export type Resolvers<ContextType = ModuleContext> = {
  EntityMetadataAnnotation?: EntityMetadataAnnotationResolvers<ContextType>;
  EntityMetadata?: EntityMetadataResolvers<ContextType>;
  CatalogEntity?: CatalogEntityResolvers<ContextType>;
  CatalogQuery?: CatalogQueryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
