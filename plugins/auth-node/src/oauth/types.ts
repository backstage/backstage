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

import { Config } from '@backstage/config';
import { Request } from 'express';
import { ProfileTransform } from '../types';

/** @public */
export interface OAuthSession {
  accessToken: string;
  tokenType: string;
  idToken?: string;
  scope: string;
  expiresInSeconds?: number;
  refreshToken?: string;
  refreshTokenExpiresInSeconds?: number;
}

/** @public */
export interface OAuthAuthenticatorScopeOptions {
  persist?: boolean;
  required?: string[];
  transform?: (options: {
    /** Scopes requested by the client */
    requested: Iterable<string>;
    /** Scopes which have already been granted */
    granted: Iterable<string>;
    /** Scopes that are required for the authenticator to function */
    required: Iterable<string>;
    /** Additional scopes added through configuration */
    additional: Iterable<string>;
  }) => Iterable<string>;
}

/** @public */
export interface OAuthAuthenticatorStartInput {
  scope: string;
  state: string;
  req: Request;
}

/** @public */
export interface OAuthAuthenticatorAuthenticateInput {
  req: Request;
}

/** @public */
export interface OAuthAuthenticatorRefreshInput {
  /**
   * Signals whether the requested scope has already been granted for the session. Will only be set if the `scopes.persist` option is enabled.
   */
  scopeAlreadyGranted?: boolean;

  scope: string;
  refreshToken: string;
  req: Request;
}

/** @public */
export interface OAuthAuthenticatorLogoutInput {
  accessToken?: string;
  refreshToken?: string;
  req: Request;
}

/** @public */
export interface OAuthAuthenticatorResult<TProfile> {
  fullProfile: TProfile;
  session: OAuthSession;
}

/** @public */
export interface OAuthAuthenticator<TContext, TProfile> {
  defaultProfileTransform: ProfileTransform<OAuthAuthenticatorResult<TProfile>>;
  /** @deprecated use `scopes.persist` instead */
  shouldPersistScopes?: boolean;
  scopes?: OAuthAuthenticatorScopeOptions;
  initialize(ctx: { callbackUrl: string; config: Config }): TContext;
  start(
    input: OAuthAuthenticatorStartInput,
    ctx: TContext,
  ): Promise<{ url: string; status?: number }>;
  authenticate(
    input: OAuthAuthenticatorAuthenticateInput,
    ctx: TContext,
  ): Promise<OAuthAuthenticatorResult<TProfile>>;
  refresh(
    input: OAuthAuthenticatorRefreshInput,
    ctx: TContext,
  ): Promise<OAuthAuthenticatorResult<TProfile>>;
  logout?(input: OAuthAuthenticatorLogoutInput, ctx: TContext): Promise<void>;
}

/** @public */
export function createOAuthAuthenticator<TContext, TProfile>(
  authenticator: OAuthAuthenticator<TContext, TProfile>,
): OAuthAuthenticator<TContext, TProfile> {
  return authenticator;
}
