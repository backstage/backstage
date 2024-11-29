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

/**
 * Common functionality and types for the Backstage auth plugin.
 *
 * @packageDocumentation
 */

export * from './extensions';
export * from './flow';
export * from './identity';
export * from './oauth';
export * from './passport';
export * from './proxy';
export * from './sign-in';
export type {
  AuthProviderConfig,
  AuthProviderFactory,
  AuthProviderRouteHandlers,
  AuthResolverCatalogUserQuery,
  AuthResolverContext,
  BackstageIdentityResponse,
  BackstageSignInResult,
  BackstageUserIdentity,
  ClientAuthResponse,
  CookieConfigurer,
  ProfileInfo,
  ProfileTransform,
  SignInInfo,
  SignInResolver,
  TokenParams,
  AuthOwnershipResolver,
} from './types';
export { tokenTypes } from './types';
