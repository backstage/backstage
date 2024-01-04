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
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  BasicPermission,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';

import express from 'express';

import { DefaultServiceUser } from './constants';
import { RouterOptions } from './types';

export type GetLoggedInUserOptions = Pick<
  RouterOptions,
  'identity' | 'tokenManager' | 'externalCallerSecret'
>;
export type CheckUserPermission = GetLoggedInUserOptions &
  Pick<RouterOptions, 'permissions'>;

/*
 * User's entity must be present in the catalog.
 */
export const getLoggedInUser = async (
  request: express.Request,
  { identity, tokenManager, externalCallerSecret }: GetLoggedInUserOptions,
): Promise<string> => {
  const identityResponse = await identity.getIdentity({ request });

  // To properly set identity, see packages/backend/src/plugins/auth.ts or https://backstage.io/docs/auth/identity-resolver
  if (identityResponse) {
    // The auth token contains user's identity, most probably originated in the FE
    // Example: user:default/guest
    let author = identityResponse?.identity.userEntityRef;
    if (author) {
      if (author.startsWith('user:')) {
        author = author.slice('user:'.length);
      }
    } else {
      throw new AuthenticationError(
        'Missing valid authentication data or the user is not in the Catalog.',
      );
    }
    return author;
  }

  const token = getBearerTokenFromAuthorizationHeader(
    request.header('authorization'),
  );
  if (token) {
    // backend service-to-service flow
    await tokenManager.authenticate(token);
  }

  // External call - workaround
  // Following shared-secret is a workaround till we make the creation of valid JWT tokens by external callers simple.
  // In such case, the flow would be identical with the service-to-service.
  // https://github.com/backstage/backstage/issues/18622
  // https://github.com/backstage/backstage/issues/9374
  if (externalCallerSecret) {
    if (request.header('notifications-secret') === externalCallerSecret) {
      return DefaultServiceUser;
    }
    throw new AuthenticationError('Provided shared secret does not match.');
  }

  // Since the shared secret has not been requested in the configuration, we ALLOW the request
  return DefaultServiceUser;
};

export const checkPermission = async (
  request: express.Request,
  permissions: PermissionEvaluator,
  permission: BasicPermission,
  loggedInUser: string,
) => {
  const token = getBearerTokenFromAuthorizationHeader(
    request.header('authorization'),
  );
  const decision = (
    await permissions.authorize([{ permission }], {
      token,
    })
  )[0];

  if (decision.result === AuthorizeResult.DENY) {
    throw new NotAllowedError(
      `The user ${loggedInUser} is not authorized to ${permission.name}`,
    );
  }
};

/**
 * Checks if the logged-in user has the required permission
 * and returns the username.
 */
export const checkUserPermission = async (
  request: express.Request,
  options: CheckUserPermission,
  requiredPermission: BasicPermission,
): Promise<string> => {
  const loggedInUser = await getLoggedInUser(request, options);
  await checkPermission(
    request,
    options.permissions,
    requiredPermission,
    loggedInUser,
  );
  return loggedInUser;
};
