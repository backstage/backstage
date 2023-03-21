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

/* eslint-disable func-names */
/* eslint-disable jest/no-standalone-expect */

import { describe, it } from '@effection/jest';
import DataLoader from 'dataloader';
import { DocumentNode, GraphQLNamedType, printType } from 'graphql';
import { createModule, gql } from 'graphql-modules';
import { createGraphQLAPI } from './setupTests';
import { transformSchema } from './transformSchema';
import { ResolverContext } from './types';

describe('mapDirectives', () => {
  const transform = (source: DocumentNode, generateOpaqueTypes?: boolean) =>
    transformSchema(
      [
        createModule({
          id: 'mapDirectives',
          typeDefs: source,
        }),
      ],
      { generateOpaqueTypes },
    );

  it('should add opaque object type if `generateOpaqueTypes` option is true', function* () {
    const schema = transform(
      gql`
        interface Entity @discriminates @implements(interface: "Node") {
          totalCount: Int!
        }
      `,
      true,
    );
    expect(
      printType(schema.getType('OpaqueEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type OpaqueEntity implements Entity & Node {',
      '  id: ID!',
      '  totalCount: Int!',
      '}',
    ]);
  });

  it('should add object with name from `opaqueType` argument of @discriminates directive', function* () {
    const schema = transform(
      gql`
        interface Entity
          @discriminates(opaqueType: "NodeEntity")
          @implements(interface: "Node") {
          totalCount: Int!
        }
      `,
      true,
    );
    expect(
      printType(schema.getType('NodeEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type NodeEntity implements Entity & Node {',
      '  id: ID!',
      '  totalCount: Int!',
      '}',
    ]);
  });

  it(`shouldn't generate opaque type if there is only one implementation with generateOpaqueTypes: true`, function* () {
    const schema = transform(
      gql`
        interface Entity @discriminates @implements(interface: "Node") {
          totalCount: Int!
        }
        type Component @implements(interface: "Entity") {
          totalCount: Int!
        }
      `,
      true,
    );
    expect(schema.getType('OpaqueEntity')).toBeUndefined();
    expect(schema.getType('Component')).toBeDefined();
  });

  it('should merge fields from interface in @implements directive type', function* () {
    const schema = transform(gql`
      interface Entity @implements(interface: "Node") {
        name: String!
      }
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Entity implements Node {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
  });

  it('should add object type with merged fields from interfaces', function* () {
    const schema = transform(
      gql`
        interface Entity @discriminates @implements(interface: "Node") {
          name: String!
        }
      `,
      true,
    );
    expect(
      printType(schema.getType('OpaqueEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type OpaqueEntity implements Entity & Node {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
  });

  it('should merge fields for basic types', function* () {
    const schema = transform(gql`
      interface Connection {
        foobar: String!
      }
    `);
    expect(
      printType(schema.getType('Connection') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Connection {',
      '  pageInfo: PageInfo!',
      '  edges: [Edge!]!',
      '  count: Int',
      '  foobar: String!',
      '}',
    ]);
  });

  it('should merge union types', function* () {
    const schema = transform(
      gql`
        extend interface Node @discriminates(with: "kind")

        interface Component @discriminates @implements(interface: "Node") {
          name: String!
        }
        interface Resource @discriminates @implements(interface: "Node") {
          name: String!
        }

        union Entity = Component

        extend union Entity = Resource
      `,
      true,
    );
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Entity = OpaqueComponent | OpaqueResource']);
  });

  it('should merge interface types', function* () {
    const schema = transform(
      gql`
        interface Entity @implements(interface: "Node") {
          name: String!
        }

        interface Component @implements(interface: "Entity") {
          type: String!
        }

        extend interface Component {
          location: String!
        }
      `,
      true,
    );
    expect(
      printType(schema.getType('Component') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Component implements Entity & Node {',
      '  id: ID!',
      '  name: String!',
      '  type: String!',
      '  location: String!',
      '}',
    ]);
  });

  it('should implements a types sequence', function* () {
    const schema = transform(gql`
      interface Entity
        @discriminates(with: "kind")
        @implements(interface: "Node") {
        name: String!
      }
      interface Resource
        @discriminates(with: "spec.type")
        @implements(interface: "Entity") {
        location: String!
      }
      interface Website
        @discriminates(with: "spec.url")
        @implements(interface: "Resource") {
        url: String!
      }
      type ExampleCom @implements(interface: "Website") {
        example: String!
      }
    `);
    expect(
      printType(schema.getType('ExampleCom') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type ExampleCom implements Website & Resource & Entity & Node {',
      '  id: ID!',
      '  name: String!',
      '  location: String!',
      '  url: String!',
      '  example: String!',
      '}',
    ]);
  });

  it('@discriminates directive is optional if there is only one implementation', function* () {
    const schema = transform(gql`
      interface Entity @implements(interface: "Node") {
        name: String!
      }
      interface Component @implements(interface: "Entity") {
        type: String!
      }
      type WebComponent @implements(interface: "Component") {
        url: String!
      }
    `);
    expect(
      printType(schema.getType('WebComponent') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type WebComponent implements Component & Entity & Node {',
      '  id: ID!',
      '  name: String!',
      '  type: String!',
      '  url: String!',
      '}',
    ]);
  });

  it(`it's possible to use "implements" keyword to declare implementations of external interfaces`, function* () {
    const schema = transform(gql`
      interface Entity @implements(interface: "Node") {
        name: String!
      }
      interface Foo {
        bar: String!
      }
      interface Component implements Foo @implements(interface: "Entity") {
        type: String!
      }
    `);
    expect(
      printType(schema.getType('Component') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Component implements Entity & Node & Foo {',
      '  bar: String!',
      '  id: ID!',
      '  name: String!',
      '  type: String!',
      '}',
    ]);
  });

  it('should fail if `at` argument of @field is not a valid type', function* () {
    expect(() =>
      transform(gql`
        interface Entity {
          name: String! @field(at: 42)
        }
      `),
    ).toThrow(
      'The "at" argument of @field directive must be a string or an array of strings',
    );
  });

  it('should fail if `with` argument of @discriminates is not a valid type', function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @discriminates(with: 42)
          @implements(interface: "Node") {
          name: String!
        }
        type Component @implements(interface: "Entity") {
          type: String!
        }
      `),
    ).toThrow(
      'The "with" argument in `interface Entity @discriminates(with: ...)` must be a string or an array of strings',
    );
  });

  it("should fail if @implements interface doesn't exist", function* () {
    expect(() =>
      transform(gql`
        interface Entity @implements(interface: "NonExistingInterface") {
          name: String!
        }
      `),
    ).toThrow(
      'The "NonExistingInterface" in `interface Entity @implements(interface: "NonExistingInterface")` is not defined in the schema',
    );
  });

  it("should fail if @implements interface isn't an interface", function* () {
    expect(() =>
      transform(gql`
        interface Entity @implements(interface: "String") {
          name: String!
        }
      `),
    ).toThrow(
      'The "String" in `interface Entity @implements(interface: "String")` is not an interface type',
    );
  });

  it('should fail if @discriminates without "with" and without opaque types', function* () {
    expect(() =>
      transform(gql`
        interface Entity @discriminates @implements(interface: "Node") {
          name: String!
        }
        type Component @implements(interface: "Entity") {
          type: String!
        }
      `),
    ).toThrow(
      'The "with" argument in `interface Entity @discriminates(with: ...)` must be specified if "generateOpaqueTypes" is false and "opaqueType" is not specified',
    );
  });

  it(`should fail if "opaqueType" is declared`, function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @discriminates(opaqueType: "EntityImpl")
          @implements(interface: "Node") {
          name: String!
        }

        type EntityImpl @implements(interface: "Entity") {
          name: String!
        }
      `),
    ).toThrow(
      'The "EntityImpl" type in `interface Entity @discriminates(opaqueType: "...")` is already declared in the schema',
    );
  });

  it(`should fail if type generated from "generateOpaqueTypes" is declared`, function* () {
    expect(() =>
      transform(
        gql`
          interface Entity @discriminates @implements(interface: "Node") {
            name: String!
          }

          type OpaqueEntity @implements(interface: "Entity") {
            name: String!
          }
        `,
        true,
      ),
    ).toThrow(
      'The "OpaqueEntity" type is already declared in the schema. Please specify a different name for a opaque type (eg. `interface Entity @discriminates(opaqueType: "...")`)',
    );
  });

  it(`should fail if @discriminationAlias has ambiguous types`, function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @implements(interface: "Node")
          @discriminates(with: "kind")
          @discriminationAlias(value: "component", type: "EntityComponent")
          @discriminationAlias(value: "component", type: "Component") {
          name: String!
        }

        type EntityComponent @implements(interface: "Entity") {
          name: String!
        }

        type Component @implements(interface: "Entity") {
          name: String!
        }
      `),
    ).toThrow(
      `The following discrimination aliases are ambiguous: "component" => "EntityComponent" | "Component"`,
    );
  });

  it(`should fail if @discriminationAlias has missing types`, function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @implements(interface: "Node")
          @discriminates(with: "kind")
          @discriminationAlias(value: "component", type: "EntityComponent") {
          name: String!
        }
        type Component @implements(interface: "Entity") {
          type: String!
        }
      `),
    ).toThrow(
      'Type(-s) "EntityComponent" in `interface Entity @discriminationAlias(value: ..., type: ...)` are not defined in the schema',
    );
  });

  it(`should fail if @discriminationAlias is used without @discriminates`, function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @implements(interface: "Node")
          @discriminationAlias(value: "component", type: "EntityComponent") {
          name: String!
        }
      `),
    ).toThrow(
      `The "Entity" interface has @discriminationAlias directive but doesn't have @discriminates directive`,
    );
  });

  it(`should fail if interface has multiple implementations and @discriminates is not specified`, function* () {
    expect(() =>
      transform(gql`
        interface Component @implements(interface: "Node") {
          name: String!
        }
        interface Resource @implements(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      `The "Node" interface has multiple implementations but doesn't have @discriminates directive`,
    );
  });

  it('should fail if Node with empty @discriminates has multiple implementations', function* () {
    expect(() =>
      transform(
        gql`
          extend interface Node @discriminates

          interface Component @discriminates @implements(interface: "Node") {
            name: String!
          }
          interface Resource @discriminates @implements(interface: "Node") {
            name: String!
          }
        `,
        true,
      ),
    ).toThrow(
      'The "with" argument in `interface Node @discriminates(with: ...)` must be specified if the interface has multiple implementations',
    );
  });

  it('should fail if interface with empty @discriminates has multiple implementations', function* () {
    expect(() =>
      transform(
        gql`
          interface Entity @discriminates @implements(interface: "Node") {
            name: String!
          }
          interface Component @discriminates @implements(interface: "Entity") {
            name: String!
          }
          interface Resource @discriminates @implements(interface: "Entity") {
            name: String!
          }
        `,
      ),
    ).toThrow(
      'The "with" argument in `interface Entity @discriminates(with: ...)` must be specified if the interface has multiple implementations',
    );
  });

  it('should fail if an interface is not in @implements chai', function* () {
    expect(() =>
      transform(gql`
        interface Entity @implements(interface: "Node") {
          name: String!
        }
        interface Component {
          name: String!
        }
        interface WebComponent @implements(interface: "Component") {
          name: String!
        }
      `),
    ).toThrow(
      'The following interfaces are not in @implements chain from "Node": WebComponent, Component',
    );
  });

  it('should fail if a type implements some interfaces without @implements directive', function* () {
    expect(() =>
      transform(gql`
        extend interface Node @discriminates(with: "kind")

        interface Entity @implements(interface: "Node") {
          name: String!
        }
        interface Component implements Entity @implements(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      'The "Component" interface implements some interface without @implements directive',
    );
  });

  it("should fail if an interface with @discriminates doesn't implement any interface", function* () {
    expect(() =>
      transform(gql`
        interface Entity @discriminates(with: "kind") {
          name: String!
        }
      `),
    ).toThrow(
      `The "Entity" interface has @discriminates directive but doesn't implement any interface`,
    );
  });

  it("should fail if an interface with @discriminates doesn't have any implementations and `generateOpaqueType` is false", function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @discriminates(with: "kind")
          @implements(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      `The "Entity" interface has @discriminates directive but doesn't have any implementations`,
    );
  });

  it('should fail if an interface with @discriminates has implementations without @implements directive', function* () {
    expect(() =>
      transform(gql`
        interface Entity
          @discriminates(with: "kind")
          @implements(interface: "Node") {
          name: String!
        }
        type Component implements Entity {
          id: ID!
          name: String!
          type: String!
        }
      `),
    ).toThrow(
      'The following type(-s) "Component" must implement "Entity" interface by using @implements directive',
    );
  });

  it('should add resolver for @field directive', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        type Entity @implements(interface: "Node") {
          first: String! @field(at: "metadata.name")
          second: String! @field(at: ["spec", "path.to.name"])
          third: String! @field(at: "nonexisting.path", default: "defaultValue")
        }
      `,
    });
    const entity = {
      metadata: { name: 'hello' },
      spec: { 'path.to.name': 'world' },
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(
        JSON.stringify({ source: 'Mock', typename: 'Entity', ref: 'test' }),
      )}) { ...on Entity { first, second, third } }
    `);
    expect(result).toEqual({
      node: {
        first: 'hello',
        second: 'world',
        third: 'defaultValue',
      },
    });
  });

  it('should add resolver for @field directive to a field of object type', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        type Component {
          name: String! @field(at: "metadata.name")
        }

        extend type Query {
          component(id: ID!): Component
        }
      `,
      resolvers: {
        Query: {
          component: (_: any, { id }: { id: string }) => ({ id }),
        },
      },
    });
    const entity = {
      metadata: { name: 'hello world' },
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      component(id: ${JSON.stringify(
        JSON.stringify({ source: 'Mock', typename: 'Component', ref: 'test' }),
      )}) { name }
    `);
    expect(result).toEqual({
      component: {
        name: 'hello world',
      },
    });
  });

  it('should resolve types by @discriminates directive', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface Entity
          @implements(interface: "Node")
          @discriminates(with: "kind")
          @discriminationAlias(value: "User", type: "Employee") {
          name: String! @field(at: "name")
        }

        interface Component
          @implements(interface: "Entity")
          @discriminates(opaqueType: "BaseComponent") {
          type: String! @field(at: "spec.type")
        }

        type Employee @implements(interface: "Entity") {
          jobTitle: String! @field(at: "spec.title")
        }

        type Location @implements(interface: "Entity") {
          address: String! @field(at: "spec.address")
        }
      `,
    });
    const component = {
      kind: 'Component',
      name: 'github-component',
      spec: { type: 'github' },
    };
    const employee = {
      kind: 'User',
      name: 'john-user',
      spec: { title: 'Developer' },
    };
    const location = {
      kind: 'Location',
      name: 'street-location',
      spec: { address: '123 Main St' },
    };
    const system = {
      kind: 'System',
      name: 'backend-system',
      spec: { type: 'backend' },
    };
    const loader = ({ decodeId }: ResolverContext) =>
      new DataLoader(async ids =>
        ids.map(id => {
          const { ref } = decodeId(id as string);
          if (ref === 'component:default/backend') return component;
          if (ref === 'employee:default/john') return employee;
          if (ref === 'location:default/home') return location;
          if (ref === 'system:default/production') return system;
          return null;
        }),
      );
    const query = createGraphQLAPI(TestModule, loader, true);
    const queryNode = (id: { source: string; typename: string; ref: string }) =>
      query(/* GraphQL */ `
        node(id: ${JSON.stringify(JSON.stringify(id))}) {
          id
          ...on Entity {
            name
            ...on Employee { jobTitle }
            ...on Location { address }
            ...on Component { type }
          }
        }
      `);
    const componentResult = yield queryNode({
      source: 'Mock',
      typename: 'Node',
      ref: 'component:default/backend',
    });
    const employeeResult = yield queryNode({
      source: 'Mock',
      typename: 'Node',
      ref: 'employee:default/john',
    });
    const locationResult = yield queryNode({
      source: 'Mock',
      typename: 'Node',
      ref: 'location:default/home',
    });
    const systemResult = yield queryNode({
      source: 'Mock',
      typename: 'Node',
      ref: 'system:default/production',
    });
    expect(componentResult).toEqual({
      node: {
        id: '{"source":"Mock","typename":"Node","ref":"component:default/backend"}',
        name: 'github-component',
        type: 'github',
      },
    });
    expect(employeeResult).toEqual({
      node: {
        id: '{"source":"Mock","typename":"Node","ref":"employee:default/john"}',
        name: 'john-user',
        jobTitle: 'Developer',
      },
    });
    expect(locationResult).toEqual({
      node: {
        id: '{"source":"Mock","typename":"Node","ref":"location:default/home"}',
        name: 'street-location',
        address: '123 Main St',
      },
    });
    expect(systemResult).toEqual({
      node: {
        id: '{"source":"Mock","typename":"Node","ref":"system:default/production"}',
        name: 'backend-system',
      },
    });
  });

  it('should fail if discriminated value is not a string', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        type Entity @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 42,
      name: 'hello',
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const id = JSON.stringify({
      source: 'Mock',
      typename: 'Entity',
      ref: 'test',
    });
    let error: Error;

    try {
      yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(id)}) { ...on Entity { name } }
    `);
    } catch (e) {
      error = e;
    }
    expect(() => {
      if (error) throw error;
    }).toThrow(
      `Can't resolve type for node with "${id}" id. The \`42\` value which was discriminated by Node interface must be a string`,
    );
  });

  it('should fail if discriminated type is not defined in the schema', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        type Entity @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Unknown',
      name: 'hello',
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const id = JSON.stringify({
      source: 'Mock',
      typename: 'Entity',
      ref: 'test',
    });
    let error: Error;

    try {
      yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(id)}) { ...on Entity { name } }
    `);
    } catch (e) {
      error = e;
    }
    expect(() => {
      if (error) throw error;
    }).toThrow(
      `Can't resolve type for node with "${id}" id. The "Unknown" type which was discriminated by Node interface is not defined in the schema`,
    );
  });

  it('should fail if discriminated type is not an object or interface', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        type Component @implements(interface: "Node") {
          name: String! @field(at: "name")
        }

        union Entity = Component
      `,
    });
    const entity = {
      kind: 'Entity',
      name: 'hello',
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const id = JSON.stringify({
      source: 'Mock',
      typename: 'Entity',
      ref: 'test',
    });
    let error: Error;

    try {
      yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(id)}) { ...on Component { name } }
    `);
    } catch (e) {
      error = e;
    }
    expect(() => {
      if (error) throw error;
    }).toThrow(
      `Can't resolve type for node with "${id}" id. The "Entity" type which was discriminated by Node interface is not an object type or interface`,
    );
  });

  it('should fail if discriminated type is does not implement the interface', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind") {
          name: String! @field(at: "name")
        }

        interface Entity
          @implements(interface: "Node")
          @discriminates(with: "type") {
          name: String! @field(at: "name")
        }

        type Resource @implements(interface: "Entity") {
          name: String! @field(at: "name")
        }

        type Component @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Entity',
      type: 'Component',
      name: 'hello',
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const id = JSON.stringify({
      source: 'Mock',
      typename: 'Entity',
      ref: 'test',
    });
    let error: Error;

    try {
      yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(id)}) { name }
    `);
    } catch (e) {
      error = e;
    }
    expect(() => {
      if (error) throw error;
    }).toThrow(
      `Can't resolve type for node with "${id}" id. The "Component" type which was discriminated by Entity interface does not implement the "Entity" interface`,
    );
  });

  it('should fail if discriminated type is not an object or interface', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind") {
          name: String! @field(at: "name")
        }

        type Resource @implements(interface: "Node") {
          name: String! @field(at: "name")
        }

        type Component @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Component',
      name: 'hello',
    };
    const loader = () => new DataLoader(async () => [entity]);
    const query = createGraphQLAPI(TestModule, loader);
    const id = JSON.stringify({
      source: 'Mock',
      typename: 'Resource',
      ref: 'test',
    });
    let error: Error;

    try {
      yield query(/* GraphQL */ `
      node(id: ${JSON.stringify(id)}) { name }
    `);
    } catch (e) {
      error = e;
    }
    expect(() => {
      if (error) throw error;
    }).toThrow(
      `Can't resolve type for node with "${id}" id. The "Component" type which was discriminated by Node interface does not equal to the encoded type "Resource" or implement it`,
    );
  });
});
