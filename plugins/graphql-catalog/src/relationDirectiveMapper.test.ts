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

import { transformSchema } from '@backstage/plugin-graphql-common';
import { describe, it } from '@effection/jest';
import DataLoader from 'dataloader';
import { DocumentNode, GraphQLNamedType, printType } from 'graphql';
import { createModule, gql } from 'graphql-modules';
import { createGraphQLAPI } from './setupTests';
import { Relation } from './relation/relation';

describe('mapRelationDirective', () => {
  const transform = (source: DocumentNode) =>
    transformSchema([
      Relation,
      createModule({
        id: 'mapRelationDirective',
        typeDefs: source,
      }),
    ]);

  it('should add subtypes to a union type', function* () {
    const schema = transform(gql`
      union Ownable = IEntity

      interface IEntity @inherit {
        name: String!
      }
      interface IResource @inherit(interface: "IEntity") {
        location: String!
      }
      interface IWebResource
        @inherit(interface: "IResource", when: "spec.type", is: "website") {
        url: String!
      }
      interface IUser @inherit {
        ownerOf: [Ownable!]! @relation
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['union Ownable = Entity | Resource | WebResource']);
  });

  it('should add arguments to the "Connection" type', function* () {
    const schema = transform(gql`
      interface IGroup @inherit(interface: "Node") {
        users: Connection @relation(name: "hasMember", nodeType: "IUser")
      }

      interface IUser @inherit(interface: "Node", when: "kind", is: "User") {
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
    const schema = transform(gql`
      union Ownable = IEntity

      interface IEntity @inherit(interface: "Node") {
        name: String!
      }
      interface IResource
        @inherit(interface: "IEntity", when: "kind", is: "Resource") {
        location: String!
      }
      interface IUser @inherit {
        owns: Connection @relation(name: "ownerOf", nodeType: "Ownable")
      }
    `);
    expect(
      printType(schema.getType('Ownable') as GraphQLNamedType).split('\n'),
    ).toEqual(['interface Ownable implements Node {', '  id: ID!', '}']);
    expect(
      printType(schema.getType('IEntity') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IEntity implements Node & Ownable {',
      '  id: ID!',
      '  name: String!',
      '}',
    ]);
    expect(
      printType(schema.getType('IResource') as GraphQLNamedType).split('\n'),
    ).toEqual([
      'interface IResource implements IEntity & Node & Ownable {',
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

  it("should fail if @relation interface doesn't exist", function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
        }
      `),
    ).toThrow(
      'Error while processing directives on field "owners" of "IEntity":\nThe interface "Owner" is not defined in the schema.',
    );
  });

  it('should fail if @relation interface is input type', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
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

  it('should fail if Connection type is in a list', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
          owners: [Connection] @relation(name: "ownedBy", nodeType: "IOwner")
        }
        interface IOwner @inherit {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing directives on field "owners" of "IEntity":\nIt's not possible to use a list of Connection type. Use either Connection type or list of specific type`,
    );
  });

  it('should fail if Connection has arguments are not valid types', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
          owners(first: String!, after: Int!): Connection
            @relation(name: "ownedBy", nodeType: "IOwner")
        }
        interface IOwner @inherit {
          name: String!
        }
      `),
    ).toThrow(
      `Error while processing directives on field "owners" of "IEntity":\nThe field has mandatory argument \"first\" with different type than expected. Expected: Int`,
    );
  });

  it('should fail if @relation and @field are used on the same field', function* () {
    expect(() =>
      transform(gql`
        interface IEntity @inherit {
          owners: Connection
            @relation(name: "ownedBy", nodeType: "IOwner")
            @field(at: "name")
        }
        interface IOwner @inherit {
          name: String!
        }
      `),
    ).toThrow(
      `The field "owners" of "IEntity" type has more than one directives at the same time`,
    );
  });

  it('should add resolver for @relation directive with single item', function* () {
    const TestModule = createModule({
      id: 'test',
      typeDefs: gql`
        interface IEntity
          @inherit(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: IUser @relation
          owner: IUser @relation(name: "ownedBy")
          group: IGroup @relation(name: "ownedBy", kind: "Group")
        }
        interface IUser @inherit(interface: "Node", when: "kind", is: "User") {
          name: String! @field(at: "name")
        }
        interface IGroup
          @inherit(interface: "Node", when: "kind", is: "Group") {
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
    const query = createGraphQLAPI(TestModule, loader);
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
          @inherit(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: [Owner] @relation
          owners: [Owner] @relation(name: "ownedBy")
          users: [IUser] @relation(name: "ownedBy") # We intentionally don't specify kind here
          groups: [IGroup] @relation(name: "ownedBy", kind: "Group")
        }
        interface IUser @inherit(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup
          @inherit(interface: "Node", when: "kind", is: "Group") {
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
    const query = createGraphQLAPI(TestModule, loader);
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
          @inherit(interface: "Node", when: "kind", is: "Entity") {
          ownedBy: Connection @relation
          nodes: Connection @relation(name: "ownedBy")
          owners: Connection @relation(name: "ownedBy", nodeType: "Owner")
          users: Connection @relation(name: "ownedBy", nodeType: "IUser") # We intentionally don't specify kind here
          groups: Connection
            @relation(name: "ownedBy", kind: "Group", nodeType: "IGroup")
        }
        interface IUser @inherit(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup
          @inherit(interface: "Node", when: "kind", is: "Group") {
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
    const query = createGraphQLAPI(TestModule, loader);
    const result = yield query(/* GraphQL */ `
      node(id: "entity") {
        ...on Entity {
          ownedBy(first: 2) {
            edges {
              node {
                ...on User { username },
                ...on Group { groupname }
              }
            }
          }
          nodes(first: 2, after: "YXJyYXljb25uZWN0aW9uOjE=") {
            edges {
              node {
                ...on Group { groupname },
                ...on User { username }
              }
            }
          }
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
          @inherit(interface: "Node", when: "kind", is: "Entity") {
          assets: [Node] @relation
        }
        interface IUser @inherit(interface: "Node", when: "kind", is: "User") {
          username: String! @field(at: "name")
        }
        interface IGroup
          @inherit(interface: "Node", when: "kind", is: "Group") {
          groupname: String! @field(at: "name")
        }
        interface IComponent
          @inherit(interface: "Node", when: "kind", is: "Component") {
          name: String! @field(at: "name")
        }
        interface IResource
          @inherit(interface: "Node", when: "kind", is: "Resource") {
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
    const query = createGraphQLAPI(TestModule, loader);
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
