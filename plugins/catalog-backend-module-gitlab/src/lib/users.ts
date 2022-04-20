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
import { GitLabClient } from './client';
import { defaultUserTransformer } from './defaultUserTransformer';
import { GitLabUserResponse, UserTransformer } from './types';

/**
 * Options to configure GitLab user ingestion.
 */
export type ReadUsersOptions = {
  inherited?: boolean;
  blocked?: boolean;
  userTransformer?: UserTransformer;
};

async function transformUsers(
  responses: AsyncGenerator<GitLabUserResponse>,
  transformer: UserTransformer | undefined,
) {
  const result = new Array<UserEntity>();

  for await (const response of responses) {
    const entity = transformer
      ? await transformer({
          user: response,
          defaultTransformer: defaultUserTransformer,
        })
      : defaultUserTransformer(response);
    if (entity) {
      result.push(entity);
    }
  }

  return result;
}

/**
 * Read users from a GitLab target and provides User entities.
 */
export async function readUsers(
  client: GitLabClient,
  targetUrl: string,
  options: ReadUsersOptions = {},
): Promise<UserEntity[]> {
  const users = client.listUsers(targetUrl, { inherited: options.inherited });
  return await transformUsers(users, options.userTransformer);
}
