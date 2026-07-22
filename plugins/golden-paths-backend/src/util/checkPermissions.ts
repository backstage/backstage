/*
 * Copyright 2026 The Backstage Authors
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
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import {
  AuthorizeResult,
  BasicPermission,
  PolicyDecision,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import { SerializedTask } from '../golden-paths';

export type checkPermissionOptions = {
  credentials: BackstageCredentials;
  permissions: BasicPermission[];
  permissionService?: PermissionsService;
};

export type checkResourcePermissionOptions = {
  credentials: BackstageCredentials;
  permissions: ResourcePermission[];
  permissionService?: PermissionsService;
  task?: SerializedTask;
  isTaskAuthorized: (
    decision: PolicyDecision,
    resource: SerializedTask | undefined,
  ) => boolean;
};

/**
 * Does a basic check on permissions. Throws 403 error if any permission responds with AuthorizeResult.DENY
 * @public
 */
export async function checkPermission(options: checkPermissionOptions) {
  const { permissions, permissionService, credentials } = options;
  if (!permissionService) return;
  const permissionRequest = permissions.map(permission => ({
    permission,
  }));
  const authorizationResponses = await permissionService.authorize(
    permissionRequest,
    { credentials: credentials },
  );

  for (const response of authorizationResponses) {
    if (response.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }
  }
}

/**
 * Does a conditional permission check for Golden Paths tasks including Templates execution.
 * Throws 403 error if permission responds with AuthorizeResult.DENY, or does not resolve to true during the conditional rule check
 * @public
 */
export async function checkResourcePermission(
  options: checkResourcePermissionOptions,
) {
  const {
    permissions,
    permissionService,
    credentials,
    task,
    isTaskAuthorized,
  } = options;
  if (permissionService) {
    const permissionRequest = permissions.map(permission => ({
      permission,
    }));
    const authorizationResponses = await permissionService.authorizeConditional(
      permissionRequest,
      {
        credentials,
      },
    );
    for (const response of authorizationResponses) {
      if (task) {
        if (
          response.result === AuthorizeResult.DENY ||
          !isTaskAuthorized(response, task)
        ) {
          throw new NotAllowedError();
        }
      } else {
        if (response.result === AuthorizeResult.DENY) {
          throw new NotAllowedError();
        }
      }
    }
  }
}
