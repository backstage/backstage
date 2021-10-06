/*
 * Copyright 2021 The Backstage Authors
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
import { createApiRef } from '@backstage/core-plugin-api';

/**
 * Represents a single Github user profile.
 *
 * @public
 */
export type GithubProfile = {
  // TODO: determine contents
  // /** The contents of the TODO comment */
  // text: string;

  user: string;
};

/**
 * Options used to fetch a Github profile.
 *
 * @public
 */
export type GetProfileOptions = {
  entity?: Entity;
};

/**
 * The result of fetching a Github profile.
 *
 * @public
 */
export type GetProfileResult = {
  profile: GithubProfile;
};

/**
 * The API used by the github user profiles plugin to fetch a Github profile.
 *
 * @public
 */
export interface GithubProfileApi {
  /**
   * Fetches Github user profile.
   *
   * @public
   */
  getProfile(options: GetProfileOptions): Promise<GetProfileResult>;
}

/**
 * ApiRef for the GithubProfileApi.
 *
 * @public
 */
export const githubProfileApiRef = createApiRef<GithubProfileApi>({
  id: 'plugin.user-profiles-github.api',
  description: 'Obtains a Github user profile',
});
