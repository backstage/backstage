/*
 * Copyright 2021 The Backstage Authors
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
  getGitLabRequestOptions,
  GitLabIntegrationConfig,
} from '@backstage/integration';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  GitLabDescendantGroupsResponse,
  GitLabGroup,
  GitLabGroupMembersResponse,
  GitLabProject,
  GitLabUser,
  PagedResponse,
} from './types';

export type CommonListOptions = {
  [key: string]: string | number | boolean | undefined;
  per_page?: number | undefined;
  page?: number | undefined;
  active?: boolean;
};

interface ListProjectOptions extends CommonListOptions {
  archived?: boolean;
  group?: string;
}

interface UserListOptions extends CommonListOptions {
  without_project_bots?: boolean | undefined;
  exclude_internal?: boolean | undefined;
}

export class GitLabClient {
  private readonly config: GitLabIntegrationConfig;
  private readonly logger: LoggerService;

  constructor(options: {
    config: GitLabIntegrationConfig;
    logger: LoggerService;
  }) {
    this.config = options.config;
    this.logger = options.logger;
  }

  /**
   * Indicates whether the client is for a SaaS or self managed GitLab instance.
   */
  isSelfManaged(): boolean {
    return this.config.host !== 'gitlab.com';
  }

  async listProjects(
    options?: ListProjectOptions,
  ): Promise<PagedResponse<any>> {
    if (options?.group) {
      return this.pagedRequest(
        `/groups/${encodeURIComponent(options?.group)}/projects`,
        {
          ...options,
          include_subgroups: true,
        },
      );
    }

    return this.pagedRequest(`/projects`, options);
  }

  async getProjectById(
    projectId: number,
    options?: CommonListOptions,
  ): Promise<GitLabProject> {
    // Make the request to the GitLab API
    const response = await this.nonPagedRequest(
      `/projects/${projectId}`,
      options,
    );

    return response;
  }

  async getGroupById(
    groupId: number,
    options?: CommonListOptions,
  ): Promise<GitLabGroup> {
    // Make the request to the GitLab API
    const response = await this.nonPagedRequest(`/groups/${groupId}`, options);

    return response;
  }

  async getUserById(
    userId: number,
    options?: CommonListOptions,
  ): Promise<GitLabUser> {
    // Make the request to the GitLab API
    const response = await this.nonPagedRequest(`/users/${userId}`, options);

    return response;
  }

  async listGroupMembers(
    groupPath: string,
    options?: CommonListOptions,
  ): Promise<PagedResponse<GitLabUser>> {
    return this.pagedRequest(
      `/groups/${encodeURIComponent(groupPath)}/members/all`,
      options,
    );
  }

  async listUsers(
    options?: UserListOptions,
  ): Promise<PagedResponse<GitLabUser>> {
    return this.pagedRequest(`/users?`, {
      ...options,
      without_project_bots: true,
      exclude_internal: true,
    });
  }

  async listSaaSUsers(
    groupPath: string,
    options?: CommonListOptions,
    includeUsersWithoutSeat?: boolean,
  ): Promise<PagedResponse<GitLabUser>> {
    const botFilterRegex = /^(?:project|group)_(\w+)_bot_(\w+)$/;

    return this.listGroupMembers(groupPath, {
      ...options,
      active: true, // Users with seat are always active but for users without seat we need to filter
      show_seat_info: true,
    }).then(resp => {
      // Filter is optional to allow to import Gitlab Free users without seats
      // https://github.com/backstage/backstage/issues/26438
      // Filter out API tokens https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html#bot-users-for-projects
      if (includeUsersWithoutSeat) {
        resp.items = resp.items.filter(user => {
          return !botFilterRegex.test(user.username);
        });
      } else {
        resp.items = resp.items.filter(user => user.is_using_seat);
      }
      return resp;
    });
  }

  async listGroups(
    options?: CommonListOptions,
  ): Promise<PagedResponse<GitLabGroup>> {
    return this.pagedRequest(`/groups`, options);
  }

  async listDescendantGroups(
    groupPath: string,
  ): Promise<PagedResponse<GitLabGroup>> {
    const items: GitLabGroup[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string | null = null;

    do {
      const response: GitLabDescendantGroupsResponse = await fetch(
        `${this.config.baseUrl}/api/graphql`,
        {
          method: 'POST',
          headers: {
            ...getGitLabRequestOptions(this.config).headers,
            ['Content-Type']: 'application/json',
          },
          body: JSON.stringify({
            variables: { group: groupPath, endCursor },
            query: /* GraphQL */ `
              query listDescendantGroups($group: ID!, $endCursor: String) {
                group(fullPath: $group) {
                  descendantGroups(first: 100, after: $endCursor) {
                    nodes {
                      id
                      name
                      description
                      fullPath
                      visibility
                      parent {
                        id
                      }
                    }
                    pageInfo {
                      endCursor
                      hasNextPage
                    }
                  }
                }
              }
            `,
          }),
        },
      ).then(r => r.json());
      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (!response.data.group?.descendantGroups?.nodes) {
        this.logger.warn(
          `Couldn't get groups under ${groupPath}. The provided token might not have sufficient permissions`,
        );
        continue;
      }

      for (const groupItem of response.data.group.descendantGroups.nodes.filter(
        group => group?.id,
      )) {
        const formattedGroupResponse = {
          id: Number(groupItem.id.replace(/^gid:\/\/gitlab\/Group\//, '')),
          name: groupItem.name,
          description: groupItem.description,
          full_path: groupItem.fullPath,
          visibility: groupItem.visibility,
          parent_id: Number(
            groupItem.parent.id.replace(/^gid:\/\/gitlab\/Group\//, ''),
          ),
        };

        items.push(formattedGroupResponse);
      }
      ({ hasNextPage, endCursor } =
        response.data.group.descendantGroups.pageInfo);
    } while (hasNextPage);
    return { items };
  }

  async getGroupMembers(
    groupPath: string,
    relations: string[],
  ): Promise<PagedResponse<GitLabUser>> {
    const items: GitLabUser[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string | null = null;
    do {
      const response: GitLabGroupMembersResponse = await fetch(
        `${this.config.baseUrl}/api/graphql`,
        {
          method: 'POST',
          headers: {
            ...getGitLabRequestOptions(this.config).headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variables: { group: groupPath, relations: relations, endCursor },
            query: /* GraphQL */ `
              query getGroupMembers(
                $group: ID!
                $relations: [GroupMemberRelation!]
                $endCursor: String
              ) {
                group(fullPath: $group) {
                  groupMembers(
                    first: 100
                    relations: $relations
                    after: $endCursor
                  ) {
                    nodes {
                      user {
                        id
                        username
                        publicEmail
                        name
                        state
                        webUrl
                        avatarUrl
                      }
                    }
                    pageInfo {
                      endCursor
                      hasNextPage
                    }
                  }
                }
              }
            `,
          }),
        },
      ).then(r => r.json());
      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (!response.data.group?.groupMembers?.nodes) {
        this.logger.warn(
          `Couldn't get members for group ${groupPath}. The provided token might not have sufficient permissions`,
        );
        continue;
      }

      for (const userItem of response.data.group.groupMembers.nodes.filter(
        user => user.user?.id,
      )) {
        const formattedUserResponse = {
          id: Number(userItem.user.id.replace(/^gid:\/\/gitlab\/User\//, '')),
          username: userItem.user.username,
          email: userItem.user.publicEmail,
          name: userItem.user.name,
          state: userItem.user.state,
          web_url: userItem.user.webUrl,
          avatar_url: userItem.user.avatarUrl,
        };

        items.push(formattedUserResponse);
      }
      ({ hasNextPage, endCursor } = response.data.group.groupMembers.pageInfo);
    } while (hasNextPage);
    return { items };
  }

  /**
   * General existence check.
   *
   * @param projectPath - The path to the project
   * @param branch - The branch used to search
   * @param filePath - The path to the file
   */
  async hasFile(
    projectPath: string,
    branch: string,
    filePath: string,
  ): Promise<boolean> {
    const endpoint: string = `/projects/${encodeURIComponent(
      projectPath,
    )}/repository/files/${encodeURIComponent(filePath)}`;
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);
    request.searchParams.append('ref', branch);

    const response = await fetch(request.toString(), {
      headers: getGitLabRequestOptions(this.config).headers,
      method: 'HEAD',
    });

    if (!response.ok) {
      if (response.status >= 500) {
        this.logger.debug(
          `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
            response.status
          } - ${response.statusText}`,
        );
      }
      return false;
    }

    return true;
  }

  /**
   * Performs a request against a given paginated GitLab endpoint.
   *
   * This method may be used to perform authenticated REST calls against any
   * paginated GitLab endpoint which uses X-NEXT-PAGE headers. The return value
   * can be be used with the {@link paginated} async-generator function to yield
   * each item from the paged request.
   *
   * @see {@link paginated}
   * @param endpoint - The request endpoint, e.g. /projects.
   * @param options - Request queryString options which may also include page variables.
   */
  async pagedRequest<T = any>(
    endpoint: string,
    options?: CommonListOptions,
  ): Promise<PagedResponse<T>> {
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);

    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key];
        if (value !== undefined && value !== '') {
          request.searchParams.append(key, value.toString());
        }
      }
    }

    this.logger.debug(`Fetching: ${request.toString()}`);
    const response = await fetch(
      request.toString(),
      getGitLabRequestOptions(this.config),
    );

    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
          response.status
        } - ${response.statusText}`,
      );
    }

    return response.json().then(items => {
      const nextPage = response.headers.get('x-next-page');

      return {
        items,
        nextPage: nextPage ? Number(nextPage) : null,
      } as PagedResponse<any>;
    });
  }

  async nonPagedRequest<T = any>(
    endpoint: string,
    options?: CommonListOptions,
  ): Promise<T> {
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);

    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const value = options[key];
        if (value !== undefined && value !== '') {
          request.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(
      request.toString(),
      getGitLabRequestOptions(this.config),
    );

    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
          response.status
        } - ${response.statusText}`,
      );
    }

    return response.json();
  }
}

/**
 * Advances through each page and provides each item from a paginated request.
 *
 * The async generator function yields each item from repeated calls to the
 * provided request function. The generator walks through each available page by
 * setting the page key in the options passed into the request function and
 * making repeated calls until there are no more pages.
 *
 * @see {@link pagedRequest}
 * @param request - Function which returns a PagedResponse to walk through.
 * @param options - Initial ListOptions for the request function.
 */
export async function* paginated<T = any>(
  request: (options: CommonListOptions) => Promise<PagedResponse<T>>,
  options: CommonListOptions,
) {
  let res;
  do {
    res = await request(options);
    options.page = res.nextPage;
    for (const item of res.items) {
      yield item;
    }
  } while (res.nextPage);
}
