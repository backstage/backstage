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
import { UserEntity } from '@backstage/catalog-model';
import { parseGitLabGroupUrl } from './groups';
import { GitLabClient, paginated } from './client';
import { GitLabUserResponse, UserTransformer } from './types';

/**
 * Options to configure GitLab user ingestion.
 *
 * @public
 */
export type UserIngestionOptions = {
  inherited?: boolean;
  blocked?: boolean;
  transformer?: UserTransformer;
};

/**
 * The default implementation to map a GitLab user response to a User entity.
 *
 * @public
 */
export async function defaultUserTransformer(
  user: GitLabUserResponse,
): Promise<UserEntity | undefined> {
  if (user.bot) {
    return undefined;
  }

  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: user.username,
    },
    spec: {
      profile: {},
      memberOf: [],
    },
  };
  if (user.name) entity.spec.profile!.displayName = user.name;
  if (user.avatar_url) entity.spec.profile!.picture = user.avatar_url;
  if (user.public_email) entity.spec.profile!.email = user.public_email;
  if (user.email) entity.spec.profile!.email = user.email;

  return entity;
}

export async function getGroupMembers(
  client: GitLabClient,
  id: string,
  options: UserIngestionOptions = {},
): Promise<UserEntity[]> {
  const endpoint = `/groups/${encodeURIComponent(id)}/members${
    options.inherited ? '/all' : ''
  }`;
  const transformer = options?.transformer ?? defaultUserTransformer;
  // TODO(minnsoe): perform a second /users/:id request to enrich and match instance users
  const members = paginated<GitLabUserResponse>(
    opts => client.pagedRequest(endpoint, opts),
    { blocked: options.blocked, per_page: 100 },
  );

  const memberUserEntities = [];
  for await (const result of members) {
    const entity = await transformer(result);
    if (!entity) {
      continue;
    }
    memberUserEntities.push(entity);
  }
  return memberUserEntities;
}

export async function getInstanceUsers(
  client: GitLabClient,
  options: UserIngestionOptions = {},
): Promise<UserEntity[]> {
  if (!client.isSelfManaged()) {
    throw new Error(
      'Getting all GitLab instance users is only supported for self-managed hosts.',
    );
  }
  const transformer = options?.transformer ?? defaultUserTransformer;
  const users = paginated<GitLabUserResponse>(
    opts => client.pagedRequest('/users', opts),
    { active: true, per_page: 100 },
  );
  const userEntities = [];
  for await (const result of users) {
    const entity = await transformer(result);
    if (!entity) {
      continue;
    }
    userEntities.push(entity);
  }
  return userEntities;
}

/**
 * Read users from a GitLab target and provides User entities.
 *
 * @public
 */
export async function readUsers(
  client: GitLabClient,
  target: string,
  options: UserIngestionOptions = {},
): Promise<UserEntity[]> {
  const baseURL = new URL(client.baseUrl);
  const targetURL = new URL(target);
  if (baseURL.host !== targetURL.host) {
    throw new Error(
      `The GitLab client (${baseURL.host}) cannot be used for target host (${targetURL.host}).`,
    );
  }

  const groupURL = parseGitLabGroupUrl(target, client.baseUrl);
  if (!groupURL) {
    return getInstanceUsers(client, options);
  }
  return getGroupMembers(client, groupURL, {
    ...options,
    inherited: options?.inherited ?? true,
  });
}
