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

import {
  ApiRef,
  createApiRef,
  AuthRequestOptions,
} from '@backstage/core-plugin-api';

export interface ScmAuthTokenOptions extends AuthRequestOptions {
  /**
   * The URL of the SCM resource to be accessed.
   *
   * @example https://github.com/backstage/backstage
   */
  url: string;

  /**
   * The type of access to be granted.
   */
  scope: {
    /**
     * Whether to request access to be able to read repository content, including
     * read access to management features like issues and pull requests.
     */
    repoRead?: boolean;

    /**
     * Whether to request access to be able to write repository content, including
     * the ability to create management features like issues and pull requests.
     */
    repoWrite?: boolean;
  };
}

export interface ScmAuthTokenResponse {
  /**
   * An authorization token that can be used to authenticate requests.
   */
  token: string;

  /**
   * The set of HTTP headers that are needed to authenticate requests.
   */
  headers: { [name: string]: string };
}

/**
 * ScmAuthApi provides methods for authenticating towards source code management services.
 *
 * As opposed to using the using the GitHub, GitLab and other auth APIs
 * directly, this API allows for more generic access to SCM services.
 */
export interface ScmAuthApi {
  /**
   * Requests credentials for accessing an SCM resource.
   */
  getCredentials(
    options: ScmAuthTokenOptions,
  ): Promise<ScmAuthTokenResponse | undefined>;
}

export const scmAuthApiRef: ApiRef<ScmAuthApi> = createApiRef({
  id: 'core.scmauth',
});
