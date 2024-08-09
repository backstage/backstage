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

export type checkBasicPermissionOptions = {
  credentials: BackstageCredentials;
  permissions: BasicPermission[];
  permissionService?: PermissionsService;
  throwError?: boolean;
};

export type checkTaskPermissionOptions = {
  credentials: BackstageCredentials;
  permission: ResourcePermission;
  permissionService?: PermissionsService;
  createdBy?: string;
  isTaskAuthorized: (
    decision: PolicyDecision,
    resource: string | undefined,
  ) => boolean;
};

/**
 * Does a basic check on permissions.
 * If throwError is set to true, throws 403 error if any permission responds with AuthorizeResult.DENY
 * Otherwise, it will return false instead of throwing an error
 * @public
 */
export async function checkBasicPermission(
  options: checkBasicPermissionOptions,
) {
  const { permissions, permissionService, credentials } = options;
  if (permissionService) {
    const permissionRequest = permissions.map(permission => ({
      permission,
    }));
    const authorizationResponses = await permissionService.authorize(
      permissionRequest,
      { credentials: credentials },
    );

    for (const response of authorizationResponses) {
      if (response.result === AuthorizeResult.DENY) {
        if (options.throwError) {
          throw new NotAllowedError();
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Does a conditional permission check for scaffolder task reading and cancellation.
 * Throws 403 error if permission responds with AuthorizeResult.DENY, or does not resolve to true during the conditional rule check
 * @public
 */
export async function checkTaskPermission(options: checkTaskPermissionOptions) {
  const {
    permission,
    permissionService,
    credentials,
    createdBy,
    isTaskAuthorized,
  } = options;
  if (permissionService) {
    const [taskDecision] = await permissionService.authorizeConditional(
      [{ permission: permission }],
      { credentials },
    );
    if (
      taskDecision.result === AuthorizeResult.DENY ||
      !isTaskAuthorized(taskDecision, createdBy)
    ) {
      throw new NotAllowedError();
    }
  }
}
