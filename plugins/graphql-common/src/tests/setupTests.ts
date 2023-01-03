import { Entity, EntityRelation, stringifyEntityRef } from '@backstage/catalog-model';
import type { Loader } from '../app/types';
import type { JsonObject } from '@backstage/types';
import type { Operation } from 'effection';
import type { Node } from '@frontside/graphgen';

import { envelop, EnvelopError, PromiseOrValue, useExtendContext } from '@envelop/core';
import { createGraphQLApp } from '..';

import type { Factory, World } from '@frontside/graphgen-backstage';
import { createFactory } from '@frontside/graphgen-backstage';
import DataLoader from 'dataloader';
import { createApplication, Module } from 'graphql-modules';
import { transformDirectives } from '../app/mappers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Core } from '../app/modules/core/core';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useDataLoader } from '@envelop/dataloader';
import type { CatalogClient } from '@backstage/catalog-client';

export type CatalogApi = Pick<CatalogClient, "getEntityByRef">;

export interface GraphQLHarness {
  query(query: string): Operation<JsonObject>;
  create(...params: Parameters<Factory["create"]>): string;
  all(...params: Parameters<Factory["all"]>): ReturnType<Factory["all"]>;
}

export function createGraphQLTestApp(TestModule: Module, loader: () => DataLoader<any, any>): (query: string) => Operation<JsonObject> {
  const application = createApplication({
    schemaBuilder: ({ typeDefs, resolvers }) =>
      transformDirectives(
        makeExecutableSchema({ typeDefs, resolvers }),
      ),
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
      let document = parse(`{ ${query} }`);
      let errors = validate(schema, document);
      if (errors.length) {
        throw errors[0];
      }
      let contextValue = yield* unwrap(contextFactory());

      let result = yield* unwrap(execute({
        schema,
        document,
        contextValue,
      }));
      if (result.errors) {
        throw result.errors[0];
      } else {
        return result.data as JsonObject
      }
    }
  }
}

export function createGraphQLAPI(): GraphQLHarness {
  let factory = createFactory();
  let catalog = createSimulatedCatalog(factory)
  let { run, application } = createGraphQLApp({
    plugins: [useExtendContext(() => ({ catalog }))],
    loader: () => createSimulatedLoader(catalog),
  });

  return {
    query(query: string): Operation<JsonObject> {
      return function* Query() {
        const { parse, validate, contextFactory, execute, schema } = run();
        let document = parse(`{ ${query} }`);
        let errors = validate(schema, document);
        if (errors.length) {
          throw errors[0];
        }
        let contextValue = yield* unwrap(contextFactory());

        let result = yield* unwrap(execute({
          schema: application.schema,
          document,
          contextValue,
        }));
        if (result.errors) {
          throw result.errors[0];
        } else {
          return result.data as JsonObject
        }
      }
    },
    create(...params) {
      let node = factory.create(...params);

      return stringifyEntityRef({
        kind: node.__typename,
        name: node.name
      });
    },
    all: factory.all,
  };
}

export function createSimulatedLoader(catalog: CatalogApi): Loader {
  return new DataLoader<string, Entity>(function fetch(refs): Promise<Array<Entity | Error>> {
    return Promise.all(refs.map(async ref => {
      let entity = await catalog.getEntityByRef(ref);
      return entity ?? new EnvelopError(`no such node with ref: '${ref}'`);
    }));
  });
}

export function createSimulatedCatalog(factory: Factory): CatalogApi {
  return {
    async getEntityByRef(ref: string) {
      let all = concat<Node & World[keyof World]>(
        factory.all('Group'),
        factory.all('Component'),
        factory.all('System'),
        factory.all('API'),
        factory.all('Resource'),
        factory.all('User'),
      );
      for (let node of all) {
        let { __typename: kind, name } = node;

        let cmp = stringifyEntityRef({ kind, name });
        if (ref === cmp) {
          return nodeToEntity(node);
        }
      }
      return void 0;
    }
  }
}

function* concat<T>(...iterables: Iterable<T>[]): Iterable<T> {
  for (let iterable of iterables) {
    yield* iterable;
  }
}

export function nodeToEntity(node: World[keyof World]): Entity {
  let { name, __typename: kind } = node;
  let entity = {
    kind,
    apiVersion: 'backstage.io/v1beta1',
    metadata: {
      name,
      namespace: 'default',
      description: node.description,
    }
  } as Entity;
  if (node.__typename === "Component") {
    let { type, lifecycle } = node;
    return {
      ...entity,
      spec: { type, lifecycle },
      relations: relations({
        ownedBy: node.owner,
        partOf: node.partOf,
        hasPart: node.subComponents,
        consumesApi: node.consumes,
        providesApi: node.provides,
        dependsOn: node.dependencies,
      }),
    }
  } else if (node.__typename === "Group" || node.__typename === "User") {
    let { displayName, email, picture } = node;
    return {
      ...entity,
      spec: {
        profile: {
          displayName,
          email,
          picture,
        }
      }
    }
  } else if (node.__typename === "API") {
    return {
      ...entity,
      relations: relations({
        apiConsumedBy: node.consumedBy,
        apiProvidedBy: node.providedBy,
      })
    };
  } else if (node.__typename === 'Domain') {
    const { metadata, ...rest } = entity;
    return {
      ...rest,
      metadata: {
        ...metadata,
        tags: node.tags,
        links: node.links
      },
      spec: {
        owner: node.owner
      }
    }
  } else if (kind === "System") {
    return entity;
  } else {
    return entity;
  }
}

export function relations(map: Record<string, World[keyof World] | World[keyof World][]>): EntityRelation[] {
  return Object.entries(map).reduce((relations, [type, content]) => {
    let targets = Array.isArray(content) ? content : [content];
    return relations.concat(targets.map(node => ({
      type,
      targetRef: stringifyEntityRef({
        kind: node.__typename,
        namespace: 'default',
        name: node.name,
      })
    })));
  }, [] as EntityRelation[]);
}

function isPromise<T>(x: PromiseOrValue<T>): x is Promise<T> {
  return typeof (x as Promise<T>).then === 'function';
}

function* unwrap<T>(promiseOrValue: PromiseOrValue<T> | Operation<T>): { [Symbol.iterator](): Iterator<Operation<T>, T, any> } {
  if (isPromise(promiseOrValue)) {
    return yield promiseOrValue;
  } else {
    return promiseOrValue as T;
  }
}
