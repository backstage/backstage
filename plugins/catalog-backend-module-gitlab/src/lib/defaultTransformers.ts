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
  GroupNameTransformerOptions,
  GroupTransformerOptions,
  UserTransformerOptions,
} from './types';

export function defaultGroupNameTransformer(
  options: GroupNameTransformerOptions,
): string {
  if (
    options.providerConfig.group &&
    options.group.full_path.startsWith(`${options.providerConfig.group}/`)
  ) {
    return options.group.full_path
      .replace(`${options.providerConfig.group}/`, '')
      .replaceAll('/', '-');
  }
  return options.group.full_path.replaceAll('/', '-');
}

export function defaultGroupEntitiesTransformer(
  options: GroupTransformerOptions,
): GroupEntity[] {
  const idMapped: { [groupId: number]: GitLabGroup } = {};
  const entities: GroupEntity[] = [];

  for (const group of options.groups) {
    idMapped[group.id] = group;
  }

  for (const group of options.groups) {
    const annotations: { [annotationName: string]: string } = {};

    annotations[`${options.providerConfig.host}/team-path`] = group.full_path;
    if (group.visibility !== undefined) {
      annotations[`${options.providerConfig.host}/visibility`] =
        group.visibility;
    }

    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: options.groupNameTransformer({
          group,
          providerConfig: options.providerConfig,
        }),
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

    if (group.parent_id && idMapped.hasOwnProperty(group.parent_id)) {
      entity.spec.parent = options.groupNameTransformer({
        group: idMapped[group.parent_id],
        providerConfig: options.providerConfig,
      });
    }

    entities.push(entity);
  }

  return entities;
}

/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
export function defaultUserTransformer(
  options: UserTransformerOptions,
): UserEntity {
  const annotations: { [annotationName: string]: string } = {};

  annotations[`${options.integrationConfig.host}/user-login`] =
    options.user.web_url;
  if (options.user?.group_saml_identity?.extern_uid) {
    annotations[`${options.integrationConfig.host}/saml-external-uid`] =
      options.user.group_saml_identity.extern_uid;
  }

  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: options.user.username,
      annotations: annotations,
    },
    spec: {
      profile: {
        displayName: options.user.name || undefined,
        picture: options.user.avatar_url || undefined,
      },
      memberOf: [],
    },
  };

  if (options.user.email) {
    if (!entity.spec) {
      entity.spec = {};
    }

    if (!entity.spec.profile) {
      entity.spec.profile = {};
    }

    entity.spec.profile.email = options.user.email;
  }

  if (options.user.groups) {
    for (const group of options.user.groups) {
      if (!entity.spec.memberOf) {
        entity.spec.memberOf = [];
      }
      entity.spec.memberOf.push(
        options.groupNameTransformer({
          group,
          providerConfig: options.providerConfig,
        }),
      );
    }
  }

  return entity;
}
