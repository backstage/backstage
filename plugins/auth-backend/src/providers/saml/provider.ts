/*
 * Copyright 2020 Spotify AB
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

import express from 'express';
import { Strategy as SamlStrategy } from 'passport-saml';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
} from '../PassportStrategyHelper';
import { AuthProviderConfig, AuthProviderRouteHandlers } from '../types';
import { postMessageResponse } from '../OAuthProvider';

export class SamlAuthProvider implements AuthProviderRouteHandlers {
  private readonly strategy: SamlStrategy;

  constructor(providerConfig: AuthProviderConfig) {
    this.strategy = new SamlStrategy(
      { ...providerConfig.options },
      (profile: any, done: any) => {
        // TODO: There's plenty more validation and profile handling to do here,
        //       this provider is currently only intended to validate the provider pattern
        //       for non-oauth auth flows.
        // TODO: This flow doesn't issue an identity token that can be used to validate
        //       the identity of the user in other backends, which we need in some form.
        done(undefined, {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.displayName,
        });
      },
    );
  }

  async start(req: express.Request, res: express.Response): Promise<any> {
    const { url } = await executeRedirectStrategy(req, this.strategy, {});
    res.redirect(url);
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<any> {
    try {
      const { user } = await executeFrameHandlerStrategy(req, this.strategy);

      return postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    } catch (error) {
      return postMessageResponse(res, {
        type: 'auth-result',
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }

  async logout(_req: express.Request, res: express.Response): Promise<any> {
    res.send('noop');
  }
}

export function createSamlProvider(config: AuthProviderConfig) {
  return new SamlAuthProvider(config);
}
