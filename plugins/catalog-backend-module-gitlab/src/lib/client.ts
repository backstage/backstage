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

import { InputError } from '@backstage/errors';
import {
  getGitLabRequestOptions,
  GitLabIntegration,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { merge } from 'lodash';
import fetch, { RequestInit, Response } from 'node-fetch';
import { Logger } from 'winston';
import {
  GitLabProjectResponse,
  GitLabGroupResponse,
  GitLabUserResponse,
} from './types';
import { parseGroupUrl } from './url';

export type ListOptions = {
  [key: string]: string | number | boolean | undefined;
  group?: string;
  per_page?: number | undefined;
  page?: number | undefined;
};

export type PagedResponse<T> = {
  items: T[];
  nextPage?: number;
};

export class GitLabClient {
  constructor(
    private readonly options: {
      integrations: ScmIntegrationRegistry;
      logger: Logger;
    },
  ) {}

  listProjects(
    targetUrl: string,
    options?: {
      last_activity_after?: string;
    },
  ): AsyncGenerator<GitLabProjectResponse> {
    const integration = this.getIntegration(targetUrl);

    // If the target URL is a group, return the projects exposed by that group
    const groupFullPath = parseGroupUrl(targetUrl, integration.config.baseUrl);
    if (groupFullPath) {
      return this.pagedRequest(
        `/groups/${encodeURIComponent(groupFullPath)}/projects`,
        integration,
        {
          per_page: 100,
          include_subgroups: true,
          ...(options?.last_activity_after && {
            last_activity_after: options.last_activity_after,
          }),
        },
      );
    }

    // Otherwise, list all projects on the instance
    return this.pagedRequest('/projects', integration, {
      per_page: 100,
      ...(options?.last_activity_after && {
        last_activity_after: options.last_activity_after,
      }),
    });
  }

  listGroups(targetUrl: string): AsyncGenerator<GitLabGroupResponse> {
    const integration = this.getIntegration(targetUrl);

    // If the target URL points to a group, return that group and its descendants
    const groupFullPath = parseGroupUrl(targetUrl, integration.config.baseUrl);
    if (groupFullPath) {
      return this.pagedRequest(
        `/groups/${encodeURIComponent(groupFullPath)}/subgroups`,
        integration,
        { per_page: 100 },
      );
    }

    // If the target URL just points to the instance, return all groups
    return this.pagedRequest('/groups', integration, { per_page: 100 });
  }

  listUsers(
    targetUrl: string,
    options?: { inherited?: boolean; blocked?: boolean },
  ): AsyncGenerator<GitLabUserResponse> {
    const integration = this.getIntegration(targetUrl);

    // If it is a group URL, list only the members of that group
    const groupFullPath = parseGroupUrl(targetUrl, integration.config.baseUrl);
    if (groupFullPath) {
      // TODO(minnsoe): perform a second /users/:id request to enrich and match instance users
      const inherited = options?.inherited ? '/all' : '';
      return this.pagedRequest(
        `/groups/${encodeURIComponent(groupFullPath)}/members${inherited}`,
        integration,
        {
          per_page: 100,
          ...(options?.blocked && { blocked: true }),
        },
      );
    }

    // Otherwise, list the users of the entire instance
    if (integration.config.host === 'gitlab.com') {
      throw new Error(
        'Getting all GitLab instance users is only supported for self-managed hosts, not public gitlab.com.',
      );
    }
    return this.pagedRequest('/users', integration, {
      active: true,
      per_page: 100,
    });
  }

  /**
   * Performs a series of requests against a given paginated GitLab endpoint, to
   * get its full result set.
   *
   * This method may be used to perform authenticated REST calls against any
   * paginated GitLab endpoint which uses X-NEXT-PAGE headers.
   *
   * @param endpoint - The request endpoint, e.g. /projects.
   * @param integration - The GitLab integration that we're communicating with
   * @param options - Request queryString options.
   */
  private async *pagedRequest<T = unknown>(
    endpoint: string,
    integration: GitLabIntegration,
    options?: ListOptions,
  ): AsyncGenerator<T> {
    const optionsCopy = { ...options };
    do {
      const queryString = listOptionsToQueryString(optionsCopy);
      const response = await this.request(
        `${integration.config.apiBaseUrl}${endpoint}${queryString}`,
        integration,
      );
      const nextPage = response.headers.get('x-next-page');
      const items = await response.json();
      if (!Array.isArray(items)) {
        throw new Error(
          `Expected array response from GitLab, got ${typeof items}`,
        );
      }
      for (const item of items) {
        yield item;
      }
      if (!nextPage) {
        break;
      }
      optionsCopy.page = Number(nextPage);
    } while (true);
  }

  /**
   * Performs a request using fetch with pre-configured GitLab options.
   *
   * This method can be used to perform authenticated calls to any GitLab
   * endpoint against the configured GitLab instance. The underlying response is
   * returned from fetch without modification. Request options can be overridden
   * as they are merged to produce the final values; passed in values take
   * precedence.
   *
   * If a request response is not okay, this method will throw an error.
   *
   * @param endpoint - The request endpoint, e.g. /user.
   * @param integration - The GitLab integration that we're communicating with
   * @param init - Optional request options which may set or override values.
   */
  private async request(
    endpoint: string,
    integration: GitLabIntegration,
    init?: RequestInit,
  ): Promise<Response> {
    this.options.logger.debug(`Fetching: ${endpoint}`);
    const response = await fetch(
      endpoint,
      merge(getGitLabRequestOptions(integration.config), init),
    );

    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${endpoint}. Expected 200 but got ${response.status} - ${response.statusText}`,
      );
    }

    return response;
  }

  private getIntegration(url: string): GitLabIntegration {
    const integration = this.options.integrations.gitlab.byUrl(url);
    if (!integration) {
      throw new InputError(
        `No GitLab integration found for URL ${url}, Please add a configuration entry for it under integrations.gitlab.`,
      );
    }
    return integration;
  }
}

/**
 * Converts ListOptions for request pagination to a query string.
 *
 * The ListOptions type contains fields which control offset based pagination
 * used by GitLab's API. This function returns a string which may be appended to
 * absolute or relative URLs. The returned value contains a leading `?` if the
 * resulting query string is non-empty.
 *
 * @params options - The pagination ListOptions to convert.
 */
function listOptionsToQueryString(options?: ListOptions): string {
  const search = new URLSearchParams();
  for (const key in options) {
    if (options[key]) {
      search.append(key, options[key]!.toString());
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}
