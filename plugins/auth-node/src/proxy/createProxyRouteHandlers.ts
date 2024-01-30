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

import { Request, Response } from 'express';
import { Config } from '@backstage/config';
import {
  AuthProviderRouteHandlers,
  AuthResolverContext,
  BACKSTAGE_AUTH_COOKIE_NAME,
  ClientAuthResponse,
  ProfileTransform,
  SignInResolver,
} from '../types';
import { ProxyAuthenticator } from './types';
import { prepareBackstageIdentityResponse } from '../identity';
import { NotImplementedError } from '@backstage/errors';

/** @public */
export interface ProxyAuthRouteHandlersOptions<TResult> {
  authenticator: ProxyAuthenticator<any, TResult>;
  config: Config;
  appUrl: string;
  resolverContext: AuthResolverContext;
  signInResolver: SignInResolver<TResult>;
  profileTransform?: ProfileTransform<TResult>;
}

/** @public */
export function createProxyAuthRouteHandlers<TResult>(
  options: ProxyAuthRouteHandlersOptions<TResult>,
): AuthProviderRouteHandlers {
  const { authenticator, appUrl, config, resolverContext, signInResolver } =
    options;

  const profileTransform =
    options.profileTransform ?? authenticator.defaultProfileTransform;
  const authenticatorCtx = authenticator.initialize({ config });

  return {
    async start(): Promise<void> {
      throw new NotImplementedError('Not implemented');
    },

    async frameHandler(): Promise<void> {
      throw new NotImplementedError('Not implemented');
    },

    async refresh(this: never, req: Request, res: Response): Promise<void> {
      const { result } = await authenticator.authenticate(
        { req },
        authenticatorCtx,
      );

      const { profile } = await profileTransform(result, resolverContext);

      const identity = await signInResolver(
        { profile, result },
        resolverContext,
      );

      const backstageIdentity = prepareBackstageIdentityResponse(identity);

      const response: ClientAuthResponse<{}> = {
        profile,
        providerInfo: {},
        backstageIdentity,
      };

      res
        .status(200)
        .cookie(BACKSTAGE_AUTH_COOKIE_NAME, backstageIdentity.token, {
          httpOnly: true,
          secure: new URL(backendUrl).protocol === 'https:',
          sameSite: 'lax',
          maxAge: backstageIdentity.expiresInSeconds
            ? backstageIdentity.expiresInSeconds * 1000
            : 24 * 60 * 60 * 1000, // 24h max,
        })
        .json(response);
    },

    async logout(_req, res) {
      res.clearCookie(BACKSTAGE_AUTH_COOKIE_NAME).sendStatus(200);
    },
  };
}
