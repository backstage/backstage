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

import {
  MICROSOFT_EMAIL_ANNOTATION,
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from './constants';
import { normalizeEntityName } from './helper';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

/**
 * The default implementation of the transformation from a graph organization
 * entry to a Group entity.
 *
 * @public
 */
export async function defaultOrganizationTransformer(
  organization: MicrosoftGraph.Organization,
): Promise<GroupEntity | undefined> {
  if (!organization.id || !organization.displayName) {
    return undefined;
  }

  const name = normalizeEntityName(organization.displayName!);
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: name,
      description: organization.displayName!,
      annotations: {
        [MICROSOFT_GRAPH_TENANT_ID_ANNOTATION]: organization.id!,
      },
    },
    spec: {
      type: 'root',
      profile: {
        displayName: organization.displayName!,
      },
      children: [],
    },
  };
}

function extractGroupName(group: MicrosoftGraph.Group): string {
  if (group.securityEnabled) {
    return group.displayName as string;
  }
  return (group.mailNickname || group.displayName) as string;
}

/**
 * The default implementation of the transformation from a graph group entry to
 * a Group entity.
 *
 * @public
 */
export async function defaultGroupTransformer(
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
): Promise<GroupEntity | undefined> {
  if (!group.id || !group.displayName) {
    return undefined;
  }

  const name = normalizeEntityName(extractGroupName(group));
  const entity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: name,
      annotations: {
        [MICROSOFT_GRAPH_GROUP_ID_ANNOTATION]: group.id,
      },
    },
    spec: {
      type: 'team',
      profile: {},
      children: [],
    },
  };

  if (group.description) {
    entity.metadata.description = group.description;
  }
  if (group.displayName) {
    entity.spec.profile!.displayName = group.displayName;
  }
  if (group.mail) {
    entity.spec.profile!.email = group.mail;
  }
  if (groupPhoto) {
    entity.spec.profile!.picture = groupPhoto;
  }

  return entity;
}

/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
export async function defaultUserTransformer(
  user: MicrosoftGraph.User,
  userPhoto?: string,
): Promise<UserEntity | undefined> {
  if (!user.id || !user.displayName || !user.mail) {
    return undefined;
  }

  const name = normalizeEntityName(user.mail);
  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name,
      annotations: {
        [MICROSOFT_EMAIL_ANNOTATION]: user.mail!,
        [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: user.id!,
      },
    },
    spec: {
      profile: {
        displayName: user.displayName!,
        email: user.mail!,

        // TODO: Additional fields?
        // jobTitle: user.jobTitle || undefined,
        // officeLocation: user.officeLocation || undefined,
        // mobilePhone: user.mobilePhone || undefined,
      },
      memberOf: [],
    },
  };

  if (userPhoto) {
    entity.spec.profile!.picture = userPhoto;
  }

  return entity;
}
