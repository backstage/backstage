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
import {
  Entity,
  EntityRelation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import type { Loader } from '../types';
import type { JsonObject } from '@backstage/types';
import type { Operation } from 'effection';
import type { Node } from '@frontside/graphgen';

import {
  envelop,
  EnvelopError,
  PromiseOrValue,
  useExtendContext,
} from '@envelop/core';
import { createGraphQLApp } from '../service';

import type { Factory, World } from '@frontside/graphgen-backstage';
import { createFactory } from '@frontside/graphgen-backstage';
import DataLoader from 'dataloader';
import { createApplication, Module } from 'graphql-modules';
import { transformDirectives } from '../service/mappers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Core } from '../modules/core/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useDataLoader } from '@envelop/dataloader';
import type { CatalogClient } from '@backstage/catalog-client';

export type CatalogApi = Pick<CatalogClient, 'getEntityByRef'>;

export interface GraphQLHarness {
  query(query: string): Operation<JsonObject>;
  create(...params: Parameters<Factory['create']>): string;
  all(...params: Parameters<Factory['all']>): ReturnType<Factory['all']>;
}

export function createGraphQLTestApp(
  TestModule: Module,
  loader: () => DataLoader<any, any>,
): (query: string) => Operation<JsonObject> {
  const application = createApplication({
    schemaBuilder: ({ typeDefs, resolvers }) =>
      transformDirectives(makeExecutableSchema({ typeDefs, resolvers })),
    modules: [Core, TestModule],
  });
  const run = envelop({
    plugins: [
      useGraphQLModules(application),
      useDataLoader('loader', loader),
      useExtendContext(() => ({ refToId: stringifyEntityRef })),
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
          schema,
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

export function createGraphQLAPI(): GraphQLHarness {
  const factory = createFactory();
  const catalog = createSimulatedCatalog(factory);
  const { run, application } = createGraphQLApp({
    plugins: [useExtendContext(() => ({ catalog }))],
    loader: () => createSimulatedLoader(catalog),
  });

  return {
    query(query: string): Operation<JsonObject> {
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
    },
    create(...params) {
      const node = factory.create(...params);

      return stringifyEntityRef({
        kind: node.__typename,
        name: node.name,
      });
    },
    all: factory.all,
  };
}

export function createSimulatedLoader(catalog: CatalogApi): Loader {
  return new DataLoader<string, Entity>(function fetch(
    refs,
  ): Promise<Array<Entity | Error>> {
    return Promise.all(
      refs.map(async ref => {
        const entity = await catalog.getEntityByRef(ref);
        return entity ?? new EnvelopError(`no such node with ref: '${ref}'`);
      }),
    );
  });
}

export function createSimulatedCatalog(factory: Factory): CatalogApi {
  return {
    async getEntityByRef(ref: string) {
      const all = concat<Node & World[keyof World]>(
        factory.all('Group'),
        factory.all('Component'),
        factory.all('System'),
        factory.all('API'),
        factory.all('Resource'),
        factory.all('User'),
      );
      for (const node of all) {
        const { __typename: kind, name } = node;

        const cmp = stringifyEntityRef({ kind, name });
        if (ref === cmp) {
          return nodeToEntity(node);
        }
      }
      return void 0;
    },
  };
}

function* concat<T>(...iterables: Iterable<T>[]): Iterable<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

export function nodeToEntity(node: World[keyof World]): Entity {
  const { name, __typename: kind } = node;
  const entity = {
    kind,
    apiVersion: 'backstage.io/v1beta1',
    metadata: {
      name,
      namespace: 'default',
      description: node.description,
    },
  } as Entity;
  if (node.__typename === 'Component') {
    const { type, lifecycle } = node;
    return {
      ...entity,
      spec: { type, lifecycle },
      relations: getRelations({
        ownedBy: node.owner,
        partOf: node.partOf,
        hasPart: node.subComponents,
        consumesApi: node.consumes,
        providesApi: node.provides,
        dependsOn: node.dependencies,
      }),
    };
  } else if (node.__typename === 'Group' || node.__typename === 'User') {
    const { displayName, email, picture } = node;
    return {
      ...entity,
      spec: {
        profile: {
          displayName,
          email,
          picture,
        },
      },
    };
  } else if (node.__typename === 'API') {
    return {
      ...entity,
      relations: getRelations({
        apiConsumedBy: node.consumedBy,
        apiProvidedBy: node.providedBy,
      }),
    };
  } else if (node.__typename === 'Domain') {
    const { metadata, ...rest } = entity;
    return {
      ...rest,
      metadata: {
        ...metadata,
        tags: node.tags,
        links: node.links,
      },
      spec: {
        owner: node.owner,
      },
    };
  } else if (kind === 'System') {
    return entity;
  }
  return entity;
}

export function getRelations(
  map: Record<string, World[keyof World] | World[keyof World][]>,
): EntityRelation[] {
  return Object.entries(map).reduce((relations, [type, content]) => {
    const targets = Array.isArray(content) ? content : [content];
    return relations.concat(
      targets.map(node => ({
        type,
        targetRef: stringifyEntityRef({
          kind: node.__typename,
          namespace: 'default',
          name: node.name,
        }),
      })),
    );
  }, [] as EntityRelation[]);
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
