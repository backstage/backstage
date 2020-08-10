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
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ModuleContext } from '@graphql-modules/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  JSONObject: any;
};



export type EntityMetadata = {
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
};


export type EntityMetadataAnnotationArgs = {
  name: Scalars['String'];
};


export type EntityMetadataLabelArgs = {
  name: Scalars['String'];
};

export type ComponentMetadata = EntityMetadata & {
  __typename?: 'ComponentMetadata';
  relationships: Scalars['String'];
};

export type TemplateMetadata = EntityMetadata & {
  __typename?: 'TemplateMetadata';
  updatedBy: Scalars['String'];
};

export type DefaultEntityMetadata = EntityMetadata & {
  __typename?: 'DefaultEntityMetadata';
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
  updatedBy: Scalars['String'];
};


export type DefaultEntityMetadataAnnotationArgs = {
  name: Scalars['String'];
};


export type DefaultEntityMetadataLabelArgs = {
  name: Scalars['String'];
};

export type CatalogEntity = {
  __typename?: 'CatalogEntity';
  apiVersion: Scalars['String'];
  kind: Scalars['String'];
  metadata: EntityMetadata;
};

export type CatalogQuery = {
  __typename?: 'CatalogQuery';
  list: Array<CatalogEntity>;
};

export type Query = {
  __typename?: 'Query';
  catalog: CatalogQuery;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
  JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
  EntityMetadata: ResolversTypes['ComponentMetadata'] | ResolversTypes['TemplateMetadata'] | ResolversTypes['DefaultEntityMetadata'];
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  ComponentMetadata: ResolverTypeWrapper<Partial<ComponentMetadata>>;
  TemplateMetadata: ResolverTypeWrapper<Partial<TemplateMetadata>>;
  DefaultEntityMetadata: ResolverTypeWrapper<Partial<DefaultEntityMetadata>>;
  CatalogEntity: ResolverTypeWrapper<Partial<CatalogEntity>>;
  CatalogQuery: ResolverTypeWrapper<Partial<CatalogQuery>>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  JSON: Partial<Scalars['JSON']>;
  JSONObject: Partial<Scalars['JSONObject']>;
  EntityMetadata: ResolversParentTypes['ComponentMetadata'] | ResolversParentTypes['TemplateMetadata'] | ResolversParentTypes['DefaultEntityMetadata'];
  String: Partial<Scalars['String']>;
  Int: Partial<Scalars['Int']>;
  ComponentMetadata: Partial<ComponentMetadata>;
  TemplateMetadata: Partial<TemplateMetadata>;
  DefaultEntityMetadata: Partial<DefaultEntityMetadata>;
  CatalogEntity: Partial<CatalogEntity>;
  CatalogQuery: Partial<CatalogQuery>;
  Query: {};
  Boolean: Partial<Scalars['Boolean']>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type EntityMetadataResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['EntityMetadata'] = ResolversParentTypes['EntityMetadata']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ComponentMetadata' | 'TemplateMetadata' | 'DefaultEntityMetadata', ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<EntityMetadataAnnotationArgs, 'name'>>;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<EntityMetadataLabelArgs, 'name'>>;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ComponentMetadataResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['ComponentMetadata'] = ResolversParentTypes['ComponentMetadata']> = ResolversObject<{
  relationships?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TemplateMetadataResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['TemplateMetadata'] = ResolversParentTypes['TemplateMetadata']> = ResolversObject<{
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type DefaultEntityMetadataResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['DefaultEntityMetadata'] = ResolversParentTypes['DefaultEntityMetadata']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<DefaultEntityMetadataAnnotationArgs, 'name'>>;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<DefaultEntityMetadataLabelArgs, 'name'>>;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type CatalogEntityResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['CatalogEntity'] = ResolversParentTypes['CatalogEntity']> = ResolversObject<{
  apiVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['EntityMetadata'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type CatalogQueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['CatalogQuery'] = ResolversParentTypes['CatalogQuery']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['CatalogEntity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  catalog?: Resolver<ResolversTypes['CatalogQuery'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ModuleContext> = ResolversObject<{
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  EntityMetadata?: EntityMetadataResolvers<ContextType>;
  ComponentMetadata?: ComponentMetadataResolvers<ContextType>;
  TemplateMetadata?: TemplateMetadataResolvers<ContextType>;
  DefaultEntityMetadata?: DefaultEntityMetadataResolvers<ContextType>;
  CatalogEntity?: CatalogEntityResolvers<ContextType>;
  CatalogQuery?: CatalogQueryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
