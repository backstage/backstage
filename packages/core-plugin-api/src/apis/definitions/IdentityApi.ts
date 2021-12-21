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
import { ApiRef, createApiRef } from '../system';
import { BackstageUserIdentity, ProfileInfo } from './auth';

/**
 * The Identity API used to identify and get information about the signed in user.
 *
 * @public
 */
export type IdentityApi = {
  /**
   * The ID of the signed in user. This ID is not meant to be presented to the user, but used
   * as an opaque string to pass on to backends or use in frontend logic.
   *
   * @deprecated use {@link IdentityApi.getBackstageIdentity} instead.
   */
  getUserId(): string;

  /**
   * An OpenID Connect ID Token which proves the identity of the signed in user.
   *
   * The ID token will be undefined if the signed in user does not have a verified
   * identity, such as a demo user or mocked user for e2e tests.
   *
   * @deprecated use {@link IdentityApi.getCredentials} instead.
   */
  getIdToken(): Promise<string | undefined>;

  /**
   * The profile of the signed in user.
   *
   * @deprecated use {@link IdentityApi.getProfileInfo} instead.
   */
  getProfile(): ProfileInfo;

  /**
   * The profile of the signed in user.
   */
  getProfileInfo(): Promise<ProfileInfo>;

  /**
   * User identity information within Backstage.
   */
  getBackstageIdentity(): Promise<BackstageUserIdentity>;

  /**
   * Provides credentials in the form of a token which proves the identity of the signed in user.
   *
   * The token will be undefined if the signed in user does not have a verified
   * identity, such as a demo user or mocked user for e2e tests.
   */
  getCredentials(): Promise<{ token?: string }>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;
};

/**
 * The {@link ApiRef} of {@link IdentityApi}.
 *
 * @public
 */
export const identityApiRef: ApiRef<IdentityApi> = createApiRef({
  id: 'core.identity',
});
