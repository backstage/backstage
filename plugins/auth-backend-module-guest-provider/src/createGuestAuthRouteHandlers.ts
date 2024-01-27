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

import type { Request, Response } from 'express';
import type { Config } from '@backstage/config';
import {
  AuthProviderRouteHandlers,
  AuthResolverContext,
  ClientAuthResponse,
  ProfileTransform,
  SignInResolver,
  prepareBackstageIdentityResponse,
  sendWebMessageResponse,
} from '@backstage/plugin-auth-node';
import { GuestInfo } from './types';

/** @public */
export interface GuestAuthRouteHandlersOptions {
  config: Config;
  baseUrl: string;
  appUrl: string;
  resolverContext: AuthResolverContext;
  signInResolver: SignInResolver<GuestInfo>;
  profileTransform?: ProfileTransform<GuestInfo>;
}

const DEFAULT_RESULT: GuestInfo = { name: 'Guest' };

/** @public */
export function createGuestAuthRouteHandlers(
  options: GuestAuthRouteHandlersOptions,
): AuthProviderRouteHandlers {
  const { resolverContext, signInResolver, appUrl } = options;

  const defaultTransform: ProfileTransform<GuestInfo> = async result => {
    return {
      profile: {
        displayName: result.name,
      },
    };
  };

  const profileTransform = options.profileTransform ?? defaultTransform;
  return {
    async start(_, res): Promise<void> {
      res.redirect('handler/frame');
    },

    async frameHandler(_, res): Promise<void> {
      const { profile } = await profileTransform(
        DEFAULT_RESULT,
        resolverContext,
      );
      const response: ClientAuthResponse<GuestInfo> = {
        profile,
        providerInfo: {
          name: 'Guest',
        },
      };
      if (signInResolver) {
        const identity = await signInResolver(
          { profile, result: DEFAULT_RESULT },
          resolverContext,
        );
        response.backstageIdentity = prepareBackstageIdentityResponse(identity);
      }
      // post message back to popup if successful
      sendWebMessageResponse(res, appUrl, {
        type: 'authorization_response',
        response,
      });
    },

    async refresh(this: never, _: Request, res: Response): Promise<void> {
      const { profile } = await profileTransform(
        DEFAULT_RESULT,
        resolverContext,
      );

      const identity = await signInResolver(
        { profile, result: DEFAULT_RESULT },
        resolverContext,
      );

      const response: ClientAuthResponse<{}> = {
        profile,
        providerInfo: {},
        backstageIdentity: prepareBackstageIdentityResponse(identity),
      };

      res.status(200).json(response);
    },

    async logout(_, res) {
      res.end();
    },
  };
}
