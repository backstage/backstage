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
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import DataLoader from 'dataloader';
import {
  buildASTSchema,
  DocumentNode,
  GraphQLNamedType,
  printType,
  validateSchema,
} from 'graphql';
import { createModule, gql } from 'graphql-modules';
import { transformDirectives } from '../service/mappers';
import { createGraphQLTestApp } from './setupTests';

describe('Transformer', () => {
  const graphqlHeader = loadFilesSync(
    require.resolve('../modules/core/core.graphql'),
  );
  const transformSchema = (source: DocumentNode) => {
    const schema = transformDirectives(
      buildASTSchema(mergeTypeDefs([source, graphqlHeader])),
    );
    const errors = validateSchema(schema);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join('\n'));
    }
    return schema;
  };

  it('should add object type if empty @extend directive is used', function* () {
    const schema = transformSchema(gql`
      interface IEntity @extend {
        totalCount: Int!
      }
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual(['type Entity implements IEntity {', '  totalCount: Int!', '}']);
  });

  it('should add object with name from `generatedTypeName` argument of @extend directive', function* () {
    const schema = transformSchema(gql`
      interface Entity @extend(generatedTypeName: "NodeEntity") {
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

  it('should merge fields from interface in @extend directive type', function* () {
    const schema = transformSchema(gql`
      interface IEntity @extend(interface: "Node") {
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
    const schema = transformSchema(gql`
      interface IEntity @extend(interface: "Node") {
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
    const schema = transformSchema(gql`
      interface Connection {
        foobar: String!
      }
    `);
    expect(
      printType(schema.getType('Connection') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Connection {',
      '  foobar: String!',
      '  pageInfo: PageInfo!',
      '  edges: [Edge!]!',
      '  count: Int',
      '}',
    ]);
  });

  it('should merge union types', function* () {
    const schema = transformSchema(gql`
      interface IComponent @extend {
        name: String!
      }
      interface IResource @extend {
        name: String!
      }

      union Entity = IComponent

      extend union Entity = IResource
    `);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Entity = Component | Resource']);
  });

  it('should add subtypes to a union type', function* () {
    const schema = transformSchema(gql`
      union Ownable = IEntity

      interface IEntity @extend {
        name: String!
      }
      interface IResource @extend(interface: "IEntity") {
        location: String!
      }
      interface IWebResource
        @extend(interface: "IResource", when: "spec.type", is: "website") {
        url: String!
      }
      interface IUser @extend {
        ownerOf: [Ownable!]! @relation
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Ownable = Entity | Resource | WebResource']);
  });

  it('should extend a types sequence', function* () {
    const schema = transformSchema(gql`
      interface IEntity @extend(interface: "Node") {
        name: String!
      }
      interface IResource
        @extend(interface: "IEntity", when: "kind", is: "Resource") {
        location: String!
      }
      interface IWebResource
        @extend(interface: "IResource", when: "spec.type", is: "website") {
        url: String!
      }
      interface IExampleCom
        @extend(
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

  it('should add arguments to the "Connection" type', function* () {
    const schema = transformSchema(gql`
      interface IGroup @extend(interface: "Node") {
        users: Connection @relation(name: "hasMember", nodeType: "IUser")
      }

      interface IUser @extend(interface: "Node", when: "kind", is: "User") {
        name: String!
      }
    `);
    expect(
      printType(schema.getType('IGroup') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IGroup implements Node {',
      '  id: ID!',
      '  users(first: Int, after: String, last: Int, before: String): UserConnection',
      '}',
    ]);
  });

  it('should override union type to interface if it has been used in a @relation directive with "Connection" type', function* () {
    const schema = transformSchema(gql`
      union Ownable = IEntity

      interface IEntity @extend(interface: "Node") {
        name: String!
      }
      interface IResource
        @extend(interface: "IEntity", when: "kind", is: "Resource") {
        location: String!
      }
      interface IUser @extend {
        owns: Connection @relation(name: "ownerOf", nodeType: "Ownable")
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['interface Ownable implements Node {', '  id: ID!', '}']);
    expect(
      printType(schema.getType('IEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IEntity implements Ownable & Node {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
    expect(
      printType(schema.getType('IResource') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IResource implements Ownable & IEntity & Node {',
      '  id: ID!',
      '  name: String!',
      '  location: String!',
      '}',
    ]);
    expect(
      printType(schema.getType('OwnableConnection') as GraphQLNamedType).split(
        '\n',
      ),
    ).toEqual([
      'type OwnableConnection implements Connection {',
      '  pageInfo: PageInfo!',
      '  edges: [OwnableEdge!]!',
      '  count: Int',
      '}',
    ]);
    expect(
      printType(schema.getType('IUser') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IUser {',
      '  owns(first: Int, after: String, last: Int, before: String): OwnableConnection',
      '}',
    ]);
  });

  it('should fail if `at` argument of @field is not a valid type', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          name: String! @field(at: 42)
        }
      `),
    ).toThrow(
      'The "at" argument of @field directive must be a string or an array of strings',
    );
  });

  it('should fail if `when` argument of @extend is not a valid type', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend(when: 42, is: "answer") {
          name: String!
        }
      `),
    ).toThrow(
      'The "when" argument of @extend directive must be a string or an array of strings',
    );
  });

  it('should fail if `when` argument is used without `is` in @extend directive', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend(when: "kind") {
          name: String!
        }
      `),
    ).toThrow(
      'The @extend directive for "IEntity" should have both "when" and "is" arguments or none of them',
    );
  });

  it("should fail if @relation interface doesn't exist", function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
        }
      `),
    ).toThrow(
      'Error while processing directives on field "owners" of "IEntity":\nThe interface "Owner" is not defined in the schema.',
    );
  });

  it('should fail if @relation interface is input type', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          owners: Connection @relation(name: "ownedBy", nodeType: "OwnerInput")
        }
        input OwnerInput {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing directives on field "owners" of "IEntity":\nThe interface "OwnerInput" is an input type and can't be used in a Connection.`,
    );
  });

  it("should fail if @extend interface doesn't exist", function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend(interface: "NonExistingInterface") {
          name: String!
        }
      `),
    ).toThrow(
      `The interface "NonExistingInterface" described in @extend directive for "IEntity" isn't abstract type or doesn't exist`,
    );
  });

  it("should fail if @extend interface isn't an interface", function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend(interface: "String") {
          name: String!
        }
      `),
    ).toThrow(
      `The interface "String" described in @extend directive for "IEntity" isn't abstract type or doesn't exist`,
    );
  });

  it('should fail if @extend interface is already implemented by the type', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity implements Node @extend(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      `The interface "Node" described in @extend directive for "IEntity" is already implemented by the type`,
    );
  });

  it('should fail if Connection type is in a list', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          owners: [Connection] @relation(name: "ownedBy", nodeType: "IOwner")
        }
        interface IOwner @extend {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing directives on field "owners" of "IEntity":\nIt's not possible to use a list of Connection type. Use either Connection type or list of specific type`,
    );
  });

  it('should fail if Connection has arguments are not valid types', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          owners(first: String!, after: Int!): Connection
            @relation(name: "ownedBy", nodeType: "IOwner")
        }
        interface IOwner @extend {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing directives on field "owners" of "IEntity":\nThe field has mandatory argument \"first\" with different type than expected. Expected: Int`,
    );
  });

  it('should fail if @relation and @field are used on the same field', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend {
          owners: Connection
            @relation(name: "ownedBy", nodeType: "IOwner")
            @field(at: "name")
        }
        interface IOwner @extend {
          name: String!
        }
      `),
    ).toThrow(
      `The field "owners" of "IEntity" type has both @field and @relation directives at the same time`,
    );
  });

  it('should fail if @extend without when/is is used more than once', function* () {
    expect(() =>
      transformSchema(gql`
        interface IEntity @extend(interface: "Node") {
          name: String!
        }
        interface IComponent @extend(interface: "Node") {
          name: String!
        }
      `),
    ).toThrow(
      `The @extend directive of "Node" without "when" and "is" arguments could be used only once`,
    );
  });

  it('should fail if subtype with required fields extends without when/is arguments from type without when/is arguments', function* () {
    const getSchema = () =>
      transformSchema(gql`
        interface IEntity @extend {
          name: String!
        }
        interface IResource @extend(interface: "IEntity") {
          location: String!
        }
        interface IWebResource @extend(interface: "IResource") {
          url: String!
        }
      `);
    expect(getSchema).toThrow(
      `The interface "IWebResource" has required fields and can't be extended from "IResource" without "when" and "is" arguments, because "IResource" has already been extended without them`,
    );
  });

  it(`should fail if extending interface doesn't meet naming criteria`, function* () {
    const getSchema = () =>
      transformSchema(gql`
        interface Entity @extend {
          name: String!
        }
      `);
    expect(getSchema).toThrow(
      `The interface name "Entity" should started from capitalized 'I', like: "IEntity"`,
    );
  });

  it(`should fail if "generatedTypeName" is declared`, function* () {
    const getSchema = () =>
      transformSchema(gql`
        interface Entity @extend(generatedTypeName: "EntityImpl") {
          name: String!
        }

        type EntityImpl implements Entity {
          name: String!
        }
      `);
    expect(getSchema).toThrow(
      `The type "EntityImpl" described in the @extend directive is already declared in the schema`,
    );
  });

  it('should add resolver for @field directive', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface IEntity @extend(interface: "Node") {
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
    const query = createGraphQLTestApp(TestModule, loader);
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

  it('should add resolver for @relation directive with single item', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface IEntity
          @extend(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: IUser @relation
          owner: IUser @relation(name: "ownedBy")
          group: IGroup @relation(name: "ownedBy", kind: "Group")
        }
        interface IUser @extend(interface: "Node", when: "kind", is: "User") {
          name: String! @field(at: "name")
        }
        interface IGroup @extend(interface: "Node", when: "kind", is: "Group") {
          name: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Entity',
      relations: [
        { type: 'ownedBy', targetRef: 'user:default/john' },
        { type: 'ownedBy', targetRef: 'group:default/team-a' },
      ],
    };
    const user = {
      kind: 'User',
      name: 'John',
    };
    const group = {
      kind: 'Group',
      name: 'Team A',
    };
    const loader = () =>
      new DataLoader(async ids =>
        ids.map(id => {
          if (id === 'user:default/john') return user;
          if (id === 'group:default/team-a') return group;
          return entity;
        }),
      );
    const query = createGraphQLTestApp(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: "entity") {
        ...on Entity {
          ownedBy { name }
          owner { name }
          group { name }
        }
      }
    `);
    expect(result).toEqual({
      node: {
        ownedBy: { name: 'John' },
        owner: { name: 'John' },
        group: { name: 'Team A' },
      },
    });
  });

  it('should add resolver for @relation directive with a list', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        union Owner = IUser | IGroup

        interface IEntity
          @extend(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: [Owner] @relation
          owners: [Owner] @relation(name: "ownedBy")
          users: [IUser] @relation(name: "ownedBy") # We intentionally don't specify kind here
          groups: [IGroup] @relation(name: "ownedBy", kind: "Group")
        }
        interface IUser @extend(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup @extend(interface: "Node", when: "kind", is: "Group") {
          groupname: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Entity',
      relations: [
        { type: 'ownedBy', targetRef: 'user:default/john' },
        { type: 'ownedBy', targetRef: 'group:default/team-b' },
        { type: 'ownedBy', targetRef: 'user:default/mark' },
        { type: 'ownedBy', targetRef: 'group:default/team-a' },
      ],
    };
    const john = { kind: 'User', name: 'John' };
    const mark = { kind: 'User', name: 'Mark' };
    const teamA = { kind: 'Group', name: 'Team A' };
    const teamB = { kind: 'Group', name: 'Team B' };
    const loader = () =>
      new DataLoader(async ids =>
        ids.map(id => {
          if (id === 'user:default/john') return john;
          if (id === 'user:default/mark') return mark;
          if (id === 'group:default/team-a') return teamA;
          if (id === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = createGraphQLTestApp(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: "entity") {
        ...on Entity {
          ownedBy { ...on User { username }, ...on Group { groupname } }
          owners { ...on Group { groupname }, ...on User { username } }
          users { username }
          groups { groupname }
        }
      }
    `);
    expect(result).toEqual({
      node: {
        ownedBy: [
          { username: 'John' },
          { groupname: 'Team B' },
          { username: 'Mark' },
          { groupname: 'Team A' },
        ],
        owners: [
          { username: 'John' },
          { groupname: 'Team B' },
          { username: 'Mark' },
          { groupname: 'Team A' },
        ],
        users: [
          { username: 'John' },
          { username: 'Team B' },
          { username: 'Mark' },
          { username: 'Team A' },
        ],
        groups: [{ groupname: 'Team B' }, { groupname: 'Team A' }],
      },
    });
  });

  it('should add resolver for @relation directive with a connection', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        union Owner = IUser | IGroup

        interface IEntity
          @extend(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: Connection @relation
          nodes: Connection @relation(name: "ownedBy")
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
          users: Connection @relation(name: "ownedBy", nodeType: "IUser") # We intentionally don't specify kind here
          groups: Connection
            @relation(name: "ownedBy", kind: "Group", nodeType: "IGroup")
        }
        interface IUser @extend(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup @extend(interface: "Node", when: "kind", is: "Group") {
          groupname: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Entity',
      relations: [
        { type: 'ownedBy', targetRef: 'user:default/john' },
        { type: 'ownedBy', targetRef: 'group:default/team-b' },
        { type: 'ownedBy', targetRef: 'user:default/mark' },
        { type: 'ownedBy', targetRef: 'group:default/team-a' },
      ],
    };
    const john = { kind: 'User', name: 'John' };
    const mark = { kind: 'User', name: 'Mark' };
    const teamA = { kind: 'Group', name: 'Team A' };
    const teamB = { kind: 'Group', name: 'Team B' };
    const loader = () =>
      new DataLoader(async ids =>
        ids.map(id => {
          if (id === 'user:default/john') return john;
          if (id === 'user:default/mark') return mark;
          if (id === 'group:default/team-a') return teamA;
          if (id === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = createGraphQLTestApp(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: "entity") {
        ...on Entity {
          ownedBy(first: 2) { edges { node { ...on User { username }, ...on Group { groupname } } } }
          nodes(first: 2, after: "YXJyYXljb25uZWN0aW9uOjE=") { edges { node { ...on Group { groupname }, ...on User { username } } } }
          owners(last: 2) { edges { node { id, ...on User { username } } } }
          users { count, edges { node { username } } }
          groups { edges { node { groupname } } }
        }
      }
    `);
    expect(result).toEqual({
      node: {
        ownedBy: {
          edges: [
            { node: { username: 'John' } },
            { node: { groupname: 'Team B' } },
          ],
        },
        nodes: {
          edges: [
            { node: { username: 'Mark' } },
            { node: { groupname: 'Team A' } },
          ],
        },
        owners: {
          edges: [
            { node: { id: 'user:default/mark', username: 'Mark' } },
            { node: { id: 'group:default/team-a' } },
          ],
        },
        users: {
          count: 4,
          edges: [
            { node: { username: 'John' } },
            { node: { username: 'Team B' } },
            { node: { username: 'Mark' } },
            { node: { username: 'Team A' } },
          ],
        },
        groups: {
          edges: [
            { node: { groupname: 'Team B' } },
            { node: { groupname: 'Team A' } },
          ],
        },
      },
    });
  });

  it('resolver for @relation without `type` argument should return all relations', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface IEntity
          @extend(interface: "Node", when: "kind", is: "Entity") {
          assets: [Node] @relation
        }
        interface IUser @extend(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup @extend(interface: "Node", when: "kind", is: "Group") {
          groupname: String! @field(at: "name")
        }
        interface IComponent
          @extend(interface: "Node", when: "kind", is: "Component") {
          name: String! @field(at: "name")
        }
        interface IResource
          @extend(interface: "Node", when: "kind", is: "Resource") {
          domain: String! @field(at: "name")
        }
      `,
    });
    const entity = {
      kind: 'Entity',
      relations: [
        { type: 'partOf', targetRef: 'resource:default/website' },
        { type: 'hasPart', targetRef: 'component:default/backend' },
        { type: 'ownedBy', targetRef: 'user:default/john' },
        { type: 'ownedBy', targetRef: 'group:default/team-b' },
      ],
    };
    const john = { kind: 'User', name: 'John' };
    const backend = { kind: 'Component', name: 'Backend' };
    const website = { kind: 'Resource', name: 'example.com' };
    const teamB = { kind: 'Group', name: 'Team B' };
    const loader = () =>
      new DataLoader(async ids =>
        ids.map(id => {
          if (id === 'user:default/john') return john;
          if (id === 'component:default/backend') return backend;
          if (id === 'resource:default/website') return website;
          if (id === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = createGraphQLTestApp(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: "entity") {
        ...on Entity {
          assets {
            id
            ...on User { username }
            ...on Group { groupname }
            ...on Component { name }
            ...on Resource { domain }
          }
        }
      }
    `);
    expect(result).toEqual({
      node: {
        assets: [
          { domain: 'example.com', id: 'resource:default/website' },
          { id: 'component:default/backend', name: 'Backend' },
          { id: 'user:default/john', username: 'John' },
          { groupname: 'Team B', id: 'group:default/team-b' },
        ],
      },
    });
  });
});
