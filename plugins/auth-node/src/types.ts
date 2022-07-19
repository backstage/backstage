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

/**
 * A representation of a successful Backstage sign-in.
 *
 * Compared to the {@link BackstageIdentityResponse} this type omits
 * the decoded identity information embedded in the token.
 *
 * @public
 */
export interface BackstageSignInResult {
  /**
   * The token used to authenticate the user within Backstage.
   */
  token: string;
}

/**
 * Response object containing the {@link BackstageUserIdentity} and the token
 * from the authentication provider.
 *
 * @public
 */
export interface BackstageIdentityResponse extends BackstageSignInResult {
  /**
   * A plaintext description of the identity that is encapsulated within the token.
   */
  identity: BackstageUserIdentity;
}

/**
 * User identity information within Backstage.
 *
 * @public
 */
export type BackstageUserIdentity = {
  /**
   * The type of identity that this structure represents. In the frontend app
   * this will currently always be 'user'.
   */
  type: 'user';

  /**
   * The entityRef of the user in the catalog.
   * For example User:default/sandra
   */
  userEntityRef: string;

  /**
   * The user and group entities that the user claims ownership through
   */
  ownershipEntityRefs: string[];
};
