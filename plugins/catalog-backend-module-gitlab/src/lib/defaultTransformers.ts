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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  GitLabGroup,
  GitLabUser,
  GitlabProviderConfig,
  GroupNameTransformer,
} from './types';
import { GitLabIntegrationConfig } from '@backstage/integration';

export function defaultGroupNameTransformer(
  group: GitLabGroup,
  config: GitlabProviderConfig,
): string {
  if (config.group && group.full_path.startsWith(`${config.group}/`)) {
    return group.full_path.replace(`${config.group}/`, '').replaceAll('/', '-');
  }
  return group.full_path.replaceAll('/', '-');
}

export function defaultGroupTransformer(
  group: GitLabGroup,
  providerConfig: GitlabProviderConfig,
  groupNameTransformer: GroupNameTransformer,
): GroupEntity {
  const annotations: { [annotationName: string]: string } = {};

  annotations[`${providerConfig.host}/team-path`] = group.full_path;

  const entity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: groupNameTransformer(group, providerConfig),
      annotations: annotations,
    },
    spec: {
      type: 'team',
      children: [],
      profile: {
        displayName: group.name,
      },
    },
  };

  if (group.description) {
    entity.metadata.description = group.description;
  }

  return entity;
}

/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
export function defaultUserTransformer(
  user: GitLabUser,
  integrationConfig: GitLabIntegrationConfig,
  providerConfig: GitlabProviderConfig,
  groupNameTransformer: GroupNameTransformer,
): UserEntity {
  const annotations: { [annotationName: string]: string } = {};

  annotations[`${integrationConfig.host}/user-login`] = user.web_url;
  if (user?.group_saml_identity?.extern_uid) {
    annotations[`${integrationConfig.host}/saml-external-uid`] =
      user.group_saml_identity.extern_uid;
  }

  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: user.username,
      annotations: annotations,
    },
    spec: {
      profile: {
        displayName: user.name || undefined,
        picture: user.avatar_url || undefined,
      },
      memberOf: [],
    },
  };

  if (user.email) {
    if (!entity.spec) {
      entity.spec = {};
    }

    if (!entity.spec.profile) {
      entity.spec.profile = {};
    }

    entity.spec.profile.email = user.email;
  }

  if (user.groups) {
    for (const group of user.groups) {
      if (!entity.spec.memberOf) {
        entity.spec.memberOf = [];
      }
      entity.spec.memberOf.push(groupNameTransformer(group, providerConfig));
    }
  }

  return entity;
}
