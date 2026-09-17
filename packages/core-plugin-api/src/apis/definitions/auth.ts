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
/* We want to maintain the same information as an enum, so we disable the redeclaration warning */
/* eslint-disable @typescript-eslint/no-redeclare */

export {
  type AuthProviderInfo,
  type OAuthScope,
  type AuthRequestOptions,
  type OAuthApi,
  type OpenIdConnectApi,
  type ProfileInfoApi,
  type BackstageIdentityApi,
  type BackstageUserIdentity,
  type BackstageIdentityResponse,
  type ProfileInfo,
  SessionState,
  type SessionApi,
  googleAuthApiRef,
  githubAuthApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  microsoftAuthApiRef,
  oneloginAuthApiRef,
  bitbucketAuthApiRef,
  bitbucketServerAuthApiRef,
  atlassianAuthApiRef,
  vmwareCloudAuthApiRef,
  openshiftAuthApiRef,
} from '@backstage/frontend-plugin-api';
