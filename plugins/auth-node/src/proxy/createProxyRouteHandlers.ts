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
  ClientAuthResponse,
  ProfileTransform,
  SignInResolver,
} from '../types';
import { ProxyAuthenticator } from './types';
import { prepareBackstageIdentityResponse } from '../identity';
import { NotImplementedError } from '@backstage/errors';

/** @public */
export interface ProxyAuthRouteHandlersOptions<TResult> {
  authenticator: ProxyAuthenticator<any, TResult, unknown, unknown>;
  config: Config;
  resolverContext: AuthResolverContext;
  signInResolver: SignInResolver<TResult>;
  profileTransform?: ProfileTransform<TResult>;
}

/** @public */
export function createProxyAuthRouteHandlers<TResult>(
  options: ProxyAuthRouteHandlersOptions<TResult>,
): AuthProviderRouteHandlers {
  const { authenticator, config, resolverContext, signInResolver } = options;

  const profileTransform =
    options.profileTransform ?? authenticator.defaultProfileTransform;
  const authenticatorCtx = authenticator.initialize({ config });

  const logoutCallback = authenticator.logout
    ? async (req: Request, res: Response): Promise<void> => {
        authenticator.logout?.({ req, res }, await authenticatorCtx);
      }
    : undefined;

  return {
    async start(): Promise<void> {
      throw new NotImplementedError('Not implemented');
    },

    async frameHandler(): Promise<void> {
      throw new NotImplementedError('Not implemented');
    },

    async refresh(this: never, req: Request, res: Response): Promise<void> {
      const { result, providerInfo } = await authenticator.authenticate(
        { req },
        authenticatorCtx,
      );

      const { profile } = await profileTransform(result, resolverContext);

      const identity = await signInResolver(
        { profile, result },
        resolverContext,
      );

      const response: ClientAuthResponse<unknown> = {
        profile,
        providerInfo,
        backstageIdentity: prepareBackstageIdentityResponse(identity),
      };

      res.status(200).json(response);
    },

    logout: logoutCallback,
  };
}
