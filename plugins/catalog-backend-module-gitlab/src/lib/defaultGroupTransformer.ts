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
  GroupEntity,
} from '@backstage/catalog-model';
import { GitLabGroupResponse } from './types';

/**
 * The default implementation to map a GitLab group response to a Group entity.
 */
export function defaultGroupTransformer(
  group: GitLabGroupResponse,
  options: { pathDelimiter: string; groupType: string },
): GroupEntity | undefined {
  const entity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: group.full_path.replaceAll('/', options.pathDelimiter),
      annotations: {
        [ANNOTATION_LOCATION]: `url:${group.web_url}`,
        [ANNOTATION_ORIGIN_LOCATION]: `url:${group.web_url}`,
      },
    },
    spec: {
      type: options.groupType,
      profile: {},
      children: [],
      members: [],
    },
  };

  if (group.description) {
    entity.metadata!.description = group.description;
  }
  if (group.name) {
    entity.spec!.profile!.displayName = group.name;
  }
  if (group.avatar_url) {
    entity.spec.profile!.picture = group.avatar_url;
  }

  return entity;
}
