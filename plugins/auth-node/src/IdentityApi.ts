/*
 * Copyright 2020 The Backstage Authors
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

import { Request } from 'express';
import { BackstageIdentityResponse } from './signInTypes';

/**
 * Options to request the identity from a Backstage backend request.
 *
 * @public
 */
export type IdentityApiGetIdentityRequest = {
  request: Request<unknown>;
};

/**
 * A verified token that represented a user.
 *
 * @public
 */
export interface UserTokenIdentity {
  type: 'user';

  /**
   * The raw token.
   *
   * @remarks
   *
   * This can be used for performing requests to other services when you
   * explicitly need to perform them on behalf of the user.
   */
  token: string;

  /**
   * The entityRef of the user in the catalog, as extracted from the token.
   *
   * @example user:default/sandra
   */
  userEntityRef: string;

  /**
   * The user and group entities that the user claims ownership through, as
   * extracted from the token.
   *
   * @example ["user:default/sandra", "group:default/team-a"]
   */
  ownershipEntityRefs: string[];
}

/**
 * An identity client api to authenticate Backstage tokens.
 *
 * @experimental This is not a stable API yet
 * @public
 */
export interface IdentityApi {
  /**
   * Extracts and verifies (if present) a Backstage user token out of the given
   * request.
   *
   * @returns The corresponding identity if a Backstage user token existed and
   *          was valid, or undefined if no token was present.
   * @throws If a token existed and was either not a user token, or invalid.
   * @deprecated Use the `getUserIdentity` method instead. This method will be
   *             removed in a future release.
   */
  getIdentity(
    options: IdentityApiGetIdentityRequest,
  ): Promise<BackstageIdentityResponse | undefined>;

  /**
   * Extracts and verifies (if present) a Backstage user token out of the given
   * request. Note that this method will throw if a token that is NOT a user
   * token was found.
   *
   * @returns The corresponding identity if a Backstage user token existed and
   *          was valid, or undefined if no token was present.
   * @throws If a token existed and was either not a user token, or invalid.
   */
  getUserIdentity(
    options: IdentityApiGetIdentityRequest,
  ): Promise<UserTokenIdentity | undefined>;
}
