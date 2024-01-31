/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { GithubCredentialType } from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import {
  defaultOrganizationTeamTransformer,
  defaultUserTransformer,
  TeamTransformer,
  TransformerContext,
  UserTransformer,
} from './defaultTransformers';
import { withLocations } from './withLocations';

import { DeferredEntity } from '@backstage/plugin-catalog-node';

// Graphql types

export type QueryResponse = {
  organization?: OrganizationResponse;
  repositoryOwner?: RepositoryOwnerResponse;
  user?: UserResponse;
};

type RepositoryOwnerResponse = {
  repositories?: Connection<RepositoryResponse>;
};

export type OrganizationResponse = {
  membersWithRole?: Connection<GithubUser>;
  team?: GithubTeamResponse;
  teams?: Connection<GithubTeamResponse>;
  repositories?: Connection<RepositoryResponse>;
};

export type UserResponse = {
  organizations?: Connection<GithubOrg>;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

export type GithubOrg = {
  login: string;
};

/**
 * Github User
 *
 * @public
 */
export type GithubUser = {
  login: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  organizationVerifiedDomainEmails?: string[];
};

/**
 * Github Team
 *
 * @public
 */
export type GithubTeam = {
  slug: string;
  combinedSlug: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
  editTeamUrl?: string;
  parentTeam?: GithubTeam;
  members: GithubUser[];
};

export type GithubTeamResponse = Omit<GithubTeam, 'members'> & {
  members: Connection<GithubUser>;
};

export type RepositoryResponse = {
  name: string;
  url: string;
  isArchived: boolean;
  isFork: boolean;
  repositoryTopics: RepositoryTopics;
  defaultBranchRef: {
    name: string;
  } | null;
  catalogInfoFile: {
    __typename: string;
    id: string;
    text: string;
  } | null;
  visibility: string;
};

type RepositoryTopics = {
  nodes: TopicNodes[];
};

type TopicNodes = {
  topic: {
    name: string;
  };
};

export type Connection<T> = {
  pageInfo: PageInfo;
  nodes: T[];
};

/**
 * Gets all the users out of a Github organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 */
export async function getOrganizationUsers(
  client: typeof graphql,
  org: string,
  tokenType: GithubCredentialType,
  userTransformer: UserTransformer = defaultUserTransformer,
): Promise<{ users: Entity[] }> {
  const query = `
    query users($org: String!, $email: Boolean!, $cursor: String) {
      organization(login: $org) {
        membersWithRole(first: 100, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            avatarUrl,
            bio,
            email @include(if: $email),
            login,
            name,
            organizationVerifiedDomainEmails(login: $org)
          }
        }
      }
    }`;

  // There is no user -> teams edge, so we leave the memberships empty for
  // now and let the team iteration handle it instead

  const users = await queryWithPaging(
    client,
    query,
    org,
    r => r.organization?.membersWithRole,
    userTransformer,
    {
      org,
      email: tokenType === 'token',
    },
  );

  return { users };
}

/**
 * Gets all the teams out of a Github organization.
 *
 * Note that the teams will not have any relations apart from parent filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 */
export async function getOrganizationTeams(
  client: typeof graphql,
  org: string,
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
): Promise<{
  teams: Entity[];
}> {
  const query = `
    query teams($org: String!, $cursor: String) {
      organization(login: $org) {
        teams(first: 50, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            slug
            combinedSlug
            name
            description
            avatarUrl
            editTeamUrl
            parentTeam { slug }
            members(first: 100, membership: IMMEDIATE) {
              pageInfo { hasNextPage }
              nodes {
                avatarUrl,
                bio,
                email,
                login,
                name,
                organizationVerifiedDomainEmails(login: $org)
               }
            }
          }
        }
      }
    }`;

  const materialisedTeams = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more than a hundred immediate members - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(ctx.client, ctx.org, item.slug);
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const teams = await queryWithPaging(
    client,
    query,
    org,
    r => r.organization?.teams,
    materialisedTeams,
    { org },
  );

  return { teams };
}

export async function getOrganizationTeamsFromUsers(
  client: typeof graphql,
  org: string,
  userLogins: string[],
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
): Promise<{
  teams: Entity[];
}> {
  const query = `
   query teams($org: String!, $cursor: String, $userLogins: [String!] = "") {
  organization(login: $org) {
    teams(first: 100, after: $cursor, userLogins: $userLogins) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        combinedSlug
        name
        description
        avatarUrl
        editTeamUrl
        parentTeam {
          slug
        }
        members(first: 100, membership: IMMEDIATE) {
          pageInfo {
            hasNextPage
          }
          nodes {
            avatarUrl,
            bio,
            email,
            login,
            name,
            organizationVerifiedDomainEmails(login: $org)
          }
        }
      }
    }
  }
}`;

  const materialisedTeams = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more than a hundred immediate members - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(ctx.client, ctx.org, item.slug);
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const teams = await queryWithPaging(
    client,
    query,
    org,
    r => r.organization?.teams,
    materialisedTeams,
    { org, userLogins },
  );

  return { teams };
}

export async function getOrganizationsFromUser(
  client: typeof graphql,
  user: string,
): Promise<{
  orgs: string[];
}> {
  const query = `
  query orgs($user: String!) {
    user(login: $user) {
      organizations(first: 100) {
        nodes { login }
        pageInfo { hasNextPage, endCursor }
      }
    }
  }`;

  const orgs = await queryWithPaging(
    client,
    query,
    '',
    r => r.user?.organizations,
    async o => o.login,
    { user },
  );

  return { orgs };
}

export async function getOrganizationTeam(
  client: typeof graphql,
  org: string,
  teamSlug: string,
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
): Promise<{
  team: Entity;
}> {
  const query = `
  query teams($org: String!, $teamSlug: String!) {
      organization(login: $org) {
        team(slug:$teamSlug) {
            slug
            combinedSlug
            name
            description
            avatarUrl
            editTeamUrl
            parentTeam { slug }
            members(first: 100, membership: IMMEDIATE) {
              pageInfo { hasNextPage }
              nodes { login }
            }
        }
      }
    }`;

  const materialisedTeam = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more than a hundred immediate members - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(ctx.client, ctx.org, item.slug);
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const response: QueryResponse = await client(query, {
    org,
    teamSlug,
  });

  if (!response.organization?.team)
    throw new Error(`Found no match for team ${teamSlug}`);

  const team = await materialisedTeam(response.organization?.team, {
    query,
    client,
    org,
  });

  if (!team) throw new Error(`Can't transform for team ${teamSlug}`);

  return { team };
}

export async function getOrganizationRepositories(
  client: typeof graphql,
  org: string,
  catalogPath: string,
): Promise<{ repositories: RepositoryResponse[] }> {
  let relativeCatalogPathRef: string;
  // We must strip the leading slash or the query for objects does not work
  if (catalogPath.startsWith('/')) {
    relativeCatalogPathRef = catalogPath.substring(1);
  } else {
    relativeCatalogPathRef = catalogPath;
  }
  const catalogPathRef = `HEAD:${relativeCatalogPathRef}`;
  const query = `
    query repositories($org: String!, $catalogPathRef: String!, $cursor: String) {
      repositoryOwner(login: $org) {
        login
        repositories(first: 50, after: $cursor) {
          nodes {
            name
            catalogInfoFile: object(expression: $catalogPathRef) {
              __typename
              ... on Blob {
                id
                text
              }
            }
            url
            isArchived
            isFork
            visibility
            repositoryTopics(first: 100) {
              nodes {
                ... on RepositoryTopic {
                  topic {
                    name
                  }
                }
              }
            }
            defaultBranchRef {
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;

  const repositories = await queryWithPaging(
    client,
    query,
    org,
    r => r.repositoryOwner?.repositories,
    async x => x,
    { org, catalogPathRef },
  );

  return { repositories };
}

/**
 * Gets all the users out of a Github organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 * @param teamSlug - The slug of the team to read
 */
export async function getTeamMembers(
  client: typeof graphql,
  org: string,
  teamSlug: string,
): Promise<{ members: GithubUser[] }> {
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

  const members = await queryWithPaging(
    client,
    query,
    org,
    r => r.organization?.team?.members,
    async user => user,
    { org, teamSlug },
  );

  return { members };
}

//
// Helpers
//

/**
 * Assists in repeatedly executing a query with a paged response.
 *
 * Requires that the query accepts a $cursor variable.
 *
 * @param client - The octokit client
 * @param query - The query to execute
 * @param org - The slug of the org to read
 * @param connection - A function that, given the response, picks out the actual
 *                   Connection object that's being iterated
 * @param transformer - A function that, given one of the nodes in the Connection,
 *               returns the model mapped form of it
 * @param variables - The variable values that the query needs, minus the cursor
 */
export async function queryWithPaging<
  GraphqlType,
  OutputType,
  Variables extends {},
  Response = QueryResponse,
>(
  client: typeof graphql,
  query: string,
  org: string,
  connection: (response: Response) => Connection<GraphqlType> | undefined,
  transformer: (
    item: GraphqlType,
    ctx: TransformerContext,
  ) => Promise<OutputType | undefined>,
  variables: Variables,
): Promise<OutputType[]> {
  const result: OutputType[] = [];
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  let cursor: string | undefined = undefined;
  for (let j = 0; j < 1000 /* just for sanity */; ++j) {
    const response: Response = await client(query, {
      ...variables,
      cursor,
    });

    const conn = connection(response);
    if (!conn) {
      throw new Error(`Found no match for ${JSON.stringify(variables)}`);
    }

    for (const node of conn.nodes) {
      const transformedNode = await transformer(node, {
        client,
        query,
        org,
      });

      if (transformedNode) {
        result.push(transformedNode);
      }
    }

    if (!conn.pageInfo.hasNextPage) {
      break;
    } else {
      await sleep(1000);
      cursor = conn.pageInfo.endCursor;
    }
  }

  return result;
}

export type DeferredEntitiesBuilder = (
  org: string,
  entities: Entity[],
) => { added: DeferredEntity[]; removed: DeferredEntity[] };

export const createAddEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => ({
    removed: [],
    added: entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    })),
  });

export const createRemoveEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => ({
    added: [],
    removed: entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    })),
  });

export const createReplaceEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => {
    const entitiesToReplace = entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    }));

    return {
      removed: entitiesToReplace,
      added: entitiesToReplace,
    };
  };
