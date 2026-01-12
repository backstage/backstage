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
