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

export * from './atlassian';
export * from './auth0';
export * from './aws-alb';
export * from './bitbucket';
export * from './github';
export * from './gitlab';
export * from './google';
export * from './microsoft';
export * from './oauth2';
export * from './oauth2-proxy';
export * from './oidc';
export * from './okta';
export * from './onelogin';
export * from './saml';
export * from './gcp-iap';

export { providers } from './providers';

export { factories as defaultAuthProviderFactories } from './factories';

export type {
  AuthProviderConfig,
  AuthProviderRouteHandlers,
  AuthProviderFactoryOptions,
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
