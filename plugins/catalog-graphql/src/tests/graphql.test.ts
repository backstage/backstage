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

import { describe, beforeAll, it } from '@effection/jest';
import { createGraphQLAPI, GraphQLHarness } from './setupTests';

describe('querying the graphql API', () => {
  let harness: GraphQLHarness;
  let backstageId: string;
  beforeAll(function* () {
    harness = createGraphQLAPI();
    backstageId = harness.create('Component', {
      name: 'backstage',
      lifecycle: 'production',
      description: 'An example of a Backstage application.',
      owner: {
        name: 'computer-department',
        email: 'computer@frontside.com',
        displayName: 'Computer Department',
        picture: 'https://frontside.com/computers/logo.svg',
      },
      partOf: [
        {
          displayName: 'Oriental Plastic Tuna',
        },
        {
          displayName: 'The Internet',
        },
      ],
      subComponents: [
        {
          name: 'lighting',
        },
      ],
      consumes: [
        {
          name: 'github-enterprise',
        },
      ],
      provides: [
        {
          name: 'backstage-backend-api',
        },
      ],
      dependencies: [
        {
          name: 'artists-db',
        },
      ],
    });
    harness.create('User', {
      displayName: 'Janelle Dawe',
    });
  });

  it('can look up a known node by id', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        node(id: "${backstageId}") { ...on Component { id } }
      `),
    ).toMatchObject({ node: { id: backstageId } });
  });

  it('can look up a known entity by name', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(
          kind: "Component",
          name: "backstage",
          namespace: "default"
        ) { ...on Component { name, namespace, description } }
      `),
    ).toMatchObject({
      entity: {
        name: 'backstage',
        namespace: 'default',
        description: 'An example of a Backstage application.',
      },
    });
  });

  it('looks up entity in the default namespace if no namespace provided', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
          entity(kind: "Component", name: "backstage") {
            ...on Component { name, namespace, description }
          }
        `),
    ).toMatchObject({ entity: { name: 'backstage', namespace: 'default' } });
  });

  it.todo('returns null for a node that cannot be found');
  it.todo('returns null for an entity that cannot be found');

  it("can look up a component's owner", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          name
          ...on Component {
            lifecycle
            owner {
              ...on Group {
                name
                email
                displayName
                picture
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'backstage',
        lifecycle: 'PRODUCTION',
        owner: {
          name: 'computer-department',
          email: 'computer@frontside.com',
          displayName: 'Computer Department',
          picture: 'https://frontside.com/computers/logo.svg',
        },
      },
    });
  });

  it('can look up which system component belongs to', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          ...on Component {
            lifecycle
            system {
              name
              description
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        lifecycle: 'PRODUCTION',
        system: {
          name: 'the-internet',
          description: 'Everything related to The Internet',
        },
      },
    });
  });

  it("looks up component's parts", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          name
          ...on Component {
            subComponents {
              edges {
                node { name }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'backstage',
        subComponents: { edges: [{ node: { name: 'lighting' } }] },
      },
    });
  });

  it("looks up component's apis", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          name
          ...on Component {
            providesApi {
              edges {
                node { name }
              }
            }
            consumesApi {
              edges {
                node { name }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'backstage',
        providesApi: {
          edges: expect.arrayContaining([
            { node: { name: 'backstage-backend-api' } },
          ]),
        },
        consumesApi: {
          edges: expect.arrayContaining([
            { node: { name: 'github-enterprise' } },
          ]),
        },
      },
    });
  });

  it("looks up component's dependencies", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          name
          ...on Component {
            dependencies {
              edges {
                node {
                  ... on Resource { name }
                }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'backstage',
        dependencies: {
          edges: expect.arrayContaining([{ node: { name: 'artists-db' } }]),
        },
      },
    });
  });

  it('can look up components hierarchy', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Component", name: "backstage") {
          description
          ...on Component {
            component {
              name
              description
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'An example of a Backstage application.',
        component: {
          name: 'culpa-vel-voluptates',
          description: 'Officiis necessitatibus a debitis a facere error.',
        },
      },
    });
  });

  it('can look up a known user', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "User", name: "janelle.dawe") {
          ...on User {
            displayName
            email
            picture
          }
        }
      `),
    ).toMatchObject({
      entity: {
        displayName: 'Janelle Dawe',
        email: 'janelle.dawe@example.com',
        picture:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/247.jpg',
      },
    });
  });

  it.skip("looks up user's groups", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "User", name: "janelle.dawe") {
          name
          ...on User {
            memberOf {
              edges {
                node {
                  name
                  displayName
                  email
                }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'janelle.dawe',
        memberOf: [
          { name: 'team-a', displayName: null, email: 'team-a@example.com' },
        ],
      },
    });
  });

  it.skip('can look up a known group', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Group", name: "team-a") {
          ...on Group {
            displayName
            email
            picture
          }
        }
      `),
    ).toMatchObject({
      entity: {
        displayName: null,
        email: 'team-a@example.com',
        picture:
          'https://avatars.dicebear.com/api/identicon/team-a@example.com.svg?background=%23fff&margin=25',
      },
    });
  });

  it.skip('looks up group children', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Group", name: "infrastructure") {
          name
          ...on Group {
            children {
              edges {
                node {
                  name
                  displayName
                }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'infrastructure',
        children: [
          {
            name: 'backstage',
            displayName: 'Backstage',
          },
          {
            name: 'boxoffice',
            displayName: 'Box Office',
          },
        ],
      },
    });
  });

  it.skip('looks up group members', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Group", name: "team-a") {
          name
          ...on Group {
            members {
              edges {
                node {
                  name
                  email
                }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'team-a',
        members: [
          {
            name: 'breanna.davison',
            email: 'breanna-davison@example.com',
          },
          {
            name: 'guest',
            email: 'guest@example.com',
          },
          {
            name: 'janelle.dawe',
            email: 'janelle-dawe@example.com',
          },
          {
            name: 'nigel.manning',
            email: 'nigel-manning@example.com',
          },
        ],
      },
    });
  });

  it.skip('looks up group belongings', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Group", name: "team-a") {
          name
          ...on Group {
            ownerOf {
              ...on Component { name }
              ...on Resource { name }
              ...on API { name }
              ...on System { name }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'team-a',
        ownerOf: [
          { name: 'spotify' },
          { name: 'wayback-archive' },
          { name: 'wayback-search' },
          { name: 'artist-lookup' },
          { name: 'wayback-archive' },
          { name: 'wayback-archive-storage' },
          { name: 'wayback-search' },
          { name: 'www-artist' },
          { name: 'artists-db' },
          { name: 'artist-engagement-portal' },
        ],
      },
    });
  });

  it.skip("can look up a group's parent", function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Group", name: "team-a") {
          ...on Group {
            parent {
              displayName
              email
              picture
              parent {
                description
                displayName
                email
                picture
                parent {
                  displayName
                  email
                  picture
                  parent {
                    displayName
                  }
                }
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        parent: {
          displayName: 'Backstage',
          email: 'backstage@example.com',
          picture:
            'https://avatars.dicebear.com/api/identicon/backstage@example.com.svg?background=%23fff&margin=25',
          parent: {
            description: 'The infra department',
            displayName: null,
            email: null,
            picture: null,
            parent: {
              displayName: 'ACME Corp',
              email: 'info@example.com',
              picture:
                'https://avatars.dicebear.com/api/identicon/info@example.com.svg?background=%23fff&margin=25',
              parent: null,
            },
          },
        },
      },
    });
  });

  it.skip('can look up a known system', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "System", name: "artist-engagement-portal") {
          description
          ...on System {
            owner {
              ...on Group {
                name
              }
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'Everything related to artists',
        owner: { name: 'team-a' },
      },
    });
  });

  it.skip('looks up system parts', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "System", name: "podcast") {
          name
          ...on System {
            components { name }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        name: 'podcast',
        components: [{ name: 'podcast-api' }, { name: 'queue-proxy' }],
      },
    });
  });

  it.skip('can look up a known resource', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Resource", name: "artists-db") {
          description
          ...on Resource {
            owner {
              ...on Group { name }
            }
            dependents {
              ...on Component { name }
            }
            system { name }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'Stores artist details',
        owner: { name: 'team-a' },
        dependents: [{ name: 'artist-lookup' }],
        system: { name: 'artist-engagement-portal' },
      },
    });
  });

  it.skip('can look up a known API', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "API", name: "hello-world") {
          description
          ...on API {
            lifecycle
            providers {
              name
              description
            }
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'Hello World example for gRPC',
        lifecycle: 'DEPRECATED',
        providers: [
          {
            name: 'petstore',
            description:
              'The Petstore is an example API used to show features of the OpenAPI spec.',
          },
        ],
      },
    });
  });

  it.skip('can look up a known location', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Location", name: "example-groups") {
          description
          ...on Location {
            targets
            target
            type
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'A collection of all Backstage example Groups',
        targets: [
          './infrastructure-group.yaml',
          './boxoffice-group.yaml',
          './backstage-group.yaml',
          './team-a-group.yaml',
          './team-b-group.yaml',
          './team-c-group.yaml',
          './team-d-group.yaml',
        ],
        target: null,
        type: null,
      },
    });
  });

  it.skip('can look up a known template', function* () {
    expect(
      yield harness.query(/* GraphQL */ `
        entity(kind: "Template", name: "react-ssr-template") {
          description
          ...on Template {
            output
          }
        }
      `),
    ).toMatchObject({
      entity: {
        description: 'Create a website powered with Next.js',
        output: {
          links: [
            {
              title: 'Repository',
              url: '${{ steps.publish.output.remoteUrl }}',
            },
            {
              title: 'Open in catalog',
              icon: 'catalog',
              entityRef: '${{ steps.register.output.entityRef }}',
            },
          ],
        },
      },
    });
  });
});
