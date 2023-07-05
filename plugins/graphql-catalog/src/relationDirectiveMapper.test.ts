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
  CoreSync,
  transformSchema,
  encodeId,
  decodeId,
} from '@backstage/plugin-graphql-common';
import DataLoader from 'dataloader';
import { DocumentNode, GraphQLNamedType, printType } from 'graphql';
import { createModule, gql } from 'graphql-modules';
import { createGraphQLAPI } from './__testUtils__';
import { RelationSync } from './relation/relation';

describe('mapRelationDirective', () => {
  const transform = (source: DocumentNode) =>
    transformSchema([
      CoreSync(),
      RelationSync(),
      createModule({
        id: 'mapRelationDirective',
        typeDefs: source,
      }),
    ]);

  it('should add subtypes to a union type', () => {
    const schema = transform(gql`
      union Ownable = Entity

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
      type Database @implements(interface: "Resource") {
        credentials: String!
      }
      type Website @implements(interface: "Resource") {
        url: String!
      }
      type User {
        ownerOf: [Ownable!]! @relation
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Ownable = Database | Website']);
  });

  it('should add arguments to the "Connection" type', () => {
    const schema = transform(gql`
      extend interface Node @discriminates(with: "kind")

      interface Group @implements(interface: "Node") {
        users: Connection @relation(name: "hasMember", nodeType: "User")
      }

      type User @implements(interface: "Node") {
        name: String!
      }
    `);
    expect(
      printType(schema.getType('Group') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Group implements Node {',
      '  id: ID!',
      '  users(first: Int, after: String, last: Int, before: String): UserConnection',
      '}',
    ]);
  });

  it('should override union type to interface if it has been used in a @relation directive with "Connection" type', () => {
    const schema = transform(gql`
      union Ownable = Entity

      interface Entity
        @discriminates(with: "kind")
        @implements(interface: "Node") {
        name: String!
      }
      type Resource @implements(interface: "Entity") {
        location: String!
      }
      type User @implements(interface: "Entity") {
        owns: Connection @relation(name: "ownerOf", nodeType: "Ownable")
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['interface Ownable implements Node {', '  id: ID!', '}']);
    expect(
      printType(schema.getType('Entity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface Entity implements Node & Ownable {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
    expect(
      printType(schema.getType('Resource') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type Resource implements Entity & Node & Ownable {',
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
      printType(schema.getType('User') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'type User implements Entity & Node & Ownable {',
      '  id: ID!',
      '  name: String!',
      '  owns(first: Int, after: String, last: Int, before: String): OwnableConnection',
      '}',
    ]);
  });

  it("should fail if @relation interface doesn't exist", () => {
    expect(() =>
      transform(gql`
        interface Entity {
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
        }
      `),
    ).toThrow(
      'Error while processing relation directive on the field "owners" of "Entity":\nThe interface "Owner" is not defined in the schema',
    );
  });

  it('should fail if @relation interface is input type', () => {
    expect(() =>
      transform(gql`
        interface Entity {
          owners: Connection @relation(name: "ownedBy", nodeType: "OwnerInput")
        }
        input OwnerInput {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing relation directive on the field "owners" of "Entity":\nThe interface "OwnerInput" is an input type and can't be used in a Connection`,
    );
  });

  it('should fail if Connection type is in a list', () => {
    expect(() =>
      transform(gql`
        interface Entity {
          owners: [Connection] @relation(name: "ownedBy", nodeType: "Owner")
        }
        interface Owner {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing relation directive on the field "owners" of "Entity":\nIt's not possible to use a list of Connection type. Use either Connection type or list of specific type`,
    );
  });

  it('should fail if Connection has arguments are not valid types', () => {
    expect(() =>
      transform(gql`
        interface Entity {
          owners(first: String!, after: Int!): Connection
            @relation(name: "ownedBy", nodeType: "Owner")
        }
        interface Owner {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing relation directive on the field "owners" of "Entity":\nThe field has mandatory argument \"first\" with different type than expected. Expected: Int`,
    );
  });

  it('should fail if @relation and @field are used on the same field', () => {
    expect(() =>
      transform(gql`
        interface Entity {
          owners: Connection
            @relation(name: "ownedBy", nodeType: "Owner")
            @field(at: "name")
        }
        interface Owner {
          name: String!
        }
      `),
    ).toThrow(
      `It's ambiguous how to resolve the field "owners" of "Entity" type with more than one directives on it`,
    );
  });

  it('should add resolver for @relation directive with single item', async () => {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        type Entity @implements(interface: "Node") {
          ownedBy: User @relation
          owner: User @relation(name: "ownedBy")
          group: Group @relation(name: "ownedBy", kind: "Group")
        }
        type User @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
        type Group @implements(interface: "Node") {
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
          const { query: { ref } = {} } = decodeId(id as string);
          if (ref === 'user:default/john') return user;
          if (ref === 'group:default/team-a') return group;
          return entity;
        }),
      );
    const query = await createGraphQLAPI(TestModule, loader);
    const result = await query(/* GraphQL */ `
      node(id: ${JSON.stringify(
        encodeId({
          source: 'Mock',
          typename: 'Entity',
          query: { ref: 'entity' },
        }),
      )}) {
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

  it('should add resolver for @relation directive with a list', async () => {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        union Owner = User | Group

        type Entity @implements(interface: "Node") {
          ownedBy: [Owner] @relation
          owners: [Owner] @relation(name: "ownedBy")
          users: [User] @relation(name: "ownedBy") # We intentionally don't specify kind here
          groups: [Group] @relation(name: "ownedBy", kind: "Group")
        }
        type User @implements(interface: "Node") {
          username: String! @field(at: "name")
        }
        type Group @implements(interface: "Node") {
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
          const { query: { ref } = {} } = decodeId(id as string);
          if (ref === 'user:default/john') return john;
          if (ref === 'user:default/mark') return mark;
          if (ref === 'group:default/team-a') return teamA;
          if (ref === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = await createGraphQLAPI(TestModule, loader);
    const result = await query(/* GraphQL */ `
      node(id: ${JSON.stringify(
        encodeId({
          source: 'Mock',
          typename: 'Entity',
          query: { ref: 'entity' },
        }),
      )}) {
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

  it('should add resolver for @relation directive with a connection', async () => {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        union Owner = User | Group

        type Entity @implements(interface: "Node") {
          ownedBy: Connection @relation(nodeType: "Owner")
          nodes: Connection @relation(name: "ownedBy", nodeType: "Owner")
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
          users: Connection @relation(name: "ownedBy", nodeType: "User") # We intentionally don't specify kind here
          groups: Connection
            @relation(name: "ownedBy", kind: "Group", nodeType: "Group")
        }
        type User @implements(interface: "Node") {
          username: String! @field(at: "name")
        }
        type Group @implements(interface: "Node") {
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
          const { query: { ref } = {} } = decodeId(id as string);
          if (ref === 'user:default/john') return john;
          if (ref === 'user:default/mark') return mark;
          if (ref === 'group:default/team-a') return teamA;
          if (ref === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = await createGraphQLAPI(TestModule, loader);
    const result = await query(/* GraphQL */ `
      node(id: ${JSON.stringify(
        encodeId({
          source: 'Mock',
          typename: 'Entity',
          query: { ref: 'entity' },
        }),
      )}) {
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
            {
              node: {
                id: 'Owner@Catalog@{"ref":"user:default/mark"}',
                username: 'Mark',
              },
            },
            {
              node: {
                id: 'Owner@Catalog@{"ref":"group:default/team-a"}',
              },
            },
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

  it('resolver for @relation without `type` argument should return all relations', async () => {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        extend interface Node @discriminates(with: "kind")

        type Entity @implements(interface: "Node") {
          assets: [Node] @relation
        }
        type User @implements(interface: "Node") {
          username: String! @field(at: "name")
        }
        type Group @implements(interface: "Node") {
          groupname: String! @field(at: "name")
        }
        type Component @implements(interface: "Node") {
          name: String! @field(at: "name")
        }
        type Resource @implements(interface: "Node") {
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
          const { query: { ref } = {} } = decodeId(id as string);
          if (ref === 'user:default/john') return john;
          if (ref === 'component:default/backend') return backend;
          if (ref === 'resource:default/website') return website;
          if (ref === 'group:default/team-b') return teamB;
          return entity;
        }),
      );
    const query = await createGraphQLAPI(TestModule, loader);
    const result = await query(/* GraphQL */ `
      node(id: ${JSON.stringify(
        encodeId({
          source: 'Mock',
          typename: 'Entity',
          query: { ref: 'entity' },
        }),
      )}) {
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
          {
            id: 'Node@Catalog@{"ref":"resource:default/website"}',
            domain: 'example.com',
          },
          {
            id: 'Node@Catalog@{"ref":"component:default/backend"}',
            name: 'Backend',
          },
          {
            id: 'Node@Catalog@{"ref":"user:default/john"}',
            username: 'John',
          },
          {
            id: 'Node@Catalog@{"ref":"group:default/team-b"}',
            groupname: 'Team B',
          },
        ],
      },
    });
  });
});
