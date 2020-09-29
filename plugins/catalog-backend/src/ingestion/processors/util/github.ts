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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { graphql } from '@octokit/graphql';

// Graphql types

type QueryResponse = {
  organization: Organization;
};

type Organization = {
  membersWithRole: Connection<User>;
  team: Team;
  teams: Connection<Team>;
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

type User = {
  login: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
};

type Team = {
  slug: string;
  combinedSlug: string;
  description?: string;
  parentTeam?: Team;
  members: Connection<User>;
};

type Connection<T> = {
  pageInfo: PageInfo;
  nodes: T[];
};

/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 */
export async function getOrganizationUsers(
  client: typeof graphql,
  org: string,
): Promise<{ users: UserEntity[] }> {
  const users: UserEntity[] = [];

  // There is no user -> teams edge, so we leave the memberships empty for
  // now and let the team iteration handle it instead
  let cursor: string | undefined = undefined;
  const query = `
      query users($org: String!, $cursor: String) {
        organization(login: $org) {
          membersWithRole(first: 100, after: $cursor) {
            pageInfo { hasNextPage, endCursor }
            nodes { avatarUrl, bio, email, login, name }
          }
        }
      }`;

  for (let i = 0; i < 100 /* just for sanity */; ++i) {
    const response: QueryResponse = await client(query, {
      org,
      cursor,
    });

    const connection = response.organization?.membersWithRole;
    if (!connection) {
      throw new Error(`Found no organization named ${org}`);
    }

    for (const user of connection.nodes) {
      const entity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: user.login,
          annotations: {
            'github.com/user-login': user.login,
          },
        },
        spec: {
          profile: {},
          memberOf: [],
        },
      };

      if (user.bio) entity.metadata.description = user.bio;
      if (user.name) entity.spec.profile!.displayName = user.name;
      if (user.email) entity.spec.profile!.email = user.email;
      if (user.avatarUrl) entity.spec.profile!.picture = user.avatarUrl;

      users.push(entity);
    }

    const { hasNextPage, endCursor } = connection.pageInfo;
    if (!hasNextPage) {
      break;
    } else {
      cursor = endCursor;
    }
  }

  return { users };
}

/**
 * Gets all the teams out of a GitHub organization.
 *
 * Note that the teams will not have any relations apart from parent filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 */
export async function getOrganizationTeams(
  client: typeof graphql,
  org: string,
): Promise<{
  groups: GroupEntity[];
  groupMemberUsers: Map<string, string[]>;
}> {
  const groups: GroupEntity[] = [];
  const groupMemberUsers = new Map<string, string[]>();

  let cursor: string | undefined = undefined;
  const query = `
    query teams($org: String!, $cursor: String) {
      organization(login: $org) {
        teams(first: 100, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            slug
            combinedSlug
            parentTeam { slug }
            members(first: 100, membership: IMMEDIATE) {
              pageInfo { hasNextPage, endCursor }
              nodes { login }
            }
          }
        }
      }
    }`;

  for (let i = 0; i < 100 /* just for sanity */; ++i) {
    const response: QueryResponse = await client(query, {
      org,
      cursor,
    });

    const connection = response.organization?.teams;
    if (!connection) {
      throw new Error(`Found no organization named ${org}`);
    }

    for (const team of connection.nodes) {
      const entity: GroupEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: team.slug,
          annotations: {
            'github.com/team-slug': team.combinedSlug,
          },
        },
        spec: {
          type: 'team',
          ancestors: [],
          children: [],
          descendants: [],
        },
      };

      if (team.description) entity.metadata.description = team.description;
      if (team.parentTeam) entity.spec.parent = team.parentTeam.slug;

      groups.push(entity);

      const memberNames: string[] = [];
      groupMemberUsers.set(team.slug, memberNames);

      if (!team.members.pageInfo.hasNextPage) {
        // We got all the members in one go, run the fast path
        for (const user of team.members.nodes) {
          memberNames.push(user.login);
        }
      } else {
        // There were more than a hundred immediate members - run the slow
        // path of fetching them explicitly
        const { members } = await getTeamMembers(client, org, team.slug);
        for (const userLogin of members) {
          memberNames.push(userLogin);
        }
      }
    }

    const { hasNextPage, endCursor } = connection.pageInfo;
    if (!hasNextPage) {
      break;
    } else {
      cursor = endCursor;
    }
  }

  return { groups, groupMemberUsers };
}

/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 * @param teamSlug The slug of the team to read
 */
export async function getTeamMembers(
  client: typeof graphql,
  org: string,
  teamSlug: string,
): Promise<{ members: string[] }> {
  const members: string[] = [];

  let cursor: string | undefined = undefined;
  const query = `
    query members($org: String!, $teamSlug: String!, $cursor: String) {
      organization(login: $org) {
        team(slug: $teamSlug) {
          members(first: 100, after: $cursor, membership: IMMEDIATE) {
            pageInfo { hasNextPage, endCursor }
            nodes { login }
          }
        }
      }
    }`;

  for (let j = 0; j < 100 /* just for sanity */; ++j) {
    const response: QueryResponse = await client(query, {
      org,
      teamSlug,
      cursor,
    });

    const connection = response.organization?.team?.members;
    if (!connection) {
      throw new Error(`Found no team named ${teamSlug} in named ${org}`);
    }

    for (const user of connection.nodes) {
      members.push(user.login);
    }

    const { hasNextPage, endCursor } = connection.pageInfo;
    if (!hasNextPage) {
      break;
    } else {
      cursor = endCursor;
    }
  }

  return { members };
}
