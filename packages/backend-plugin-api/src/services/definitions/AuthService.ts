/*
 * Copyright 2022 The Backstage Authors
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

import { PermissionAttributes } from '@backstage/plugin-permission-common';
import { JsonObject } from '@backstage/types';

/**
 * Represents a user principal (for example when a user Backstage token issued
 * by the auth backend was given to a request).
 *
 * @remarks
 *
 * Additional information about the user can be fetched using the
 * {@link UserInfoService}.
 *
 * @public
 */
export type BackstageUserPrincipal = {
  type: 'user';

  /**
   * The entity ref of the user entity that this principal represents.
   */
  userEntityRef: string;
};

/**
 * Represents a principal that is not authenticated (for example when no token
 * at all was given to a request).
 *
 * @public
 */
export type BackstageNonePrincipal = {
  type: 'none';
};

/**
 * Represents a service principal (for example when an external access method
 * token was given to a request, or the caller was a Backstage backend plugin).
 * @public
 */
export type BackstageServicePrincipal = {
  type: 'service';

  /**
   * A string that represents the service.
   *
   * @remarks
   *
   * This string is only informational, has no well defined semantics, and
   * should never be used to drive actual logic in code.
   */
  subject: string; // Exact format TBD, possibly 'plugin:<pluginId>' or 'external:<externalServiceId>'

  /**
   * The access restrictions that apply to this principal.
   *
   * @remarks
   *
   * If no access restrictions are provided the principal is assumed to have
   * unlimited access, at a framework level. The permissions system and
   * individual plugins may or may not still apply additional access controls on
   * top of this.
   */
  accessRestrictions?: BackstagePrincipalAccessRestrictions;
};

/**
 * The access restrictions that apply to a given principal.
 *
 * @public
 */
export type BackstagePrincipalAccessRestrictions = {
  /**
   * If given, the principal is limited to only performing actions with these
   * named permissions.
   *
   * Note that this only applies where permissions checks are enabled in the
   * first place. Endpoints that are not protected by the permissions system at
   * all, are not affected by this setting.
   *
   * This array always has at least one element, or is missing entirely.
   */
  permissionNames?: string[];
  /**
   * If given, the principal is limited to only performing actions whose
   * permissions have these attributes.
   *
   * Note that this only applies where permissions checks are enabled in the
   * first place. Endpoints that are not protected by the permissions system at
   * all, are not affected by this setting.
   *
   * This object always has at least one key, or is missing entirely.
   */
  permissionAttributes?: {
    /**
     * Match any of these action values. This array always has at least one
     * element, or is missing entirely.
     */
    action?: Array<Required<PermissionAttributes>['action']>;
  };
};

/**
 * An opaque representation of credentials, for example as passed in a
 * request-response flow.
 *
 * @public
 */
export type BackstageCredentials<TPrincipal = unknown> = {
  $$type: '@backstage/BackstageCredentials';

  /**
   * If the credentials have a limited lifetime, this is the time at which they
   * expire and may no longer be accepted by a receiver.
   */
  expiresAt?: Date;

  /**
   * The principal (originator) of the request.
   *
   * @remarks
   *
   * This is semantically the originator of a request chain, and may or may not
   * represent the immediate caller of your service. For example, in
   * on-behalf-of scenarios, the immediate caller may be an intermediary backend
   * service, but the principal may still be a user that was the original
   * caller.
   */
  principal: TPrincipal;
};

/**
 * The types of principal that can be represented in a
 * {@link BackstageCredentials} object.
 *
 * @public
 */
export type BackstagePrincipalTypes = {
  user: BackstageUserPrincipal;
  service: BackstageServicePrincipal;
  none: BackstageNonePrincipal;
  unknown: unknown;
};

/**
 * Provides token authentication and credentials management.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/auth | service documentation} for more details.
 *
 * @public
 */
export interface AuthService {
  /**
   * Verifies a token and returns the associated credentials.
   */
  authenticate(
    token: string,
    options?: {
      /**
       * If set to true, allow limited access tokens (such as cookies).
       *
       * If this flag is not set, or is set to false, calls with limited access
       * tokens will lead to a {@link @backstage/errors#NotAllowedError} being
       * thrown.
       */
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials>;

  /**
   * Checks if the given credentials are of the given type, and narrows the
   * TypeScript type accordingly if there's a match.
   */
  isPrincipal<TType extends keyof BackstagePrincipalTypes>(
    credentials: BackstageCredentials,
    type: TType,
  ): credentials is BackstageCredentials<BackstagePrincipalTypes[TType]>;

  /**
   * Create a credentials object that represents an unauthenticated caller.
   */
  getNoneCredentials(): Promise<BackstageCredentials<BackstageNonePrincipal>>;

  /**
   * Create a credentials object that represents the current service itself.
   */
  getOwnServiceCredentials(): Promise<
    BackstageCredentials<BackstageServicePrincipal>
  >;

  /**
   * Issue a token that can be used for authenticating calls towards other
   * backend plugins.
   *
   * @remarks
   *
   * This method should be called before each request. Do not hold on to the
   * issued token and reuse it for future calls.
   */
  getPluginRequestToken(options: {
    /**
     * The credentials of the originator of the request.
     *
     * @remarks
     *
     * This is most commonly the result of
     * {@link AuthService.getOwnServiceCredentials} when the current service is
     * the originator, or the output of {@link HttpAuthService.credentials} when
     * performing requests on behalf of an incoming request identity.
     */
    onBehalfOf: BackstageCredentials;
    /**
     * The ID of the plugin that the request is being made to.
     */
    targetPluginId: string;
  }): Promise<{ token: string }>;

  /**
   * Issue a limited user token that can be used e.g. in cookie flows.
   */
  getLimitedUserToken(
    /**
     * The credentials that this token should represent. Must be a user
     * principal. Commonly the output of {@link HttpAuthService.credentials} is
     * used as the input.
     */
    credentials: BackstageCredentials<BackstageUserPrincipal>,
  ): Promise<{ token: string; expiresAt: Date }>;

  /**
   * Retrieve the public keys that have been used to sign tokens that were
   * issued by this service. This list is periodically pruned from keys that are
   * significantly past their expiry.
   */
  listPublicServiceKeys(): Promise<{
    keys: JsonObject[];
  }>;
}
