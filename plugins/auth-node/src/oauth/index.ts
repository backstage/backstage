/*
 * Copyright 2023 The Backstage Authors
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

export {
  createOAuthRouteHandlers,
  type OAuthRouteHandlersOptions,
} from './createOAuthRouteHandlers';
export {
  PassportOAuthAuthenticatorHelper,
  type PassportOAuthDoneCallback,
  type PassportOAuthPrivateInfo,
  type PassportOAuthResult,
} from './PassportOAuthAuthenticatorHelper';
export { OAuthEnvironmentHandler } from './OAuthEnvironmentHandler';
export { createOAuthProviderFactory } from './createOAuthProviderFactory';
export {
  encodeOAuthState,
  decodeOAuthState,
  type OAuthState,
  type OAuthStateTransform,
} from './state';
export {
  createOAuthAuthenticator,
  type OAuthAuthenticator,
  type OAuthAuthenticatorAuthenticateInput,
  type OAuthAuthenticatorLogoutInput,
  type OAuthAuthenticatorRefreshInput,
  type OAuthAuthenticatorResult,
  type OAuthAuthenticatorScopeOptions,
  type OAuthAuthenticatorStartInput,
  type OAuthSession,
} from './types';
