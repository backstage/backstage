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

/**
 * The type of credentials produced by the credential provider.
 *
 * @public
 */
export type GithubCredentialType = 'app' | 'token';

/**
 * A set of credentials information for a GitHub integration.
 *
 * @public
 */
export type GithubCredentials = {
  headers?: { [name: string]: string };
  token?: string;
  type: GithubCredentialType;
};

/**
 * This allows implementations to be provided to retrieve GitHub credentials.
 *
 * @public
 *
 */
export interface GithubCredentialsProvider {
  getCredentials(opts: { url: string }): Promise<GithubCredentials>;
}
