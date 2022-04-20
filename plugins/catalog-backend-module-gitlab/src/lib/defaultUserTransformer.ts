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
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  UserEntity,
} from '@backstage/catalog-model';
import { GitLabUserResponse } from './types';

/**
 * The default implementation to map a GitLab user response to a User entity.
 */
export function defaultUserTransformer(
  user: GitLabUserResponse,
): UserEntity | undefined {
  if (user.bot) {
    return undefined;
  }

  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: user.username,
      annotations: {
        [ANNOTATION_LOCATION]: `url:${user.web_url}`,
        [ANNOTATION_ORIGIN_LOCATION]: `url:${user.web_url}`,
      },
    },
    spec: {
      profile: {},
      memberOf: [],
    },
  };

  if (user.name) {
    entity.spec.profile!.displayName = user.name;
  }
  if (user.avatar_url) {
    entity.spec.profile!.picture = user.avatar_url;
  }
  if (user.public_email || user.email) {
    entity.spec.profile!.email = user.public_email || user.email;
  }

  return entity;
}
