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

import { Entity } from '@backstage/catalog-model';

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
   * An opaque ID that uniquely identifies the user within Backstage.
   *
   * This is typically the same as the user entity `metadata.name`.
   *
   * @deprecated Use the `identity` field instead
   */
  id: string;

  /**
   * The entity that the user is represented by within Backstage.
   *
   * This entity may or may not exist within the Catalog, and it can be used
   * to read and store additional metadata about the user.
   *
   * @deprecated Use the `identity` field instead.
   */
  entity?: Entity;

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
 * The response shape of an auth attempt.
 *
 * @public
 */
export type AuthResponse<TProviderInfo> = {
  providerInfo: TProviderInfo;
  profile: ProfileInfo;
  backstageIdentity?: BackstageIdentityResponse;
};

/**
 * The old exported symbol for {@link BackstageSignInResult}.
 *
 * @public
 * @deprecated Use the {@link BackstageSignInResult} instead.
 */
export type BackstageIdentity = BackstageSignInResult;

/**
 * Used to display login information to user, i.e. sidebar popup.
 *
 * It is also temporarily used as the profile of the signed-in user's Backstage
 * identity, but we want to replace that with data from identity and/org catalog
 * service
 *
 * @public
 */
export type ProfileInfo = {
  /**
   * Email ID of the signed in user.
   */
  email?: string;
  /**
   * Display name that can be presented to the signed in user.
   */
  displayName?: string;
  /**
   * URL to an image that can be used as the display image or avatar of the
   * signed in user.
   */
  picture?: string;
};
