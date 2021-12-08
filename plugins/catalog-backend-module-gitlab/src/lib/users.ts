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
import { GitLabClient, paginated } from './client';

type GroupMember = {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
  access_level: number;
  created_at: string;
};

/*
 * Partial GitLab API User Repsonse
 *
 * Admin fields are set to optional:
 * https://docs.gitlab.com/ee/api/users.html#for-admins.
 */
type User = {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  job_title: string;
  public_email?: string;
  email?: string;
  bot?: boolean;
};

export async function getGroupMembers(
  client: GitLabClient,
  id: string,
  inherited?: boolean,
  blocked?: boolean,
): Promise<UserEntity[]> {
  const endpoint = `/groups/${encodeURIComponent(id)}/members${
    inherited ? '/all' : ''
  }`;
  const members = paginated<GroupMember>(
    options => client.pagedRequest(endpoint, options),
    { blocked, per_page: 100 },
  );

  const memberUserEntities = [];
  for await (const result of members) {
    const entity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: result.username,
      },
      spec: {
        profile: {},
        memberOf: [],
      },
    };
    if (result.name) entity.spec.profile!.displayName = result.name;
    if (result.avatar_url) entity.spec.profile!.picture = result.avatar_url;
    memberUserEntities.push(entity);
  }
  return memberUserEntities;
}

export async function getInstanceUsers(
  client: GitLabClient,
): Promise<UserEntity[]> {
  const users = paginated<User>(
    options => client.pagedRequest('/users', options),
    { active: true, per_page: 100 },
  );

  const userEntities = [];
  for await (const result of users) {
    // skip over bot users
    if (result.bot) {
      continue;
    }

    const entity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: result.username,
      },
      spec: {
        profile: {},
        memberOf: [],
      },
    };
    if (result.name) entity.spec.profile!.displayName = result.name;
    if (result.avatar_url) entity.spec.profile!.picture = result.avatar_url;
    if (result.public_email) entity.spec.profile!.email = result.public_email;
    if (result.email) entity.spec.profile!.email = result.email;
    userEntities.push(entity);
  }
  return userEntities;
}
