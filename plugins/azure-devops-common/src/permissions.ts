/*
 * Copyright 2024 The Backstage Authors
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
import { createPermission } from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';

/**
 * @public
 */
export const azureDevOpsPullRequestReadPermission = createPermission({
  name: 'azure.devops.pullrequest.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @public
 */
export const azureDevOpsPullRequestDashboardReadPermission = createPermission({
  name: 'azure.devops.pullrequest.dashboard.read',
  attributes: { action: 'read' },
});

/**
 * @public
 */
export const azureDevOpsPipelineReadPermission = createPermission({
  name: 'azure.devops.pipeline.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @public
 */
export const azureDevOpsGitTagReadPermission = createPermission({
  name: 'azure.devops.gittag.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @public
 */
export const azureDevOpsReadmeReadPermission = createPermission({
  name: 'azure.devops.readme.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @public
 */
export const azureDevOpsPermissions = [
  azureDevOpsPullRequestReadPermission,
  azureDevOpsPipelineReadPermission,
  azureDevOpsGitTagReadPermission,
  azureDevOpsReadmeReadPermission,
  azureDevOpsPullRequestDashboardReadPermission,
];
