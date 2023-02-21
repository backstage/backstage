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

describe('mapDirectives', () => {
  const transform = (source: DocumentNode) =>
    transformSchema([
      createModule({
        id: 'mapDirectives',
        typeDefs: source,
      }),
    ]);

  it('should add object type if empty @inherit directive is used', function* () {
    const schema = transform(gql`
      interface IEntity @inherit {
        totalCount: Int!
      }
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual(['type Entity implements IEntity {', '  totalCount: Int!', '}']);
  });

  it('should add object with name from `generatedTypeName` argument of @inherit directive', function* () {
    const schema = transform(gql`
      interface Entity @inherit(generatedTypeName: "NodeEntity") {
        totalCount: Int!
      }
    `);
    expect(
      printType(schema.getType('NodeEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type NodeEntity implements Entity {',
      '  totalCount: Int!',
      '}',
    ]);
  });

  it('should merge fields from interface in @inherit directive type', function* () {
    const schema = transform(gql`
      interface IEntity @inherit(interface: "Node") {
        name: String!
      }
    `);
    expect(
      printType(schema.getType('IEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IEntity implements Node {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
  });

  it('should add object type with merged fields from interfaces', function* () {
    const schema = transform(gql`
      interface IEntity @inherit(interface: "Node") {
        name: String!
      }
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type Entity implements IEntity & Node {',
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
    const schema = transform(gql`
      interface IComponent @inherit {
        name: String!
      }
      interface IResource @inherit {
        name: String!
      }

      union Entity = IComponent

      extend union Entity = IResource
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Entity = Component | Resource']);
  });

  it('should inherit a types sequence', function* () {
    const schema = transform(gql`
      interface IEntity @inherit(interface: "Node") {
        name: String!
      }
      interface IResource
        @inherit(interface: "IEntity", when: "kind", is: "Resource") {
        location: String!
      }
      interface IWebResource
        @inherit(interface: "IResource", when: "spec.type", is: "website") {
        url: String!
      }
      interface IExampleCom
        @inherit(
          interface: "IWebResource"
          when: "spec.url"
          is: "example.com"
        ) {
        example: String!
      }
    `);
    expect(
      printType(schema.getType('IExampleCom') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IExampleCom implements IWebResource & IResource & IEntity & Node {',
      '  id: ID!',
      '  name: String!',
      '  location: String!',
      '  url: String!',
      '  example: String!',
      '}',
    ]);
  });

  it('should fail if `at` argument of @field is not a valid type', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
          name: String! @field(at: 42)
        }
      `),
    ).toThrow(
      'The "at" argument of @field directive must be a string or an array of strings',
    );
  });

  it('should fail if `when` argument of @inherit is not a valid type', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit(when: 42, is: "answer") {
          name: String!
        }
      `),
    ).toThrow(
      'The "when" argument of @inherit directive must be a string or an array of strings',
    );
  });

  it('should fail if `when` argument is used without `is` in @inherit directive', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit(when: "kind") {
          name: String!
        }
      `),
    ).toThrow(
      'The @inherit directive for "IEntity" should have both "when" and "is" arguments or none of them',
    );
  });

  it("should fail if @inherit interface doesn't exist", function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit(interface: "NonExistingInterface") {
          name: String!
        }
      `),
    ).toThrow(
      `The interface "NonExistingInterface" described in the @inherit directive for "IEntity" interface is not declared in the schema`,
    );
  });

  it("should fail if @inherit interface isn't an interface", function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit(interface: "String") {
          name: String!
        }
      `),
    ).toThrow(
      `The type "String" described in the @inherit directive for "IEntity" interface is not an interface`,
    );
  });

  it('should fail if @inherit without when/is is used more than once', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit(interface: "Node") {
          name: String!
        }
        interface IComponent @inherit(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      `The @inherit directive of "Node" without "when" and "is" arguments could be used only once`,
    );
  });

  it(`should fail if inheriting interface doesn't meet naming criteria`, function* () {
    const getSchema = () =>
      transform(gql`
        interface Entity @inherit {
          name: String!
        }
      `);
    expect(getSchema).toThrow(
      `The interface name "Entity" should started from capitalized 'I', like: "IEntity"`,
    );
  });

  it(`should fail if "generatedTypeName" is declared`, function* () {
    const getSchema = () =>
      transform(gql`
        interface Entity @inherit(generatedTypeName: "EntityImpl") {
          name: String!
        }

        type EntityImpl implements Entity {
          name: String!
        }
      `);
    expect(getSchema).toThrow(
      `The type "EntityImpl" described in the @inherit directive for "Entity" interface is already declared in the schema`,
    );
  });

  it('should add resolver for @field directive', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface IEntity @inherit(interface: "Node") {
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
      node(id: "test") { ...on Entity { first, second, third } }
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
      component(id: "test") { name }
    `);
    expect(result).toEqual({
      component: {
        name: 'hello world',
      },
    });
  });
});
