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
import { AuthResolverContext, ProfileInfo } from '../types';

export interface OAuthSession {
  accessToken: string;
  tokenType: string;
  idToken?: string;
  scope: string;
  expiresInSeconds: number;
  refreshToken?: string;
}

export type OAuthProfileTransform<TProfile> = (
  result: OAuthAuthenticatorResult<TProfile>,
  context: AuthResolverContext,
) => Promise<{ profile: ProfileInfo }>;

export interface OAuthAuthenticatorStartInput {
  scope: string;
  state: string;
  req: Request;
}

export interface OAuthAuthenticatorAuthenticateInput {
  req: Request;
}

export interface OAuthAuthenticatorRefreshInput {
  scope: string;
  refreshToken: string;
  req: Request;
}

export interface OAuthAuthenticatorLogoutInput {
  accessToken?: string;
  refreshToken?: string;
  req: Request;
}

export interface OAuthAuthenticatorResult<TProfile> {
  fullProfile: TProfile;
  session: OAuthSession;
}

export interface OAuthAuthenticator<TContext, TProfile> {
  defaultProfileTransform: OAuthProfileTransform<TProfile>;
  shouldPersistScopes?: boolean;
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

export function createOAuthAuthenticator<TContext, TProfile>(
  authenticator: OAuthAuthenticator<TContext, TProfile>,
): OAuthAuthenticator<TContext, TProfile> {
  return authenticator;
}
