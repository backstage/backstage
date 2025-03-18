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

import type { Request, Response } from 'express';
import { BackstageCredentials, BackstagePrincipalTypes } from './AuthService';

/**
 * Provides handling of credentials in an ongoing request.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/http-auth | service documentation} for more details.
 *
 * @public
 */
export interface HttpAuthService {
  /**
   * Extracts the caller's credentials from a request.
   *
   * @remarks
   *
   * The credentials have been validated before returning, and are guaranteed to
   * adhere to whatever policies have been added to this route using
   * {@link HttpRouterService.addAuthPolicy}, if any.
   *
   * Further restrictions can be imposed by passing in options that control the
   * allowed types of credential.
   *
   * You can narrow the returned credentials object to specific principal types
   * using {@link AuthService.isPrincipal}.
   */
  credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    /**
     * An Express request object.
     */
    req: Request<any, any, any, any, any>,
    /**
     * Optional further restrictions.
     */
    options?: {
      /**
       * If specified, allow only principals of the given type(s).
       *
       * If the incoming credentials were not of a type that matched this
       * restriction, a {@link @backstage/errors#NotAllowedError} is thrown.
       *
       * The default is to allow user and service principals.
       */
      allow?: Array<TAllowed>;
      /**
       * If set to true, allow limited access tokens (such as cookies).
       *
       * If this flag is not set, or is set to false, calls with limited access
       * tokens will lead to a {@link @backstage/errors#NotAllowedError} being
       * thrown.
       */
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>>;

  /**
   * Issues a limited access token as a cookie on the given response object.
   * This is only possible for requests that were originally made with user
   * credentials (such as a Backstage token).
   *
   * This must be called before sending any payload data.
   */
  issueUserCookie(
    /**
     * An Express response object.
     */
    res: Response,
    /**
     * Optional further settings.
     */
    options?: {
      /**
       * Issue the cookie for this specific credential. Must be a "user" type
       * principal, or a "none" type (which leads to deleting the cookie).
       *
       * @remarks
       *
       * Normally you do not have to specify this option, because the default
       * behavior is to extract the credentials from the request that
       * corresponded to the given respnse.
       */
      credentials?: BackstageCredentials;
    },
  ): Promise<{ expiresAt: Date }>;
}
