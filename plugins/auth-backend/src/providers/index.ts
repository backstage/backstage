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

export { AtlassianAuthProvider } from './atlassian';
export type { AwsAlbResult } from './aws-alb';
export type {
  BitbucketOAuthResult,
  BitbucketPassportProfile,
} from './bitbucket';
export type { GithubOAuthResult } from './github';
export type { OAuth2ProxyResult } from './oauth2-proxy';
export type { OidcAuthResult } from './oidc';
export type { SamlAuthResult } from './saml';
export type { GcpIapResult, GcpIapTokenInfo } from './gcp-iap';

export { providers, defaultAuthProviderFactories } from './providers';

export type {
  AuthProviderConfig,
  AuthProviderRouteHandlers,
  AuthProviderFactory,
  AuthHandler,
  AuthResolverCatalogUserQuery,
  AuthResolverContext,
  AuthHandlerResult,
  SignInResolver,
  SignInInfo,
  CookieConfigurer,
  StateEncoder,
  AuthResponse,
  ProfileInfo,
} from './types';

export { prepareBackstageIdentityResponse } from './prepareBackstageIdentityResponse';
