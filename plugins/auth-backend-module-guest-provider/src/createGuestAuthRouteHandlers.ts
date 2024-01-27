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

/** @public */
export interface GuestAuthRouteHandlersOptions {
  config: Config;
  baseUrl: string;
  appUrl: string;
  resolverContext: AuthResolverContext;
  signInResolver: SignInResolver<{}>;
  profileTransform: ProfileTransform<{}>;
}

/** @public */
export function createGuestAuthRouteHandlers(
  options: GuestAuthRouteHandlersOptions,
): AuthProviderRouteHandlers {
  const { resolverContext, signInResolver, appUrl, profileTransform } = options;

  const createGuestSession = async (): Promise<ClientAuthResponse<{}>> => {
    const { profile } = await profileTransform({}, resolverContext);

    const identity = await signInResolver(
      { profile, result: {} },
      resolverContext,
    );

    return {
      profile,
      providerInfo: {},
      backstageIdentity: prepareBackstageIdentityResponse(identity),
    };
  };

  return {
    async start(_, res): Promise<void> {
      // We are the auth provider for guests, skip this step.
      res.redirect('handler/frame');
    },

    /**
     * This is where we create the token for the guest user. You can override the
     *  entityRef for the guest user with `signInResolver`.
     */
    async frameHandler(_, res): Promise<void> {
      const session = await createGuestSession();
      // post message back to popup if successful
      sendWebMessageResponse(res, appUrl, {
        type: 'authorization_response',
        response: session,
      });
    },

    /**
     * Support refreshing the guest user's token. This should just improve the experience of
     *  browsing while in guest mode.
     */
    async refresh(this: never, _: Request, res: Response): Promise<void> {
      const session = await createGuestSession();
      res.status(200).json(session);
    },

    async logout(_, res) {
      // If we don't send a response or it gets cached into a 204, the page will hang.
      res.end();
    },
  };
}
